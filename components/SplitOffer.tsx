import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";

/* King Kong's "choose your own adventure" split — two clear paths
   instead of one CTA. Both use real, existing BOR copy/links:
   book a call (Contact) vs. take the free audit (the existing tool). */
const OFFERS = [
  {
    title: "Book a call",
    body: "Tell us a bit about your business and where email is at. Free, no-obligation — you'll talk to the people who actually do the work, and we'll respond within one business day.",
    cta: "Book your free session",
    href: "/strategy-session",
  },
  {
    title: "Free audit",
    body: "Ten questions on your automations, deliverability, and segmentation. Takes about three minutes — you get a score out of 75 and a prioritised list of what to fix first.",
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
            <Reveal className="split-offer-card" key={o.title}>
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
