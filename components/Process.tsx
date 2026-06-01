import Reveal from "./Reveal";
import { processSteps } from "@/lib/content";

export default function Process() {
  return (
    <section className="section" id="process" data-screen-label="Process">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Audit. Build. Compound.</h2>
          <p>
            We get the foundations live fast, then improve month over month
            against the numbers that actually matter.
          </p>
        </Reveal>
        <div className="steps">
          {processSteps.map((s) => (
            <Reveal className="step" key={s.num}>
              <div className="num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
