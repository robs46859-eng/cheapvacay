import type { Destination, PlannerRequest, PlannerResponse, SavedTripPlan } from "../types";
import { getUserKey } from "./user-key";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(payload.error || "Request failed.");
  }

  return response.json() as Promise<T>;
}

export async function fetchDestinations() {
  const response = await fetch("/api/destinations");
  const payload = await parseJson<{ destinations: Destination[] }>(response);
  return payload.destinations;
}

export async function requestQuote(input: PlannerRequest) {
  const response = await fetch("/api/planner/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Key": getUserKey(),
    },
    body: JSON.stringify(input),
  });

  return parseJson<PlannerResponse>(response);
}

export async function fetchSavedPlans() {
  const response = await fetch("/api/plans", {
    headers: {
      "X-User-Key": getUserKey(),
    },
  });
  const payload = await parseJson<{ plans: SavedTripPlan[] }>(response);
  return payload.plans;
}
