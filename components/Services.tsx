import Reveal from "./Reveal";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section className="section" id="services" data-screen-label="Services">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Full-service email marketing and automation.</h2>
          <p>
            Strategy, copy, design, and the automations that keep earning —
            built and run end to end, so email stops being the channel you keep
            meaning to fix.
          </p>
        </Reveal>
        <div className="svc-grid">
          {services.map((s) => (
            <Reveal as="article" className="svc-card" key={s.slug}>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
