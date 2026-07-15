import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";
import homepageData from "@/content/homepage/homepage.json";

const { guarantee } = homepageData;

/* PLACEHOLDER MODULE, layout only, no real offer/guarantee copy yet.
   King Kong's homepage uses a bold guarantee statement here to convert
   readers who scrolled past the hero. Fill in with a real, honest
   guarantee (or drop this section) before this branch ships. */
export default function GuaranteeBand() {
  return (
    <section className="section guarantee-band" data-screen-label="Guarantee">
      <div className="wrap guarantee-inner">
        <Reveal as="p" className="eyebrow">{guarantee.eyebrow}</Reveal>
        <Reveal as="h2" className="display-huge">{guarantee.headline}</Reveal>
        <Reveal as="p" className="guarantee-sub">{guarantee.body}</Reveal>
        <Reveal>
          <Link href={guarantee.ctaHref} className="btn btn-primary btn-lg btn-arrow">{guarantee.ctaText} <ArrowIcon /></Link>
        </Reveal>
      </div>
    </section>
  );
}
