import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import homepageData from "@/content/homepage/homepage.json";

const { splitOffer } = homepageData;

const StrategyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const AuditIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
    <line x1="8" y1="11" x2="14" y2="11" />
    <line x1="11" y1="8" x2="11" y2="14" />
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  strategy: <StrategyIcon />,
  audit: <AuditIcon />,
};

export default function SplitOffer() {
  return (
    <section className="section split-offer" data-screen-label="Split offer">
      <div className="wrap">
        <Reveal as="p" className="eyebrow split-offer-label">{splitOffer.eyebrow}</Reveal>
        <div className="split-offer-grid">
          {splitOffer.offers.map((o) => (
            <Reveal className="split-offer-card" key={o.id}>
              <span className="split-offer-badge" aria-hidden="true">
                {ICONS[o.id]}
              </span>
              <h3 className="split-offer-title">{o.title}</h3>
              <p className="split-offer-body">{o.body}</p>
              <Link href={o.ctaHref} className="btn btn-primary btn-lg">{o.ctaText}</Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
