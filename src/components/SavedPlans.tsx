import { formatInr } from "../lib/format";
import type { SavedTripPlan } from "../types";

type SavedPlansProps = {
  plans: SavedTripPlan[];
  selectedPlanId: string | null;
  onSelect: (plan: SavedTripPlan) => void;
};

export function SavedPlans({ plans, selectedPlanId, onSelect }: SavedPlansProps) {
  if (plans.length === 0) return null;

  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">Saved plans</span>
        <h2>Recent quotes now persist on the server.</h2>
      </div>
      <div className="saved-plan-list">
        {plans.map((plan) => {
          const selected = plan.id === selectedPlanId;
          return (
            <button
              className={`saved-plan-card${selected ? " saved-plan-card-selected" : ""}`}
              key={plan.id}
              onClick={() => onSelect(plan)}
              type="button"
            >
              <div>
                <strong>
                  {plan.quote.destination.name} from {plan.request.origin}
                </strong>
                <p>
                  {plan.request.travelers} traveler{plan.request.travelers > 1 ? "s" : ""} · {plan.request.nights} nights ·{" "}
                  {plan.request.budgetProfile}
                </p>
              </div>
              <span>{formatInr(plan.quote.total)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
