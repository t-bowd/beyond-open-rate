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
        <Reveal as="p" className="eyebrow">We're not like other agencies</Reveal>
        <Reveal as="h2" className="display-huge">
          We're experts. We do email at a level most agencies can't.
        </Reveal>
        <Reveal as="p" className="positioning-sub">
          Email and lifecycle marketing is a specialist discipline, and it's all we do. You won't get recommendations based on what earns us a platform commission. You won't get reports full of metrics that don't connect to revenue. 
<br /><br />
We've spent 20 years inside email programs from start-ups to global enterprises. We know what good looks like, and we know when mediocre is pretending to be good.
        </Reveal>
      </div>
    </section>
  );
}
