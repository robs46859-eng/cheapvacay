import { Router } from "express";
import { buildQuote, listDestinations, parsePlannerRequest, type LiveDataValues } from "../domain/planner.ts";
import { generateTripAdvice } from "../services/assistant.ts";
import { findTripPlanById, listRecentTripPlans, saveTripPlan } from "../persistence/tripPlans.ts";
import { getDatabasePath } from "../persistence/database.ts";
import { getFlightPrice, getHotelPrice } from "../services/amadeus.ts";

export function createApiRouter() {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", persistence: "sqlite", databasePath: getDatabasePath() });
  });

  router.get("/destinations", (_req, res) => {
    res.json({ destinations: listDestinations() });
  });

  router.get("/plans", (req, res) => {
    const userKey = readUserKey(req);
    if (!userKey) {
      res.status(400).json({ error: "Missing user key." });
      return;
    }
    res.json({ plans: listRecentTripPlans(userKey) });
  });

  router.get("/plans/:planId", (req, res) => {
    const userKey = readUserKey(req);
    if (!userKey) {
      res.status(400).json({ error: "Missing user key." });
      return;
    }

    const plan = findTripPlanById(req.params.planId, userKey);
    if (!plan) {
      res.status(404).json({ error: "Saved plan not found." });
      return;
    }
    res.json({ plan });
  });

  router.post("/planner/quote", async (req, res) => {
    try {
      const userKey = readUserKey(req);
      if (!userKey) {
        res.status(400).json({ error: "Missing user key." });
        return;
      }

      const request = parsePlannerRequest(req.body);
      const destinations = listDestinations();
      const dest = destinations.find(d => d.id === request.destinationId);

      const liveData: LiveDataValues = {};
      
      if (dest) {
        // Fetch live data in parallel
        const [flightPrice, hotelPrice] = await Promise.all([
          getFlightPrice(request.origin, dest.iataCode, request.travelDate, request.travelers),
          getHotelPrice(dest.iataCode, request.travelers)
        ]);
        
        liveData.flightPrice = flightPrice;
        liveData.hotelPricePerNight = hotelPrice;
      }

      const quote = buildQuote(request, liveData);
      const advice = await generateTripAdvice(quote);
      const savedPlan = saveTripPlan(userKey, request, quote, advice);
      res.json({ quote, advice, savedPlan });
    } catch (error) {
      console.error("Planner quote error:", error);
      const message = error instanceof Error ? error.message : "Invalid request.";
      res.status(400).json({ error: message });
    }
  });

  return router;
}

function readUserKey(req: { header: (name: string) => string | undefined }) {
  return req.header("x-user-key")?.trim() || "";
}
