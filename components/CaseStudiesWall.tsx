import Reveal from "./Reveal";

/* PLACEHOLDER MODULE , layout only. King Kong's "Become our next
   success story" wall shows real client site screenshots. BOR has no
   published case studies yet, so these are empty placeholder cards ,
   deliberately not reusing the past-employer names from the old Logos
   component, since that would misrepresent them as client work. */
const SLOTS = 4;

export default function CaseStudiesWall() {
  return (
    <section className="case-studies" data-screen-label="Case studies">
      <div className="wrap">
        <Reveal as="p" className="eyebrow case-studies-label">Case studies</Reveal>
        <Reveal as="h2" className="display-huge case-studies-heading">
          [Placeholder , become our next success story]
        </Reveal>
      </div>
      <div className="case-studies-row">
        {Array.from({ length: SLOTS }).map((_, i) => (
          <div className="case-studies-card" key={i}>
            <span>[Client TBD]</span>
          </div>
        ))}
      </div>
    </section>
  );
}
