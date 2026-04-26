import { GoogleGenAI } from "@google/genai";
import { config } from "../config.ts";
import type { PlannerQuote } from "../domain/planner.ts";

export async function generateTripAdvice(quote: PlannerQuote) {
  if (!config.geminiApiKey) {
    return fallbackAdvice(quote);
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: JSON.stringify({
              destination: quote.destination.name,
              region: quote.destination.region,
              nights: quote.request.nights,
              travelers: quote.request.travelers,
              budgetProfile: quote.request.budgetProfile,
              transportPreference: quote.request.transportPreference,
              total: quote.total,
              dailyAverage: quote.dailyAverage,
              rationale: quote.rationale,
              seasonal: quote.seasonal,
              visitorHints: quote.destination.internationalVisitor,
            }),
          },
        ],
      },
    ],
    config: {
      systemInstruction: [
        "You are the CheapVacay travel-planning assistant for trips in India.",
        "Return practical budget guidance. Never claim to book, hold, or guarantee a fare or room.",
        "Respect the seasonal and visitor-hint context; you may add color but not contradict visa or medical authorities—refer users to official sources for visas and health.",
        "Do not invent live inventory, exact real-time fares, or unavailable products.",
        "Prefer: when to book, where to save, arrival buffers, and which spend lines to protect.",
      ].join(" "),
      temperature: 0.5,
    },
  });

  return response.text?.trim() || fallbackAdvice(quote);
}

function fallbackAdvice(quote: PlannerQuote) {
  return [
    `${quote.destination.name} is strongest when you book intercity transport first and force the rest of the budget to conform to that ceiling.`,
    `Protect stay quality enough to avoid transport-heavy days collapsing into fatigue; cut activities before cutting rest.`,
    `Keep one arrival-day buffer in cash because fare drift and last-mile transfers are where cheap trips usually break.`,
  ].join(" ");
}
