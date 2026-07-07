import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";

type Offer = { id: string; title: ReactNode; body: string; cta: string; href: string };

const OFFERS: Offer[] = [
  {
    id: "strategy",
    title: "Claim your free strategy session",
    body: "Claim your 100% free 30-minute strategy session (valued at $500) to discuss where your email program stands and which revenue gaps need closing. Availability is limited!",
    cta: "Claim your free session",
    href: "/strategy-session",
  },
  {
    id: "audit",
    title: <>Revenue killers<br className="desktop-br" /> exposed</>,
    body: "TWhat marketing agencies won't tell you...and it's leaving money on the table. Reveal your revenue gaps and how to close them with the free audit.",
    cta: "Take the free audit",
    href: "/tools/email-audit",
  },
];

export default function SplitOffer() {
  return (
    <section className="section split-offer" data-screen-label="Split offer">
      <div className="wrap">
        <Reveal as="p" className="eyebrow split-offer-label">Our offering</Reveal>
        <div className="split-offer-grid">
          {OFFERS.map((o) => (
            <Reveal className="split-offer-card" key={o.id}>
              <span className="split-offer-badge" aria-hidden="true">
                <Image src="/logo-reverse.svg" alt="" width={28} height={28} style={{ height: 28, width: "auto" }} />
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
