# Production operations (Render)

## Secrets and the blueprint

`render.yaml` lists **non-secret** defaults (`NODE_ENV`, `PORT`, `LOG_LEVEL`, rate-limit numerics) and marks everything sensitive with **`sync: false`**. Those values must be set in the [Render dashboard](https://dashboard.render.com) (or the Render API), not committed.

Required naming:

- **Gemini:** `GEMINI_API_KEY` (not `GEMINIAPIKEY` or `GEMINI_APIKEY`).

## Logging

- **Pino** structured logs; level from **`LOG_LEVEL`** (default `info` in production, `debug` locally).
- Request logging uses **pino-http**; `/api/health` is skipped in access logs to reduce noise.
- Authorization, `X-Firebase-AppCheck`, and `Cookie` headers are **redacted** in logs.

## Rate limits

Per-IP, backed by in-memory `express-rate-limit` (suitable for a single node; scale horizontally you would move to a Redis store).

| Variable | Role |
|----------|------|
| `API_RATE_LIMIT_MAX` / `API_RATE_LIMIT_WINDOW_MS` | All `/api/*` except skipped health |
| `QUOTE_RATE_LIMIT_MAX` / `QUOTE_RATE_LIMIT_WINDOW_MS` | `POST` quote / planner paths |

`GET /api/health` returns a JSON summary including these caps when you need to confirm config.

**Behind Render:** `trust proxy` is enabled in production so the client IP is correct for rate limiting.

## Error tracking

- Set **`SENTRY_DSN`** in production to enable **@sentry/node** (release string `cheapvacay-india@<version>` from `package.json`).
- If `SENTRY_DSN` is empty, Sentry is not initialized; the app still returns JSON error bodies in API routes.

## npm audit

Some advisory findings are **transitive** (e.g. under `firebase-admin` / Google client libraries). `npm audit fix --force` may pin incompatible major versions. Prefer upgrading parent packages on a schedule, or use **overrides** only after testing. Re-run `npm audit` after dependency bumps.
