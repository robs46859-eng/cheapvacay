import pino from "pino";
import { config } from "../config.ts";

const allowedLevels = ["fatal", "error", "warn", "info", "debug", "trace"] as const;
const levelOk = (allowedLevels as readonly string[]).includes(config.logLevel) ? config.logLevel : "info";

export const rootLogger = pino({
  level: levelOk,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.x-firebase-appcheck",
      "req.headers.cookie",
    ],
    remove: true,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
