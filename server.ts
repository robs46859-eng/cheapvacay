/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const destinations = [
    {
      id: '1',
      name: 'Manali',
      region: 'Himachal Pradesh',
      country: 'India',
      baseCostIndex: 0.8,
      description: 'A high-altitude Himalayan resort town known for its cool climate and snow-capped mountains.',
      avgHotelPrice: 1500,
      imageUrl: 'https://picsum.photos/seed/manali/800/600'
    },
    {
      id: '2',
      name: 'Goa',
      region: 'West Coast',
      country: 'India',
      baseCostIndex: 1.2,
      description: 'Famous for its beaches, nightlife, and Portuguese heritage.',
      avgHotelPrice: 2500,
      imageUrl: 'https://picsum.photos/seed/goa/800/600'
    },
    {
      id: '3',
      name: 'Jaipur',
      region: 'Rajasthan',
      country: 'India',
      baseCostIndex: 1.0,
      description: 'The Pink City, known for its historic forts and palaces.',
      avgHotelPrice: 2000,
      imageUrl: 'https://picsum.photos/seed/jaipur/800/600'
    },
    {
      id: '4',
      name: 'Munnar',
      region: 'Kerala',
      country: 'India',
      baseCostIndex: 1.1,
      description: 'A town in the Western Ghats mountain range, famous for its tea plantations and rolling hills.',
      avgHotelPrice: 2200,
      imageUrl: 'https://picsum.photos/seed/munnar/800/600'
    },
    {
      id: '5',
      name: 'Varanasi',
      region: 'Uttar Pradesh',
      country: 'India',
      baseCostIndex: 0.7,
      description: 'One of the oldest continuously inhabited cities in the world, spiritual capital of India.',
      avgHotelPrice: 1200,
      imageUrl: 'https://picsum.photos/seed/varanasi/800/600'
    }
  ];

  // API Routes
  app.get('/api/destinations', (req, res) => {
    res.json(destinations);
  });

  app.post('/api/budget/calculate', (req, res) => {
    const { trip, destination, routes } = req.body;
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    const foodPerDay = 500 * trip.travelerCount * destination.baseCostIndex;
    const transportCost = routes.reduce((sum: number, r: any) => sum + r.estimatedCost, 0);
    const hotelCost = destination.avgHotelPrice * days * trip.travelerCount;
    const activitiesCost = 1000 * days * destination.baseCostIndex;
    const miscCost = 500 * days;
    
    const subtotal = foodPerDay * days + transportCost + hotelCost + activitiesCost + miscCost;
    const buffer = subtotal * 0.1;
    const totalCost = subtotal + buffer;

    res.json({
      transportCost,
      hotelCost,
      foodEstimate: foodPerDay * days,
      activitiesCost,
      miscCost,
      buffer,
      totalCost
    });
  });

  app.post('/api/routes/generate', (req, res) => {
    const { origin, destinationId } = req.body;
    const dest = destinations.find(d => d.id === destinationId);
    
    if (!dest) return res.status(404).json({ error: 'Destination not found' });

    // Mock route generation
    const routes = [
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'bus',
        duration: 480, // 8 hours
        estimatedCost: 800,
        provider: 'State Transport',
        metadata: { stops: 4 }
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'taxi',
        duration: 360, // 6 hours
        estimatedCost: 3500,
        provider: 'Private Operator',
        metadata: { stops: 2 }
      }
    ];

    res.json(routes);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
