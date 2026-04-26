import pinoHttp from "pino-http";
import { rootLogger } from "../lib/logger.ts";

export const httpLogger = pinoHttp({
  logger: rootLogger,
  autoLogging: {
    ignore: (req) => req.url === "/api/health",
  },
});
