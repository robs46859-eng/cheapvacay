export type DestinationRecord = {
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

export const destinations: DestinationRecord[] = [
  {
    id: "goa",
    name: "Goa",
    region: "West Coast",
    vibe: "Beach reset with nightlife upside",
    hero: "Sunrise buses, hostel rooftops, and cheap seafood by scooter.",
    summary: "Goa works best when you lock flights or sleeper buses early, stay slightly inland, and travel outside the heaviest holiday spikes.",
    bestMonths: ["November", "January", "February", "March"],
    averageNightlyStay: 2400,
    averageMealBudget: 700,
    localTransitDaily: 450,
    tags: ["beach", "nightlife", "remote-work", "groups"],
    highlights: ["Hostel density", "Scooter-friendly", "Off-season bargains"],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    region: "Rajasthan",
    vibe: "History-heavy city break",
    hero: "Pink facades, fort days, cheap thalis, and strong rail access.",
    summary: "Jaipur is one of the easiest budget wins because rail and bus links are strong and you can stack multiple landmarks without expensive logistics.",
    bestMonths: ["October", "November", "December", "February"],
    averageNightlyStay: 1800,
    averageMealBudget: 550,
    localTransitDaily: 350,
    tags: ["heritage", "food", "weekend", "solo"],
    highlights: ["Dense sightseeing", "Rail-friendly", "High value hotels"],
  },
  {
    id: "manali",
    name: "Manali",
    region: "Himachal Pradesh",
    vibe: "Mountain escape with weather risk",
    hero: "Overnight buses, river views, and low-cost cafés in cold air.",
    summary: "Manali stays budget-friendly if you book transport ahead, avoid peak holiday dates, and keep local touring concentrated by zone.",
    bestMonths: ["March", "April", "May", "September"],
    averageNightlyStay: 1700,
    averageMealBudget: 600,
    localTransitDaily: 500,
    tags: ["mountains", "scenic", "couples", "weekend"],
    highlights: ["Affordable guesthouses", "Strong overnight bus network", "Shoulder-season value"],
  },
  {
    id: "munnar",
    name: "Munnar",
    region: "Kerala Highlands",
    vibe: "Slow scenic hills",
    hero: "Tea estates, winding roads, and quiet stays where timing matters.",
    summary: "Munnar has softer demand than Goa and can be a great value if you pair Kochi entry with a compact hill itinerary and shared transfers.",
    bestMonths: ["September", "October", "January", "February"],
    averageNightlyStay: 2100,
    averageMealBudget: 650,
    localTransitDaily: 400,
    tags: ["nature", "slow-travel", "couples", "photography"],
    highlights: ["Low-noise destination", "Good off-peak value", "Compact itinerary potential"],
  },
  {
    id: "varanasi",
    name: "Varanasi",
    region: "Uttar Pradesh",
    vibe: "High-intensity cultural trip",
    hero: "Ghats at dawn, cheap rooms, and short-stay cultural density.",
    summary: "Varanasi is one of the cheapest strong-identity trips in India if you keep the stay central and treat it as a focused 2-3 night visit.",
    bestMonths: ["October", "November", "December", "February"],
    averageNightlyStay: 1400,
    averageMealBudget: 450,
    localTransitDaily: 250,
    tags: ["culture", "budget", "solo", "short-stay"],
    highlights: ["Low accommodation spend", "Dense cultural draw", "Short itinerary friendly"],
  },
];
