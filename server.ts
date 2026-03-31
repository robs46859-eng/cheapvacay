import dotenv from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);

const destinations = [
  {
    id: '1',
    name: 'Manali',
    region: 'Himachal Pradesh',
    country: 'India',
    baseCostIndex: 0.8,
    description: 'A Himalayan resort town with cooler weather, mountain views, and easy access to budget buses from north Indian cities.',
    avgHotelPrice: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '2',
    name: 'Goa',
    region: 'West Coast',
    country: 'India',
    baseCostIndex: 1.2,
    description: 'Popular beach destination with a wide spread of stays, nightlife, and seasonal price swings.',
    avgHotelPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '3',
    name: 'Jaipur',
    region: 'Rajasthan',
    country: 'India',
    baseCostIndex: 1.0,
    description: 'Historic city with forts, markets, and relatively accessible mid-budget accommodation.',
    avgHotelPrice: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '4',
    name: 'Munnar',
    region: 'Kerala',
    country: 'India',
    baseCostIndex: 1.1,
    description: 'Tea estates, hills, and scenic stays where local transport can shape the final budget more than hotel price.',
    avgHotelPrice: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '5',
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    country: 'India',
    baseCostIndex: 0.7,
    description: 'Dense, spiritual, and highly budget-flexible for travelers prioritizing low accommodation spend.',
    avgHotelPrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80',
  },
];

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

function generateRoutes(origin: string, destinationId: string, travelers = 1, budgetLevel = 'budget') {
  const destination = destinations.find((item) => item.id === destinationId);
  if (!destination) {
    return null;
  }

  const budgetMultiplier = getBudgetMultiplier(budgetLevel);
  const travelerMultiplier = Math.max(1, travelers);

  return [
    {
      id: `bus-${destinationId}`,
      tripId: '',
      type: 'bus',
      duration: 480,
      estimatedCost: Math.round(700 * destination.baseCostIndex * travelerMultiplier),
      provider: `${origin} State Transport`,
      metadata: { stops: 4, amenities: ['AC', 'Recliner'] },
    },
    {
      id: `train-taxi-${destinationId}`,
      tripId: '',
      type: 'taxi',
      duration: 360,
      estimatedCost: Math.round(2800 * destination.baseCostIndex * Math.max(1, travelerMultiplier / 2) * budgetMultiplier),
      provider: 'Private Transfer',
      metadata: { stops: 2, amenities: ['Door pickup'] },
    },
  ];
}

async function generateAssistantResponse(message: string, tripContext: unknown, destinationContext: unknown) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return [
      'AI assistant is not configured yet.',
      'Set `GEMINI_API_KEY` in your `.env` before using launch demos.',
    ].join(' ');
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = [
    'You are a budget travel planning assistant for CheapVacay India.',
    'Keep answers concise, practical, and launch-safe.',
    'Focus on affordable India travel, route tradeoffs, seasonality, hotel savings, and budget risk.',
    'Do not invent live prices or claim supplier integrations exist.',
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

  app.get('/api/destinations', (_req, res) => {
    res.json(destinations);
  });

  app.post('/api/budget/calculate', (req, res) => {
    const { trip, destination, routes } = req.body;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const budgetMultiplier = getBudgetMultiplier(trip.budgetLevel);

    const foodPerDay = 500 * trip.travelerCount * destination.baseCostIndex * (budgetMultiplier * 0.95);
    const transportCost = routes.reduce((sum: number, route: { estimatedCost: number }) => sum + route.estimatedCost, 0);
    const hotelCost = destination.avgHotelPrice * days * Math.max(1, Math.ceil(trip.travelerCount / 2)) * budgetMultiplier;
    const activitiesCost = 850 * days * destination.baseCostIndex * budgetMultiplier;
    const miscCost = 400 * days * budgetMultiplier;

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

  app.post('/api/routes/generate', (req, res) => {
    const { origin, destinationId, travelers, budgetLevel } = req.body;
    const routes = generateRoutes(origin, destinationId, travelers, budgetLevel);

    if (!routes) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

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
  });
}

startServer();
