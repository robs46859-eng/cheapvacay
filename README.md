# CheapVacay India

CheapVacay India is now a clean single-repo web app for budget-first trip planning across India. The codebase was rebuilt around a typed Express API, a simpler React client, and explicit launch-safe quote logic instead of scattered demo logic.

## What The Rewrite Does

- Curated India destination catalog with explicit cost characteristics
- Typed planner request -> quote flow with breakdown, rationale, and scorecard
- Server-backed advice generation with Gemini when configured and safe fallback when it is not
- **Google sign-in (Firebase Auth)** and **saved trip plans in Cloud Firestore** (server-side, verified with Firebase Admin)
- **Firebase App Check** (reCAPTCHA v3) on the web client, verified on every API route except `GET /api/health`; **ID token checks use revocation** (`verifyIdToken(..., true)`)
- Production-ready single service deployment path via Render
- Cleaner separation between API routes, planning logic, assistant service, and UI

## Stack

- React 19
- Vite 6
- Express
- TypeScript
- Tailwind CSS 4
- Gemini via `@google/genai`
- Firebase (Auth + Firestore) on Google Cloud

## Structure

```text
server/
  app.ts
  config.ts
  data/destinations.ts
  domain/planner.ts
  routes/api.ts
  services/assistant.ts
  persistence/tripPlans.ts
  lib/firebase-admin.ts
  auth/bearer.ts
  auth/appCheck.ts

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

Use `.env.example` as the starting point. You need a Firebase project with **Authentication** (Google), **Firestore**, and **App Check** (reCAPTCHA v3 provider for the web app). Set the `VITE_*` and `VITE_APPCHECK_RECAPTCHA_SITE_KEY` in `.env` for the client build, and a **service account** JSON for the server (`FIREBASE_SERVICE_ACCOUNT` or `GOOGLE_APPLICATION_CREDENTIALS`). In development, App Check enforcement is **off** by default unless `APPCHECK_ENFORCE=true`.

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
- Trip plans are stored in **Firestore** per signed-in user; the API never trusts the client without a valid ID token.
- The app is a single Node service (Express + static Vite build); the UI talks only to your API, not to Firestore directly.
- The local model workflow is documented in [docs/local-model-workflow.md](docs/local-model-workflow.md).

## Launch And Deployment

- Launch sequence: [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)
- Deploy instructions: [DEPLOY.md](DEPLOY.md)
- Deploy gate checklist: [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)
