type HeroProps = {
  onJumpToPlanner: () => void;
};

export function Hero({ onJumpToPlanner }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">CheapVacay India</span>
        <h1>Budget trip planning that behaves like an operator.</h1>
        <p style={{ color: "var(--md-sys-color-on-surface-variant)", marginTop: "16px", fontSize: "1.125rem" }}>
          Pick a destination, choose how hard you want to push on cost, and get a trip budget
          that is explicit about tradeoffs.
        </p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={onJumpToPlanner}>
            Start planning
          </button>
          <div className="hero-stat">
            <strong>5 curated cities</strong>
            <span>Focused launch scope instead of noisy inventory claims</span>
          </div>
        </div>
      </div>
      <div className="hero-card">
        <p className="hero-card-label">Launch posture</p>
        <ul>
          <li>Single clear quote endpoint</li>
          <li>Destination-first budget modeling</li>
          <li>AI guidance with safe fallback</li>
        </ul>
      </div>
    </section>
  );
}
