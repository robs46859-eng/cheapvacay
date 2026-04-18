export const config = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() || "",
  dataDir: process.env.DATA_DIR?.trim() || "./data",
} as const;

export function isProduction() {
  return config.nodeEnv === "production";
}
