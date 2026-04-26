# Deploy CheapVacay India

## Recommended first host

Render is still the cleanest first host because the project is a single Express service that serves both the API and the built Vite client.

## Render setup

1. Push the repo to GitHub.
2. In Render, create a new Web Service from the repo.
3. Render can read [render.yaml](render.yaml) automatically, or you can set these manually:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `Node`

4. Add environment variables (see [.env.example](.env.example)):

- `NODE_ENV=production`
- `FIREBASE_SERVICE_ACCOUNT` — full service account JSON (secret), same project as Firestore
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` — from Firebase **web** app (required at **build** time on Render)
- `VITE_APPCHECK_RECAPTCHA_SITE_KEY` — from Firebase **App Check** (reCAPTCHA v3) for the same web app; required in production for API calls
- `APPCHECK_ENFORCE` — optional; defaults to on in `NODE_ENV=production`
- `GEMINI_API_KEY` — optional; otherwise the assistant uses static fallback copy

5. In Firebase: enable **Authentication** (Google), **Firestore**, and **App Check** with the reCAPTCHA v3 provider, then register your production domain. Deploy [firestore.rules](firestore.rules) (default deny; server uses the Admin SDK).

## Pre-deploy check

Run locally first:

```bash
npm run lint
npm run build
npm run dev
```

Then use [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md) as the hard deploy gate.

## Post-deploy smoke test

- Homepage loads and destination cards render
- Planner submits for at least one destination
- Quote breakdown renders
- Advice panel returns either Gemini output or fallback guidance
- `/api/health` responds successfully
- Sign in, generate a quote, open the app on another device with the same Google account, and confirm the plan list matches

## Immediate next improvement

Add analytics before public promotion so you can measure:

- homepage visits
- planner starts
- quote generations
- assistant responses
