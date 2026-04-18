import { useEffect, useMemo, useState } from "react";
import type { Destination, PlannerRequest } from "../types";

type PlannerFormProps = {
  destinations: Destination[];
  initialDestinationId: string;
  onSubmit: (request: PlannerRequest) => Promise<void>;
  loading: boolean;
};

export function PlannerForm({ destinations, initialDestinationId, onSubmit, loading }: PlannerFormProps) {
  const [origin, setOrigin] = useState("Delhi");
  const [destinationId, setDestinationId] = useState(initialDestinationId);
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(3);
  const [budgetProfile, setBudgetProfile] = useState<PlannerRequest["budgetProfile"]>("smart");
  const [transportPreference, setTransportPreference] = useState<PlannerRequest["transportPreference"]>("balanced");

  const destination = useMemo(
    () => destinations.find((entry) => entry.id === destinationId) ?? destinations[0],
    [destinations, destinationId],
  );

  useEffect(() => {
    setDestinationId(initialDestinationId);
  }, [initialDestinationId]);

  return (
    <section className="section planner-shell" id="planner">
      <div className="section-heading">
        <span className="eyebrow">Planner</span>
        <h2>Generate a quote that exposes the real pressure points.</h2>
      </div>
      <form
        className="planner-form"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit({
            origin,
            destinationId,
            travelers,
            nights,
            budgetProfile,
            transportPreference,
          });
        }}
      >
        <label>
          Origin city
          <input value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Delhi" />
        </label>
        <label>
          Destination
          <select value={destinationId} onChange={(event) => setDestinationId(event.target.value)}>
            {destinations.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Travelers
          <input
            type="number"
            min={1}
            max={8}
            value={travelers}
            onChange={(event) => setTravelers(Number(event.target.value))}
          />
        </label>
        <label>
          Nights
          <input
            type="number"
            min={1}
            max={21}
            value={nights}
            onChange={(event) => setNights(Number(event.target.value))}
          />
        </label>
        <label>
          Budget profile
          <select value={budgetProfile} onChange={(event) => setBudgetProfile(event.target.value as PlannerRequest["budgetProfile"])}>
            <option value="lean">Lean</option>
            <option value="smart">Smart</option>
            <option value="comfort">Comfort</option>
          </select>
        </label>
        <label>
          Transport bias
          <select
            value={transportPreference}
            onChange={(event) => setTransportPreference(event.target.value as PlannerRequest["transportPreference"])}
          >
            <option value="cheapest">Cheapest</option>
            <option value="balanced">Balanced</option>
            <option value="fastest">Fastest</option>
          </select>
        </label>

        <aside className="planner-sidecard">
          <strong>{destination?.name}</strong>
          <p>{destination?.summary}</p>
          <div className="planner-sidecard-tags">
            {destination?.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </aside>

        <button className="button button-primary planner-submit" disabled={loading} type="submit">
          {loading ? "Building quote..." : "Generate quote"}
        </button>
      </form>
    </section>
  );
}
