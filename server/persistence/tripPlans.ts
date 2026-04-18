import crypto from "node:crypto";
import { getDatabase } from "./database.ts";
import type { PlannerQuote, PlannerRequest } from "../domain/planner.ts";

export type SavedTripPlan = {
  id: string;
  userKey: string;
  createdAt: string;
  updatedAt: string;
  request: PlannerRequest;
  quote: PlannerQuote;
  advice: string;
};

type TripPlanRow = {
  id: string;
  user_key: string | null;
  origin: string;
  destination_id: string;
  destination_name: string;
  travelers: number;
  nights: number;
  budget_profile: PlannerRequest["budgetProfile"];
  transport_preference: PlannerRequest["transportPreference"];
  travel_mode: string;
  total: number;
  daily_average: number;
  advice: string;
  quote_json: string;
  created_at: string;
  updated_at: string;
};

const insertPlan = getDatabase().prepare(`
  INSERT INTO trip_plans (
    id,
    user_key,
    origin,
    destination_id,
    destination_name,
    travelers,
    nights,
    budget_profile,
    transport_preference,
    travel_mode,
    total,
    daily_average,
    advice,
    quote_json,
    created_at,
    updated_at
  ) VALUES (
    :id,
    :user_key,
    :origin,
    :destination_id,
    :destination_name,
    :travelers,
    :nights,
    :budget_profile,
    :transport_preference,
    :travel_mode,
    :total,
    :daily_average,
    :advice,
    :quote_json,
    :created_at,
    :updated_at
  )
`);

const listPlans = getDatabase().prepare(`
  SELECT *
  FROM trip_plans
  WHERE user_key = ?
  ORDER BY created_at DESC
  LIMIT ?
`);

const getPlan = getDatabase().prepare(`
  SELECT *
  FROM trip_plans
  WHERE id = ?
    AND user_key = ?
`);

export function saveTripPlan(userKey: string, request: PlannerRequest, quote: PlannerQuote, advice: string): SavedTripPlan {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  insertPlan.run({
    id,
    user_key: userKey,
    origin: request.origin,
    destination_id: request.destinationId,
    destination_name: quote.destination.name,
    travelers: request.travelers,
    nights: request.nights,
    budget_profile: request.budgetProfile,
    transport_preference: request.transportPreference,
    travel_mode: quote.travelMode,
    total: quote.total,
    daily_average: quote.dailyAverage,
    advice,
    quote_json: JSON.stringify(quote),
    created_at: now,
    updated_at: now,
  });

  return {
    id,
    userKey,
    createdAt: now,
    updatedAt: now,
    request,
    quote,
    advice,
  };
}

export function listRecentTripPlans(userKey: string, limit = 8): SavedTripPlan[] {
  const rows = listPlans.all(userKey, Math.max(1, Math.min(limit, 25))) as TripPlanRow[];
  return rows.map(mapTripPlanRow);
}

export function findTripPlanById(id: string, userKey: string): SavedTripPlan | null {
  const row = getPlan.get(id, userKey) as TripPlanRow | undefined;
  return row ? mapTripPlanRow(row) : null;
}

function mapTripPlanRow(row: TripPlanRow): SavedTripPlan {
  const quote = JSON.parse(row.quote_json) as PlannerQuote;
  return {
    id: row.id,
    userKey: row.user_key ?? "legacy-anonymous",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    request: {
      origin: row.origin,
      destinationId: row.destination_id,
      travelers: row.travelers,
      nights: row.nights,
      budgetProfile: row.budget_profile,
      transportPreference: row.transport_preference,
    },
    quote,
    advice: row.advice,
  };
}
