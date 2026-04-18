# Deploy CheapVacay India

## Recommended first host

Render is still the cleanest first host because the project is a single Express service that serves both the API and the built Vite client.

## Render setup

1. Push the repo to GitHub.
2. In Render, create a new Web Service from the repo.
3. Render can read [render.yaml](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/render.yaml:1) automatically, or you can set these manually:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `Node`

4. Add environment variables:

- `NODE_ENV=production`
- `DATA_DIR=/var/data`
- `GEMINI_API_KEY=your_real_key`

5. Attach a persistent disk for the SQLite file:

- Mount path: `/var/data`
- App database file will be created at `/var/data/cheapvacay.sqlite`

## Pre-deploy check

Run locally first:

```bash
npm run lint
npm run build
npm run dev
```

Then use [DEPLOY_CHECKLIST.md](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/DEPLOY_CHECKLIST.md:1) as the hard deploy gate.

## Post-deploy smoke test

- Homepage loads and destination cards render
- Planner submits for at least one destination
- Quote breakdown renders
- Advice panel returns either Gemini output or fallback guidance
- `/api/health` responds successfully
- Generate a quote, redeploy or restart the service, and confirm the saved plan still appears

## Immediate next improvement

Add analytics before public promotion so you can measure:

- homepage visits
- planner starts
- quote generations
- assistant responses
