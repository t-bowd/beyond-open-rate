import Reveal from "./Reveal";
import homepageData from "@/content/homepage/homepage.json";

const { positioning } = homepageData;

/* PLACEHOLDER MODULE, layout only. Consolidates King Kong's "Built
   for scale" and "The power is in the platform" blocks into one slot,
   since BOR doesn't have two distinct pieces of positioning copy for
   this yet. Split back into two sections later if there's enough real
   copy to justify it. */
export default function Positioning() {
  return (
    <section className="section positioning" data-screen-label="Positioning">
      <div className="wrap positioning-inner">
        <Reveal as="p" className="eyebrow">{positioning.eyebrow}</Reveal>
        <Reveal as="h2" className="display-huge">
          {positioning.headline}
        </Reveal>
        {positioning.bodyParagraphs.map((p, i) => (
          <Reveal key={i} as="p" className="positioning-sub">{p}</Reveal>
        ))}
      </div>
    </section>
  );
}
