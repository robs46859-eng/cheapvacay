import type { Destination, PlannerRequest, PlannerResponse, SavedTripPlan } from "../types";
import { firebaseAuth, getAppCheckTokenForApi } from "./firebase-app";

async function appCheckHeader(): Promise<Record<string, string>> {
  const token = await getAppCheckTokenForApi();
  return token ? { "X-Firebase-AppCheck": token } : {};
}

async function authHeader(): Promise<Record<string, string>> {
  const user = firebaseAuth.currentUser;
  if (!user) {
    return {};
  }
  const idToken = await user.getIdToken();
  return { Authorization: `Bearer ${idToken}` };
}

/** Standard headers for all API calls (App Check + optional ID token for signed-in routes). */
async function commonHeaders() {
  return {
    ...(await appCheckHeader()),
    ...(await authHeader()),
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(payload.error || "Request failed.");
  }
  return response.json() as Promise<T>;
}

export async function fetchDestinations() {
  const response = await fetch("/api/destinations", {
    headers: {
      ...(await appCheckHeader()),
    },
  });
  const payload = await parseJson<{ destinations: Destination[] }>(response);
  return payload.destinations;
}

export async function requestQuote(input: PlannerRequest) {
  const response = await fetch("/api/planner/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await commonHeaders()),
    },
    body: JSON.stringify(input),
  });
  return parseJson<PlannerResponse>(response);
}

export async function fetchSavedPlans() {
  const response = await fetch("/api/plans", {
    headers: {
      ...(await commonHeaders()),
    },
  });
  return parseJson<{ plans: SavedTripPlan[] }>(response);
}
