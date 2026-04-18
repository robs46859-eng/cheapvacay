# CheapVacay Deploy Checklist

This is the shortest path from local rewrite to a deployable launch build.

## 1. Local quality gate

- Run `npm ci`
- Run `npm run lint`
- Run `npm run build`
- Run `npm run dev`
- Confirm `/api/health` returns `{ "status": "ok" }`
- Generate one trip quote from the UI
- Confirm the app still works without `GEMINI_API_KEY`

## 2. Environment setup

- Copy `.env.example` to `.env`
- Set `PORT=3000`
- Set `DATA_DIR=./data` locally
- Set `GEMINI_API_KEY` only if live Gemini responses are desired
- Keep secrets out of git

## 3. Product sanity before shipping

- Verify all destination copy is deliberate and accurate enough for launch
- Verify quote math feels internally consistent across `lean`, `smart`, and `comfort`
- Verify no UI copy claims live fares, live hotel inventory, or real booking integrations
- Verify error states are readable when API calls fail

## 4. Deployment target

- Preferred first host: Render
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Runtime: Node

## 5. Render configuration

- Add `NODE_ENV=production`
- Add `PORT=3000` if needed by the host config
- Attach a persistent disk and mount it at `/var/data`
- Add `DATA_DIR=/var/data`
- Add `GEMINI_API_KEY` if assistant output should use Gemini instead of fallback guidance
- Confirm `render.yaml` matches the chosen service settings if using blueprint deploy

## 6. Post-deploy smoke test

- Homepage loads
- Destinations render
- Planner form submits successfully
- Quote totals render with no console errors
- AI advice panel returns either Gemini output or fallback advice
- A generated quote appears in the saved plans list
- Restart the service and confirm saved plans still exist
- Refresh the page and confirm static asset serving still works
- Hit `/api/health` in production

## 7. Pre-promotion hard stop

Do not promote the app until these are true:

- Local lint and build pass
- Production smoke test passes
- Domain is connected
- Basic analytics or logging is in place
- You have one rollback path documented

## 8. Immediate next upgrades after deploy

- Persist saved plans server-side instead of only relying on browser state
- Add request logging and error telemetry
- Add a real transport/hotel sourcing layer only after the current quote model is stable
- Add test coverage around quote generation and request validation
