import Link from "next/link";
import Reveal from "./Reveal";
import { services } from "@/lib/content";

// Map homepage service cards → their dedicated service page
const serviceLinks: Record<string, string> = {
  "lifecycle-automation":      "/services/lifecycle-automation",
  "campaign-management":       "/services/campaign-management",
  "copy-and-design":           "/services/copy-and-design",
  "platform-and-crm-setup":    "/services/platform-and-crm-setup",
  "deliverability-and-audits": "/services/deliverability-and-audits",
  "reporting-that-matters":    "/services/reporting-that-matters",
};

export default function Services() {
  return (
    <section className="section" id="services" data-screen-label="Services">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Full-service email marketing and automation.</h2>
          <p>
            Strategy, copy, design, and the automations that keep earning —
            built and run end to end, so email stops being the channel you keep
            meaning to fix.
          </p>
        </Reveal>
        <div className="svc-grid">
          {services.map((s) => (
            <Reveal as="article" className="svc-card" key={s.slug}>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              {serviceLinks[s.slug] && (
                <Link href={serviceLinks[s.slug]} className="svc-card-link">
                  Learn more →
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
