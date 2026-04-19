import { formatInr } from "../lib/format";
import type { PlannerQuote } from "../types";

type QuoteCardProps = {
  quote: PlannerQuote;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <section className="section results-shell">
      <div className="section-heading">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="eyebrow">Quote</span>
          {quote.isLiveData && (
            <span style={{ 
              backgroundColor: "var(--md-sys-color-tertiary-container)", 
              color: "var(--md-sys-color-on-tertiary-container)",
              fontSize: "0.7rem",
              fontWeight: "bold",
              padding: "2px 8px",
              borderRadius: "4px",
              textTransform: "uppercase"
            }}>Live Pricing</span>
          )}
        </div>
        <h2>
          {quote.destination.name} for {formatInr(quote.total)}
        </h2>
      </div>
      <div className="results-grid">
        <article className="metric-card metric-card-primary">
          <span>Total trip estimate</span>
          <strong>{formatInr(quote.total)}</strong>
          <p style={{ color: "inherit", opacity: 0.8, fontSize: "0.875rem" }}>{formatInr(quote.dailyAverage)} average per night.</p>
        </article>
        <article className="metric-card">
          <span>Travel mode</span>
          <strong>{quote.travelMode}</strong>
          <p style={{ color: "var(--md-sys-color-on-surface-variant)", fontSize: "0.875rem" }}>{quote.scorecard.complexity} complexity.</p>
        </article>
        <article className="metric-card">
          <span>Comfort</span>
          <strong>{quote.scorecard.comfort}</strong>
          <p style={{ color: "var(--md-sys-color-on-surface-variant)", fontSize: "0.875rem" }}>{quote.scorecard.value}</p>
        </article>
      </div>

      <div className="breakdown-list">
        {quote.breakdown.map((item) => (
          <article className="breakdown-row" key={item.label}>
            <div>
              <strong>{item.label}</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--md-sys-color-on-surface-variant)" }}>{item.notes}</p>
            </div>
            <span>{formatInr(item.amount)}</span>
          </article>
        ))}
      </div>

      <div className="rationale-list" style={{ padding: "0 24px" }}>
        {quote.rationale.map((reason) => (
          <p key={reason} style={{ margin: "4px 0" }}>• {reason}</p>
        ))}
      </div>
    </section>
  );
}
