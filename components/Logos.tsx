const LOGOS = ["Lumen&Co", "Northgate", "Pellicano", "Driftwell", "Veraday", "Halcyon"];

export default function Logos() {
  return (
    <section className="logos">
      <div className="wrap">
        <p className="logos-label">
          Trusted by growing e-commerce &amp; SaaS teams
        </p>
        <div className="logo-row">
          {LOGOS.map((name) => (
            <span className="logo" key={name}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
