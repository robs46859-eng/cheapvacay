import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./components/Hero";
import { DestinationRail } from "./components/DestinationRail";
import { PlannerForm } from "./components/PlannerForm";
import { QuoteCard } from "./components/QuoteCard";
import { AdvicePanel } from "./components/AdvicePanel";
import { SavedPlans } from "./components/SavedPlans";
import { fetchDestinations, fetchSavedPlans, requestQuote } from "./lib/api";
import type { Destination, PlannerQuote, PlannerRequest, SavedTripPlan } from "./types";

function App() {
  const plannerRef = useRef<HTMLElement | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [quote, setQuote] = useState<PlannerQuote | null>(null);
  const [advice, setAdvice] = useState("");
  const [savedPlans, setSavedPlans] = useState<SavedTripPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchDestinations(), fetchSavedPlans()])
      .then(([items, plans]) => {
        setDestinations(items);
        setSelectedId(items[0]?.id ?? "");
        setSavedPlans(plans);
        if (plans[0]) {
          hydratePlan(plans[0]);
        }
      })
      .catch((reason: Error) => {
        setError(reason.message || "Could not load app data.");
      });
  }, []);

  const selectedDestination = useMemo(
    () => destinations.find((entry) => entry.id === selectedId)?.id ?? "",
    [destinations, selectedId],
  );

  async function handleQuote(request: PlannerRequest) {
    setLoading(true);
    setError("");
    try {
      const response = await requestQuote(request);
      hydratePlan(response.savedPlan);
      setSavedPlans((current) => [response.savedPlan, ...current.filter((plan) => plan.id !== response.savedPlan.id)].slice(0, 8));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to generate quote.");
    } finally {
      setLoading(false);
    }
  }

  function hydratePlan(plan: SavedTripPlan) {
    setQuote(plan.quote);
    setAdvice(plan.advice);
    setSelectedPlanId(plan.id);
    setSelectedId(plan.quote.destination.id);
  }

  return (
    <div className="page-shell">
      <div className="page-backdrop" />
      <main className="page-content">
        <div className="section-wrapper bg-palette-a">
          <Hero onJumpToPlanner={() => plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />
          <DestinationRail destinations={destinations} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="section-wrapper bg-palette-b">
          <SavedPlans plans={savedPlans} selectedPlanId={selectedPlanId} onSelect={hydratePlan} />
          <section ref={plannerRef}>
            {destinations.length > 0 ? (
              <PlannerForm
                destinations={destinations}
                initialDestinationId={selectedDestination}
                onSubmit={handleQuote}
                loading={loading}
              />
            ) : null}
          </section>
        </div>

        {quote ? (
          <div className="section-wrapper bg-palette-c">
            <QuoteCard quote={quote} />
            {advice ? <AdvicePanel advice={advice} /> : null}
          </div>
        ) : null}

        {error ? <div className="error-banner">{error}</div> : null}
      </main>
    </div>
  );
}

export default App;
