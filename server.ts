import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDeals, getDestinationById, getDestinations } from './src/lib/server/dataStore.ts';
import { generateLaunchRoutes } from './src/lib/server/launchData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load `.env` from the project root (next to this file), not only `process.cwd()`,
// so `npm run dev` still works when the shell cwd is not the repo root.
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

const PORT = Number(process.env.PORT ?? 3000);

function getBudgetMultiplier(budgetLevel?: string) {
  switch (budgetLevel) {
    case 'mid':
      return 1.2;
    case 'luxury':
      return 1.75;
    default:
      return 1;
  }
}

const GEMINI_PLACEHOLDERS = new Set(
  ['', 'your_gemini_api_key', 'your_key_here', 'your_api_key_here'].map((s) => s.toLowerCase()),
);

function resolveGeminiApiKey(): string | undefined {
  const raw = process.env.GEMINI_API_KEY?.trim();
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (GEMINI_PLACEHOLDERS.has(lower)) return undefined;
  return raw;
}

async function generateAssistantResponse(message: string, tripContext: unknown, destinationContext: unknown) {
  const apiKey = resolveGeminiApiKey();

  if (!apiKey) {
    return [
      'AI assistant is not configured yet.',
      'Create a `.env` file in the project root (copy from `.env.example`) and set a real `GEMINI_API_KEY` from Google AI Studio.',
    ].join(' ');
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = [
    'You are a budget travel planning assistant for CheapVacay India.',
    'Keep answers concise, practical, and launch-safe.',
    'Focus on affordable India travel, route tradeoffs, seasonality, hotel savings, and budget risk.',
    'Use destination facts provided in context when available, including best months, local transport notes, and budget highlights.',
    'Do not invent live prices or claim supplier integrations or live supplier inventory exist.',
    'If context is missing, state the assumption and give the cheapest practical option first.',
  ].join(' ');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: JSON.stringify({
              message,
              tripContext,
              destinationContext,
            }),
          },
        ],
      },
    ],
    config: {
      systemInstruction,
      temperature: 0.6,
    },
  });

  return response.text ?? "I couldn't generate a response right now.";
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/destinations', async (_req, res) => {
    const destinations = await getDestinations();
    res.json(destinations);
  });

  app.get('/api/deals', async (_req, res) => {
    const deals = await getDeals();
    res.json(deals);
  });

  app.post('/api/budget/calculate', (req, res) => {
    const { trip, destination, routes } = req.body;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const budgetMultiplier = getBudgetMultiplier(trip.budgetLevel);

    const sampleDailyBudget = trip.budgetLevel === 'budget'
      ? Number(destination.sampleBudgetPerDay ?? 500)
      : Number(destination.sampleMidBudgetPerDay ?? 800);
    const foodPerDay = Math.max(450, sampleDailyBudget * 0.28) * trip.travelerCount * (budgetMultiplier * 0.95);
    const transportCost = routes.reduce((sum: number, route: { estimatedCost: number }) => sum + route.estimatedCost, 0);
    const hotelCost = destination.avgHotelPrice * days * Math.max(1, Math.ceil(trip.travelerCount / 2)) * budgetMultiplier;
    const activitiesCost = Math.max(700, sampleDailyBudget * 0.33) * days * destination.baseCostIndex * Math.max(1, budgetMultiplier * 0.92);
    const miscCost = Math.max(300, sampleDailyBudget * 0.18) * days * Math.max(1, budgetMultiplier * 0.9);

    const subtotal = foodPerDay * days + transportCost + hotelCost + activitiesCost + miscCost;
    const buffer = subtotal * 0.1;
    const totalCost = subtotal + buffer;

    res.json({
      transportCost,
      hotelCost,
      foodEstimate: Math.round(foodPerDay * days),
      activitiesCost: Math.round(activitiesCost),
      miscCost: Math.round(miscCost),
      buffer: Math.round(buffer),
      totalCost: Math.round(totalCost),
    });
  });

  app.post('/api/routes/generate', async (req, res) => {
    const { origin, destinationId, travelers, budgetLevel } = req.body;
    const destination = await getDestinationById(destinationId);

    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    const routes = generateLaunchRoutes(origin, destination, travelers, budgetLevel);
    res.json(routes);
  });

  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message, tripContext, destinationContext } = req.body;

      if (typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const text = await generateAssistantResponse(message, tripContext, destinationContext);
      res.json({ text });
    } catch (error) {
      console.error('Assistant error:', error);
      res.status(500).json({ error: 'Assistant unavailable' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CheapVacay India running on http://localhost:${PORT}`);
    if (!resolveGeminiApiKey()) {
      console.warn(
        `[CheapVacay] GEMINI_API_KEY is missing or still a placeholder. Loaded env from: ${envPath}`,
      );
    }
  });
}

startServer();
