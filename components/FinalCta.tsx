import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";

/* Platform badges are real — these are the ESPs/CRMs BOR actually
   works with (see lib/content.ts, "Platform & CRM setup"). Headline
   is a placeholder; King Kong's closing line here is pure copy. */
const PLATFORMS = ["Klaviyo", "HubSpot", "Customer.io", "Mailchimp", "ActiveCampaign"];

export default function FinalCta() {
  return (
    <section className="section final-cta" data-screen-label="Final CTA">
      <div className="wrap final-cta-inner">
        <div className="final-cta-platforms">
          {PLATFORMS.map((p) => (
            <span className="final-cta-badge" key={p}>{p}</span>
          ))}
        </div>
        <Reveal as="h2" className="display-huge">
          Walk away knowing where your email program is costing you money.
        </Reveal>
        <Reveal>
          <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">Book your free session <ArrowIcon /></Link>
        </Reveal>
      </div>
    </section>
  );
}
