import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { createApiRouter } from "./routes/api.ts";
import { isProduction } from "./config.ts";

export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api", createApiRouter());

  if (!isProduction()) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    return app;
  }

  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  return app;
}
