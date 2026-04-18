type AdvicePanelProps = {
  advice: string;
};

export function AdvicePanel({ advice }: AdvicePanelProps) {
  return (
    <section className="section advice-shell">
      <div className="section-heading">
        <span className="eyebrow">AI advice</span>
        <h2>Budget guidance without pretending live supply exists.</h2>
      </div>
      <div className="advice-card">
        <p>{advice}</p>
      </div>
    </section>
  );
}
