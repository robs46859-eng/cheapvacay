import dotenv from "dotenv";
import { createApp } from "./server/app.ts";
import { config } from "./server/config.ts";

dotenv.config();

async function startServer() {
  const app = await createApp();
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`CheapVacay India running on http://localhost:${config.port}`);
  });
}

startServer();
