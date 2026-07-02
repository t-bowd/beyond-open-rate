import Reveal from "./Reveal";

/* PLACEHOLDER MODULE — layout only. Consolidates King Kong's "Built
   for scale" and "The power is in the platform" blocks into one slot,
   since BOR doesn't have two distinct pieces of positioning copy for
   this yet. Split back into two sections later if there's enough real
   copy to justify it. */
export default function Positioning() {
  return (
    <section className="section positioning" data-screen-label="Positioning">
      <div className="wrap positioning-inner">
        <Reveal as="p" className="eyebrow">[POSITIONING EYEBROW TBD]</Reveal>
        <Reveal as="h2" className="display-huge">
          [Placeholder — the one-line reason BOR is different]
        </Reveal>
        <Reveal as="p" className="positioning-sub">
          [PLACEHOLDER — a short paragraph backing the claim above with
          something concrete: an approach, a number, a way of working
          that competitors don&apos;t do. Not written yet.]
        </Reveal>
      </div>
    </section>
  );
}
