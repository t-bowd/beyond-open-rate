import Link from "next/link";
import Reveal from "./Reveal";

/* PLACEHOLDER MODULE — layout only, no real offer/guarantee copy yet.
   King Kong's homepage uses a bold guarantee statement here to convert
   readers who scrolled past the hero. Fill in with a real, honest
   guarantee (or drop this section) before this branch ships. */
export default function GuaranteeBand() {
  return (
    <section className="section guarantee-band" data-screen-label="Guarantee">
      <div className="wrap guarantee-inner">
        <Reveal as="p" className="eyebrow">[GUARANTEE COPY TBD]</Reveal>
        <Reveal as="h2" className="display-huge">[Placeholder — a bold, specific promise goes here]</Reveal>
        <Reveal as="p" className="guarantee-sub">
          [One sentence backing the promise with a real number or condition —
          not written yet, layout only.]
        </Reveal>
        <Reveal>
          <Link href="/#contact" className="btn btn-primary btn-lg">Book a chat</Link>
        </Reveal>
      </div>
    </section>
  );
}
