import { Router } from "express";
import { buildQuote, listDestinations, parsePlannerRequest, type LiveDataValues } from "../domain/planner.ts";
import { generateTripAdvice } from "../services/assistant.ts";
import { findTripPlanById, listRecentTripPlans, saveTripPlan } from "../persistence/tripPlans.ts";
import { getFlightPrice, getHotelPrice } from "../services/amadeus.ts";
import { requireFirebaseUser } from "../auth/bearer.ts";
import { requireAppCheck } from "../auth/appCheck.ts";
import { appCheckEnforce, config } from "../config.ts";
import { appVersion } from "../lib/version.ts";
import { generalApiLimiter, quotePostLimiter } from "../middleware/rateLimits.ts";

export function createApiRouter() {
  const router = Router();
  router.use(generalApiLimiter);

  router.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "cheapvacay-india",
      version: appVersion,
      environment: config.nodeEnv,
      persistence: "firestore",
      appCheckEnforce,
      rateLimit: { windowMin: Math.round(config.rateLimitWindowMs / 60_000), maxPerWindow: config.rateLimitMax },
    });
  });

  router.get("/destinations", requireAppCheck, (_req, res) => {
    res.json({ destinations: listDestinations() });
  });

  router.get("/plans", requireAppCheck, requireFirebaseUser, async (req, res) => {
    const userId = req.userId!;
    const plans = await listRecentTripPlans(userId);
    res.json({ plans });
  });

  router.get("/plans/:planId", requireAppCheck, requireFirebaseUser, async (req, res) => {
    const userId = req.userId!;
    const plan = await findTripPlanById(req.params.planId, userId);
    if (!plan) {
      res.status(404).json({ error: "Saved plan not found." });
      return;
    }
    res.json({ plan });
  });

  router.post("/planner/quote", quotePostLimiter, requireAppCheck, requireFirebaseUser, async (req, res) => {
    try {
      const userId = req.userId!;
      const request = parsePlannerRequest(req.body);
      const destinations = listDestinations();
      const dest = destinations.find((d) => d.id === request.destinationId);

      const liveData: LiveDataValues = {};
      if (dest) {
        const [flightPrice, hotelPrice] = await Promise.all([
          getFlightPrice(request.origin, dest.iataCode, request.travelDate, request.travelers),
          getHotelPrice(dest.iataCode, request.travelers),
        ]);
        liveData.flightPrice = flightPrice;
        liveData.hotelPricePerNight = hotelPrice;
      }

      const quote = buildQuote(request, liveData);
      const advice = await generateTripAdvice(quote);
      const savedPlan = await saveTripPlan(userId, request, quote, advice);
      res.json({ quote, advice, savedPlan });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Planner error");
      console.error("Planner quote error:", err);
      const message = err.message || "Invalid request.";
      res.status(400).json({ error: message });
    }
  });

  router.use((_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  return router;
}
