import type { Destination } from "../types";
import { formatInr } from "../lib/format";

type DestinationRailProps = {
  destinations: Destination[];
  selectedId: string;
  onSelect: (destinationId: string) => void;
};

export function DestinationRail({ destinations, selectedId, onSelect }: DestinationRailProps) {
  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">Destinations</span>
        <h2>Curated for clean launch behavior</h2>
      </div>
      <div className="destination-grid">
        {destinations.map((destination) => {
          const selected = selectedId === destination.id;
          return (
            <button
              key={destination.id}
              type="button"
              className={`destination-card${selected ? " destination-card-selected" : ""}`}
              onClick={() => onSelect(destination.id)}
            >
              <div className="destination-card-top">
                <span>{destination.region}</span>
                <strong>{destination.name}</strong>
              </div>
              <p>{destination.hero}</p>
              <div className="destination-meta">
                <span>{formatInr(destination.averageNightlyStay)}/night</span>
                <span>{destination.tags.slice(0, 2).join(" · ")}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
