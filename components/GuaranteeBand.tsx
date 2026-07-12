import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";

/* PLACEHOLDER MODULE , layout only, no real offer/guarantee copy yet.
   King Kong's homepage uses a bold guarantee statement here to convert
   readers who scrolled past the hero. Fill in with a real, honest
   guarantee (or drop this section) before this branch ships. */
export default function GuaranteeBand() {
  return (
    <section className="section guarantee-band" data-screen-label="Guarantee">
      <div className="wrap guarantee-inner">
        <Reveal as="p" className="eyebrow">Our promise</Reveal>
        <Reveal as="h2" className="display-huge">Results guaranteed or we'll work for free.*</Reveal>
        <Reveal as="p" className="guarantee-sub">
          We don't do vanity metrics, because vanity metrics don't pay salaries. We'll beat your current results, or it's on us until we do.*
        </Reveal>
        <Reveal>
          <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">Book your free session <ArrowIcon /></Link>
        </Reveal>
      </div>
    </section>
  );
}
