import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";
import homepageData from "@/content/homepage/homepage.json";

type GuaranteeProps = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function GuaranteeBand({ eyebrow, headline, body, ctaText, ctaHref }: GuaranteeProps = {}) {
  const fallback = homepageData.guarantee;
  const guarantee = {
    eyebrow:  eyebrow  ?? fallback.eyebrow,
    headline: headline ?? fallback.headline,
    body:     body     ?? fallback.body,
    ctaText:  ctaText  ?? fallback.ctaText,
    ctaHref:  ctaHref  ?? fallback.ctaHref,
  };
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
