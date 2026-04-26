const nodeEnv = process.env.NODE_ENV ?? "development";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv,
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || "",
  amadeusClientId: process.env.AMADEUS_CLIENT_ID?.trim() || "",
  amadeusClientSecret: process.env.AMADEUS_CLIENT_SECRET?.trim() || "",
  /** Sentry DSN for production error reporting (optional). */
  sentryDsn: process.env.SENTRY_DSN?.trim() || "",
  /** Pino log level: fatal | error | warn | info | debug | trace (default: info in prod, debug in dev). */
  logLevel: process.env.LOG_LEVEL?.trim() || (nodeEnv === "production" ? "info" : "debug"),
  /** Max API requests per IP per window (general /api, excluding health). */
  rateLimitMax: Math.max(10, Number(process.env.API_RATE_LIMIT_MAX ?? 400)),
  rateLimitWindowMs: Math.max(1000, Number(process.env.API_RATE_LIMIT_WINDOW_MS ?? 900_000)),
  /** Stricter cap for POST /planner/quote. */
  quoteRateLimitMax: Math.max(3, Number(process.env.QUOTE_RATE_LIMIT_MAX ?? 40)),
  quoteRateLimitWindowMs: Math.max(60_000, Number(process.env.QUOTE_RATE_LIMIT_WINDOW_MS ?? 3_600_000)),
} as const;

/**
 * Reject unsigned clients when set true; server verifies `X-Firebase-AppCheck` with the Admin SDK.
 * Defaults: on in production, off in development, unless `APPCHECK_ENFORCE` is "true" / "false".
 */
export const appCheckEnforce =
  process.env.APPCHECK_ENFORCE === "true" ||
  (process.env.APPCHECK_ENFORCE !== "false" && nodeEnv === "production");

export function isProduction() {
  return config.nodeEnv === "production";
}
