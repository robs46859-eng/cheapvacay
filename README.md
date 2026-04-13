# CheapVacay India

CheapVacay India is a launch-focused MVP for budget trip planning across India. Users can browse destinations, compare transport options, estimate end-to-end trip cost, save draft itineraries locally, and ask a server-backed AI assistant for budget-aware travel guidance.

## Current MVP Scope

- Destination discovery for India-focused budget trips
- Route generation with practical low-cost transport options
- Full trip estimate including transport, hotel, food, activities, and contingency buffer
- Saved trip drafts in local storage
- Gemini-backed assistant behind the server API

## Stack

- React 19
- Vite 6
- Express
- TypeScript
- Tailwind CSS 4
- Gemini via `@google/genai`
- Postgres-ready data layer via `pg`

## Local Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Create `.env`

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/cheapvacay
DATABASE_SSL=false
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Notes

- The app now ships with a curated launch dataset for destinations, route heuristics, and launch offers.
- If `DATABASE_URL` is set, the server will read destinations and deals from Postgres and fall back to the bundled launch dataset if the database is unavailable.
- Saved trips are stored in browser local storage.
- Firebase files are present, but auth and synced persistence are not part of the current launch slice.
- Database SQL files now match the launch data model closely enough to support Postgres-backed launch records.

## Progress

- Replaced server-embedded destination mocks with a launch dataset and repository layer.
- Added `/api/deals` so launch offers come from data instead of a hardcoded React constant.
- Expanded route generation beyond bus/taxi-only output to include train and flight options.
- Added destination budget notes that surface in the planner once a trip is priced.
- Added optional Postgres wiring so launch can move from bundled data to managed records without changing the frontend.

## Launch Work

See [LAUNCH_CHECKLIST.md](/Users/joeiton/cheapvacay/LAUNCH_CHECKLIST.md) for the recommended first launch sequence.

## Deployment

See [DEPLOY.md](/Users/joeiton/cheapvacay/DEPLOY.md) for the recommended first deployment path.
