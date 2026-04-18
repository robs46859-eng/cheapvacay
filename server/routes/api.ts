import { Router } from "express";
import { buildQuote, listDestinations, parsePlannerRequest } from "../domain/planner.ts";
import { generateTripAdvice } from "../services/assistant.ts";
import { findTripPlanById, listRecentTripPlans, saveTripPlan } from "../persistence/tripPlans.ts";
import { getDatabasePath } from "../persistence/database.ts";

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
      const quote = buildQuote(request);
      const advice = await generateTripAdvice(quote);
      const savedPlan = saveTripPlan(userKey, request, quote, advice);
      res.json({ quote, advice, savedPlan });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request.";
      res.status(400).json({ error: message });
    }
  });

  return router;
}

function readUserKey(req: { header: (name: string) => string | undefined }) {
  return req.header("x-user-key")?.trim() || "";
}
