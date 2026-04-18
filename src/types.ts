export type Destination = {
  id: string;
  name: string;
  region: string;
  vibe: string;
  hero: string;
  summary: string;
  bestMonths: string[];
  averageNightlyStay: number;
  averageMealBudget: number;
  localTransitDaily: number;
  tags: string[];
  highlights: string[];
};

export type PlannerRequest = {
  origin: string;
  destinationId: string;
  travelers: number;
  nights: number;
  budgetProfile: "lean" | "smart" | "comfort";
  transportPreference: "cheapest" | "balanced" | "fastest";
};

export type QuoteBreakdown = {
  label: string;
  amount: number;
  notes: string;
};

export type PlannerQuote = {
  destination: Destination;
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

export type PlannerResponse = {
  quote: PlannerQuote;
  advice: string;
  savedPlan: SavedTripPlan;
};

export type SavedTripPlan = {
  id: string;
  userKey: string;
  createdAt: string;
  updatedAt: string;
  request: PlannerRequest;
  quote: PlannerQuote;
  advice: string;
};
