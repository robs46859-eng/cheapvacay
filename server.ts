import dotenv from "dotenv";
import { createApp } from "./server/app.ts";
import { config } from "./server/config.ts";
import { initSentry } from "./server/sentryInit.ts";
import { rootLogger } from "./server/lib/logger.ts";

dotenv.config();
initSentry();

async function startServer() {
  const app = await createApp();
  app.listen(config.port, "0.0.0.0", () => {
    rootLogger.info(
      { port: config.port, environment: config.nodeEnv, sentry: Boolean(config.sentryDsn) },
      "CheapVacay India listening",
    );
  });
}

startServer().catch((err: unknown) => {
  rootLogger.fatal({ err }, "server failed to start");
  process.exit(1);
});
