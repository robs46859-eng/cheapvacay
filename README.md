# CheapVacay India

CheapVacay India is now a clean single-repo web app for budget-first trip planning across India. The codebase was rebuilt around a typed Express API, a simpler React client, and explicit launch-safe quote logic instead of scattered demo logic.

## What The Rewrite Does

- Curated India destination catalog with explicit cost characteristics
- Typed planner request -> quote flow with breakdown, rationale, and scorecard
- Server-backed advice generation with Gemini when configured and safe fallback when it is not
- Server-side SQLite persistence for saved trip plans
- Production-ready single service deployment path via Render
- Cleaner separation between API routes, planning logic, assistant service, and UI

## Stack

- React 19
- Vite 6
- Express
- TypeScript
- Tailwind CSS 4
- Gemini via `@google/genai`

## Structure

```text
server/
  app.ts
  config.ts
  data/destinations.ts
  domain/planner.ts
  routes/api.ts
  services/assistant.ts

src/
  components/
  lib/
  App.tsx
  main.tsx
  types.ts
```

## Local Setup

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Use `.env.example` as the starting point for local configuration.

Persistence defaults to `./data/cheapvacay.sqlite`. Override with `DATA_DIR` if you want the SQLite file somewhere else.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm start
npm run local:model -- --prompt "Summarize this repo"
```

## Notes

- Quote logic is intentionally deterministic and launch-safe.
- The app does not claim live hotel or transport inventory.
- Recent trip plans are persisted server-side in SQLite instead of browser-only storage.
- Database and Firebase artifacts are still in the repo, but the running app is currently a single deployable Node service.
- The local model workflow is documented in [docs/local-model-workflow.md](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/docs/local-model-workflow.md:1).

## Launch And Deployment

- Launch sequence: [LAUNCH_CHECKLIST.md](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/LAUNCH_CHECKLIST.md:1)
- Deploy instructions: [DEPLOY.md](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/DEPLOY.md:1)
- Deploy gate checklist: [DEPLOY_CHECKLIST.md](/Users/joeiton/Desktop/Rob/AndroidStudioProjects/cheapvacay/DEPLOY_CHECKLIST.md:1)
