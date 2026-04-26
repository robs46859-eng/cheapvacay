import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { createApiRouter } from "./routes/api.ts";
import { isProduction } from "./config.ts";
import { ensureFirebaseAdmin } from "./lib/firebase-admin.ts";
import { httpLogger } from "./middleware/httpLogger.ts";
import { getSentry } from "./sentryInit.ts";
import { config } from "./config.ts";

export async function createApp() {
  ensureFirebaseAdmin();
  const app = express();
  app.set("trust proxy", 1);
  app.use(httpLogger);
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", createApiRouter());

  if (!isProduction()) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (config.sentryDsn) {
    getSentry().setupExpressErrorHandler(app);
  }
  return app;
}
