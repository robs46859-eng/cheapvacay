import { destinations, type DestinationRecord } from "../data/destinations.ts";

export type BudgetProfile = "lean" | "smart" | "comfort";
export type TransportPreference = "cheapest" | "balanced" | "fastest";
export type StayType = "hostel" | "homestay" | "boutique";

export type PlannerRequest = {
  origin: string;
  destinationId: string;
  travelDate: string;
  travelers: number;
  nights: number;
  budgetProfile: BudgetProfile;
  transportPreference: TransportPreference;
  stayType: StayType;
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
  isLiveData?: boolean;
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

const stayMultipliers: Record<StayType, number> = {
  hostel: 0.65,
  homestay: 0.9,
  boutique: 1.45,
};

function clampWholeNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}

export function parsePlannerRequest(payload: unknown): PlannerRequest {
  const body = typeof payload === "object" && payload !== null ? payload as Record<string, unknown> : {};
  const origin = String(body.origin ?? "DEL").trim().toUpperCase();
  const destinationId = String(body.destinationId ?? "").trim();
  const travelDate = String(body.travelDate ?? new Date().toISOString().split("T")[0]).trim();
  const budgetProfile = String(body.budgetProfile ?? "smart") as BudgetProfile;
  const transportPreference = String(body.transportPreference ?? "balanced") as TransportPreference;
  const stayType = String(body.stayType ?? "homestay") as StayType;
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

  if (!["hostel", "homestay", "boutique"].includes(stayType)) {
    throw new Error("Stay type is invalid.");
  }

  return {
    origin,
    destinationId,
    travelDate,
    travelers,
    nights,
    budgetProfile,
    transportPreference,
    stayType,
  };
}

export function listDestinations() {
  return destinations;
}

export type LiveDataValues = {
  flightPrice?: number | null;
  hotelPricePerNight?: number | null;
};

export function buildQuote(request: PlannerRequest, liveData: LiveDataValues = {}): PlannerQuote {
  const destination = destinations.find((entry) => entry.id === request.destinationId);
  if (!destination) {
    throw new Error("Destination not found.");
  }

  const budgetMultiplier = budgetMultipliers[request.budgetProfile];
  const transportMultiplier = transportMultipliers[request.transportPreference];
  const stayMultiplier = stayMultipliers[request.stayType];
  const roomCount = Math.max(1, Math.ceil(request.travelers / 2));

  // Use live data if available, else fall back to model
  const intercityBase = 1200 + destination.averageNightlyStay * 0.25;
  const modeledIntercity = Math.round(intercityBase * request.travelers * transportMultiplier);
  const intercityTravel = liveData.flightPrice 
    ? liveData.flightPrice * request.travelers 
    : modeledIntercity;

  const modeledStay = Math.round(destination.averageNightlyStay * roomCount * request.nights * budgetMultiplier * stayMultiplier);
  const stay = liveData.hotelPricePerNight 
    ? Math.round(liveData.hotelPricePerNight * roomCount * request.nights) 
    : modeledStay;

  const food = Math.round(destination.averageMealBudget * request.travelers * request.nights * budgetMultiplier);
  const local = Math.round(destination.localTransitDaily * request.nights * transportMultiplier);
  const activities = Math.round((destination.averageNightlyStay * 0.42) * request.nights * budgetMultiplier);
  const contingency = Math.round((intercityTravel + stay + food + local + activities) * 0.12);

  const total = intercityTravel + stay + food + local + activities + contingency;

  const isLiveData = !!(liveData.flightPrice || liveData.hotelPricePerNight);

  const travelMode = request.transportPreference === "fastest"
    ? "Flight first, local cab/rideshare support"
    : request.transportPreference === "cheapest"
      ? "Sleeper train or bus first, low-friction local transfers"
      : "Hybrid train/flight search with local transit backstop";

  return {
    destination,
    request,
    travelMode,
    isLiveData,
    rationale: [
      `${destination.name} fits a ${request.nights}-night trip using ${request.stayType} lodging.`,
      isLiveData ? "Real-time pricing data integrated for flights and stays." : "Estimated costs based on regional budget benchmarks.",
      `${request.budgetProfile === "lean" ? "Spend is constrained aggressively, so activities and stay quality are trimmed first." : "Budget leaves room for a cleaner stay and small experience buffer."}`,
    ],
    breakdown: [
      { 
        label: "Intercity travel", 
        amount: intercityTravel, 
        notes: liveData.flightPrice ? `Live flight fare: ${liveData.flightPrice}/person.` : `${travelMode}.` 
      },
      { 
        label: "Stay", 
        amount: stay, 
        notes: liveData.hotelPricePerNight ? `Live stay rate: ${liveData.hotelPricePerNight}/night for ${roomCount} room(s).` : `${roomCount} room${roomCount > 1 ? "s" : ""} in a ${request.stayType}.` 
      },
      { label: "Food", amount: food, notes: "Daily meal budget matched to destination price level." },
      { label: "Local movement", amount: local, notes: "Station, airport, and local in-city movement." },
      { label: "Activities", amount: activities, notes: "Low-friction attraction budget, not luxury tours." },
      { label: "Contingency", amount: contingency, notes: "12% shock absorber for timing or fare drift." },
    ],
    total,
    dailyAverage: Math.round(total / Math.max(1, request.nights)),
    scorecard: {
      value: request.budgetProfile === "lean" ? "High if dates stay flexible" : "Balanced value",
      comfort: request.stayType === "boutique" ? "Elevated boutique comfort" : request.budgetProfile === "comfort" ? "Above baseline comfort" : "Efficient, not indulgent",
      complexity: request.transportPreference === "cheapest" ? "Moderate" : "Low to moderate",
    },
  };
}
