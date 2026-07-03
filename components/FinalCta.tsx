import Link from "next/link";
import Reveal from "./Reveal";
import SectionSeam from "./SectionSeam";

/* Platform badges are real — these are the ESPs/CRMs BOR actually
   works with (see lib/content.ts, "Platform & CRM setup"). Headline
   is a placeholder; King Kong's closing line here is pure copy. */
const PLATFORMS = ["Klaviyo", "HubSpot", "Customer.io", "Mailchimp", "ActiveCampaign"];

export default function FinalCta() {
  return (
    <section className="section final-cta" data-screen-label="Final CTA">
      <SectionSeam fill="var(--ink-bg)" />
      <div className="wrap final-cta-inner">
        <div className="final-cta-platforms">
          {PLATFORMS.map((p) => (
            <span className="final-cta-badge" key={p}>{p}</span>
          ))}
        </div>
        <Reveal as="h2" className="display-huge">
          [Placeholder — closing line TBD]
        </Reveal>
        <Reveal>
          <Link href="/strategy-session" className="btn btn-primary btn-lg">Book your free session →</Link>
        </Reveal>
      </div>
    </section>
  );
}
