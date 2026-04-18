import { formatInr } from "../lib/format";
import type { PlannerQuote } from "../types";

type QuoteCardProps = {
  quote: PlannerQuote;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <section className="section results-shell">
      <div className="section-heading">
        <span className="eyebrow">Quote</span>
        <h2>
          {quote.destination.name} in {formatInr(quote.total)}
        </h2>
      </div>
      <div className="results-grid">
        <article className="metric-card metric-card-primary">
          <span>Total trip estimate</span>
          <strong>{formatInr(quote.total)}</strong>
          <p>{formatInr(quote.dailyAverage)} average per night of the trip.</p>
        </article>
        <article className="metric-card">
          <span>Travel mode</span>
          <strong>{quote.travelMode}</strong>
          <p>{quote.scorecard.complexity} execution complexity.</p>
        </article>
        <article className="metric-card">
          <span>Comfort</span>
          <strong>{quote.scorecard.comfort}</strong>
          <p>{quote.scorecard.value}</p>
        </article>
      </div>

      <div className="breakdown-list">
        {quote.breakdown.map((item) => (
          <article className="breakdown-row" key={item.label}>
            <div>
              <strong>{item.label}</strong>
              <p>{item.notes}</p>
            </div>
            <span>{formatInr(item.amount)}</span>
          </article>
        ))}
      </div>

      <div className="rationale-list">
        {quote.rationale.map((reason) => (
          <p key={reason}>{reason}</p>
        ))}
      </div>
    </section>
  );
}
