type AdvicePanelProps = {
  advice: string;
};

export function AdvicePanel({ advice }: AdvicePanelProps) {
  return (
    <section className="section advice-shell">
      <div className="section-heading">
        <span className="eyebrow">Expert Insight</span>
        <h2>Budget behavior guide</h2>
      </div>
      <div className="advice-card" style={{ backgroundColor: "var(--md-sys-color-secondary-container)", color: "var(--md-sys-color-on-secondary-container)", border: "none" }}>
        <p style={{ lineHeight: "1.6" }}>{advice}</p>
      </div>
    </section>
  );
}
