import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";
import homepageData from "@/content/homepage/homepage.json";

const { finalCta } = homepageData;

export default function FinalCta() {
  const platforms = (finalCta as { platforms?: string[] }).platforms;
  return (
    <section className="section final-cta" data-screen-label="Final CTA">
      <div className="wrap final-cta-inner">
        {platforms && platforms.length > 0 && (
          <div className="final-cta-platforms">
            {platforms.map((p) => (
              <span className="final-cta-badge" key={p}>{p}</span>
            ))}
          </div>
        )}
        <Reveal as="h2" className="display-huge">
          {finalCta.headline}
        </Reveal>
        <Reveal>
          <Link href={finalCta.ctaHref} className="btn btn-primary btn-lg btn-arrow">{finalCta.ctaText} <ArrowIcon /></Link>
        </Reveal>
      </div>
    </section>
  );
}
