import Reveal from "./Reveal";

const STEPS = [
  { n: "STEP 01", h: "Audit", p: "We tear down your current setup — flows, deliverability, segmentation — and map the gaps costing you money." },
  { n: "STEP 02", h: "Build", p: "We stand up the core automations and a campaign calendar, write the copy, and design every template." },
  { n: "STEP 03", h: "Scale", p: "We test, segment, and optimise month over month — reporting on revenue, not just opens and clicks." },
];

export default function Process() {
  return (
    <section className="section" id="process" data-screen-label="Process">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Simple to start. Built to compound.</h2>
        </Reveal>
        <div className="steps">
          {STEPS.map((s) => (
            <Reveal className="step" key={s.n}>
              <div className="num">{s.n}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
