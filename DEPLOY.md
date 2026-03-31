# Deploy CheapVacay India

## Recommended First Host

Render is the simplest fit for the current stack because the app is one Express server that also serves the Vite build.

## Render Setup

1. Push the repo to GitHub.
2. In Render, create a new Web Service from the repo.
3. Render can read [render.yaml](/Users/joeiton/cheapvacay/render.yaml) automatically, or you can set these manually:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `Node`

4. Add environment variables:

- `NODE_ENV=production`
- `GEMINI_API_KEY=your_real_key`

## Pre-Deploy Check

Run locally first:

```bash
npm run lint
npm run build
npm run dev
```

## Post-Deploy Smoke Test

- Homepage loads and destination cards render
- Planner loads for at least one destination
- Route generation works
- Budget calculation works
- Saved trip flow works in browser
- Assistant returns a real response

## Immediate Next Improvement

Add analytics before public promotion so you can measure:

- homepage visits
- planner starts
- route searches
- trip saves
- assistant prompts
