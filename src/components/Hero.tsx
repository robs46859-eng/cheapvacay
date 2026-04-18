type HeroProps = {
  onJumpToPlanner: () => void;
};

export function Hero({ onJumpToPlanner }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">CheapVacay India</span>
        <h1>Budget trip planning that behaves like an operator, not a brochure.</h1>
        <p>
          Pick a destination, choose how hard you want to push on cost, and get a trip budget
          that is explicit about tradeoffs instead of hiding them behind fake live fares.
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
          <li>AI guidance with safe fallback when Gemini is absent</li>
        </ul>
      </div>
    </section>
  );
}
