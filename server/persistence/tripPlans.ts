import crypto from "node:crypto";
import { getFirestore } from "firebase-admin/firestore";
import type { PlannerQuote, PlannerRequest } from "../domain/planner.ts";

export type SavedTripPlan = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  request: PlannerRequest;
  quote: PlannerQuote;
  advice: string;
};

function stripUndefined<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as object)) {
    if (val !== undefined) {
      out[key] = stripUndefined(val);
    }
  }
  return out as T;
}

function plansCollection(userId: string) {
  return getFirestore().collection("users").doc(userId).collection("tripPlans");
}

export async function saveTripPlan(
  userId: string,
  request: PlannerRequest,
  quote: PlannerQuote,
  advice: string,
): Promise<SavedTripPlan> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const plan: SavedTripPlan = {
    id,
    userId,
    createdAt: now,
    updatedAt: now,
    request,
    quote,
    advice,
  };
  const payload = stripUndefined({
    ...plan,
  });
  await plansCollection(userId).doc(id).set(payload);
  return plan;
}

export async function listRecentTripPlans(userId: string, limit = 8): Promise<SavedTripPlan[]> {
  const cap = Math.max(1, Math.min(limit, 25));
  const snap = await plansCollection(userId).orderBy("createdAt", "desc").limit(cap).get();
  return snap.docs.map((doc) => doc.data() as SavedTripPlan);
}

export async function findTripPlanById(id: string, userId: string): Promise<SavedTripPlan | null> {
  const ref = plansCollection(userId).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  return doc.data() as SavedTripPlan;
}
