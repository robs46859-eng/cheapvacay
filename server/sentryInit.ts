import * as Sentry from "@sentry/node";
import { config } from "./config.ts";
import { appVersion } from "./lib/version.ts";

let initialized = false;

export function initSentry() {
  if (initialized || !config.sentryDsn) {
    return;
  }
  const traces = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.12);
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.nodeEnv,
    release: `cheapvacay-india@${appVersion}`,
    tracesSampleRate: Math.min(1, Math.max(0, traces)),
    integrations: [Sentry.expressIntegration()],
  });
  initialized = true;
}

export function getSentry() {
  return Sentry;
}
