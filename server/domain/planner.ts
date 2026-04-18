import { destinations, type DestinationRecord } from "../data/destinations.ts";

export type BudgetProfile = "lean" | "smart" | "comfort";
export type TransportPreference = "cheapest" | "balanced" | "fastest";

export type PlannerRequest = {
  origin: string;
  destinationId: string;
  travelers: number;
  nights: number;
  budgetProfile: BudgetProfile;
  transportPreference: TransportPreference;
};

export type QuoteBreakdown = {
  label: string;
  amount: number;
  notes: string;
};

export type PlannerQuote = {
  destination: DestinationRecord;
  request: PlannerRequest;
  travelMode: string;
  rationale: string[];
  breakdown: QuoteBreakdown[];
  total: number;
  dailyAverage: number;
  scorecard: {
    value: string;
    comfort: string;
    complexity: string;
  };
};

const budgetMultipliers: Record<BudgetProfile, number> = {
  lean: 0.84,
  smart: 1,
  comfort: 1.28,
};

const transportMultipliers: Record<TransportPreference, number> = {
  cheapest: 0.85,
  balanced: 1,
  fastest: 1.35,
};

function clampWholeNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}

export function parsePlannerRequest(payload: unknown): PlannerRequest {
  const body = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
  const origin = String(body.origin ?? "").trim();
  const destinationId = String(body.destinationId ?? "").trim();
  const budgetProfile = String(body.budgetProfile ?? "smart") as BudgetProfile;
  const transportPreference = String(body.transportPreference ?? "balanced") as TransportPreference;
  const travelers = clampWholeNumber(body.travelers, 2, 1, 8);
  const nights = clampWholeNumber(body.nights, 3, 1, 21);

  if (!origin) {
    throw new Error("Origin is required.");
  }

  if (!destinationId) {
    throw new Error("Destination is required.");
  }

  if (!["lean", "smart", "comfort"].includes(budgetProfile)) {
    throw new Error("Budget profile is invalid.");
  }

  if (!["cheapest", "balanced", "fastest"].includes(transportPreference)) {
    throw new Error("Transport preference is invalid.");
  }

  return {
    origin,
    destinationId,
    travelers,
    nights,
    budgetProfile,
    transportPreference,
  };
}

export function listDestinations() {
  return destinations;
}

export function buildQuote(request: PlannerRequest): PlannerQuote {
  const destination = destinations.find((entry) => entry.id === request.destinationId);
  if (!destination) {
    throw new Error("Destination not found.");
  }

  const budgetMultiplier = budgetMultipliers[request.budgetProfile];
  const transportMultiplier = transportMultipliers[request.transportPreference];
  const roomCount = Math.max(1, Math.ceil(request.travelers / 2));

  const intercityBase = 1200 + destination.averageNightlyStay * 0.25;
  const intercityTravel = Math.round(intercityBase * request.travelers * transportMultiplier);
  const stay = Math.round(destination.averageNightlyStay * roomCount * request.nights * budgetMultiplier);
  const food = Math.round(destination.averageMealBudget * request.travelers * request.nights * budgetMultiplier);
  const local = Math.round(destination.localTransitDaily * request.nights * transportMultiplier);
  const activities = Math.round((destination.averageNightlyStay * 0.42) * request.nights * budgetMultiplier);
  const contingency = Math.round((intercityTravel + stay + food + local + activities) * 0.12);

  const total = intercityTravel + stay + food + local + activities + contingency;

  const travelMode = request.transportPreference === "fastest"
    ? "Flight first, local cab/rideshare support"
    : request.transportPreference === "cheapest"
      ? "Sleeper train or bus first, low-friction local transfers"
      : "Hybrid train/flight search with local transit backstop";

  return {
    destination,
    request,
    travelMode,
    rationale: [
      `${destination.name} fits a ${request.nights}-night trip without forcing a multi-city plan.`,
      `${request.transportPreference === "cheapest" ? "Travel cost is kept down by biasing toward ground transport." : "Travel cost balances convenience and spend."}`,
      `${request.budgetProfile === "lean" ? "Spend is constrained aggressively, so activities and stay quality are trimmed first." : "Budget leaves room for a cleaner stay and small experience buffer."}`,
    ],
    breakdown: [
      { label: "Intercity travel", amount: intercityTravel, notes: `${travelMode}.` },
      { label: "Stay", amount: stay, notes: `${roomCount} room${roomCount > 1 ? "s" : ""} for ${request.nights} nights.` },
      { label: "Food", amount: food, notes: "Daily meal budget matched to destination price level." },
      { label: "Local movement", amount: local, notes: "Station, airport, and local in-city movement." },
      { label: "Activities", amount: activities, notes: "Low-friction attraction budget, not luxury tours." },
      { label: "Contingency", amount: contingency, notes: "12% shock absorber for timing or fare drift." },
    ],
    total,
    dailyAverage: Math.round(total / Math.max(1, request.nights)),
    scorecard: {
      value: request.budgetProfile === "lean" ? "High if dates stay flexible" : "Balanced value",
      comfort: request.budgetProfile === "comfort" ? "Above baseline comfort" : "Efficient, not indulgent",
      complexity: request.transportPreference === "cheapest" ? "Moderate" : "Low to moderate",
    },
  };
}
