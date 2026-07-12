import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "./Reveal";

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

type Offer = { id: string; icon: ReactNode; title: ReactNode; body: ReactNode; cta: string; href: string };

const OFFERS: Offer[] = [
  {
    id: "strategy",
    icon: <StrategyIcon />,
    title: "Claim your free strategy session",
    body: "Claim your 100% free 30-minute strategy session (valued at $500) to discuss where your email program stands and how it ties to revenue. Act fast - sessions are limited!",
    cta: "Claim your free session",
    href: "/strategy-session",
  },
  {
    id: "audit",
    icon: <AuditIcon />,
    title: <>Revenue killers<br className="desktop-br" /> exposed</>,
    body: <>What marketing agencies won't tell you...and it's leaving money on the table. Reveal your revenue gaps and how to close them with the free audit.<br /><br /></>,
    cta: "Take the free audit",
    href: "/tools/email-audit",
  },
];

export default function SplitOffer() {
  return (
    <section className="section split-offer" data-screen-label="Split offer">
      <div className="wrap">
        <Reveal as="p" className="eyebrow split-offer-label">Our offers</Reveal>
        <div className="split-offer-grid">
          {OFFERS.map((o) => (
            <Reveal className="split-offer-card" key={o.id}>
              <span className="split-offer-badge" aria-hidden="true">
                {o.icon}
              </span>
              <h3 className="split-offer-title">{o.title}</h3>
              <p className="split-offer-body">{o.body}</p>
              <Link href={o.href} className="btn btn-primary btn-lg">{o.cta}</Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
