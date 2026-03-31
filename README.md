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

## Local Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Create `.env`

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
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

- The current release is intentionally mock-data driven for destinations and transport options.
- Saved trips are stored in browser local storage.
- Firebase files are present, but auth and synced persistence are not part of the current launch slice.
- Database SQL files exist in the repo but are not used by the running application.

## Launch Work

See [LAUNCH_CHECKLIST.md](/Users/joeiton/cheapvacay/LAUNCH_CHECKLIST.md) for the recommended first launch sequence.

## Deployment

See [DEPLOY.md](/Users/joeiton/cheapvacay/DEPLOY.md) for the recommended first deployment path.
