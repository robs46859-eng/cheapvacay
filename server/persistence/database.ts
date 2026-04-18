import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "../config.ts";

const dataDirectory = path.resolve(process.cwd(), config.dataDir);
fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath = path.join(dataDirectory, "cheapvacay.sqlite");
const database = new DatabaseSync(databasePath);

database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  CREATE TABLE IF NOT EXISTS trip_plans (
    id TEXT PRIMARY KEY,
    user_key TEXT,
    origin TEXT NOT NULL,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    travelers INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    budget_profile TEXT NOT NULL,
    transport_preference TEXT NOT NULL,
    travel_mode TEXT NOT NULL,
    total INTEGER NOT NULL,
    daily_average INTEGER NOT NULL,
    advice TEXT NOT NULL,
    quote_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS trip_plans_created_at_idx
    ON trip_plans(created_at DESC);
`);

const columns = database
  .prepare("PRAGMA table_info(trip_plans)")
  .all() as Array<{ name: string }>;

if (!columns.some((column) => column.name === "user_key")) {
  database.exec(`
    ALTER TABLE trip_plans
    ADD COLUMN user_key TEXT;
  `);
}

database.exec(`
  CREATE INDEX IF NOT EXISTS trip_plans_user_key_created_at_idx
    ON trip_plans(user_key, created_at DESC);
`);

export function getDatabase() {
  return database;
}

export function getDatabasePath() {
  return databasePath;
}
