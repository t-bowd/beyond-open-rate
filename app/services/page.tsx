import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing services — Beyond Open Rate",
  description:
    "Lifecycle automation, campaign management, copy and design, platform setup, deliverability, and reporting — built and run end to end for Australian businesses.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="hero" data-screen-label="Services">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Full-service email marketing{" "}
            <span className="accent">and automation</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Strategy, copy, design, and the automations that keep earning —
            built and run end to end.
          </Reveal>
          <div className="hero-actions">
            <Link href="/tools/email-audit" className="btn btn-primary btn-lg">
              Score your email program →
            </Link>
            <Link href="/#contact" className="btn btn-ghost btn-lg">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ul className="svc-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {services.map((s) => (
              <Reveal as="li" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="svc-card svc-card-linked">
                  <p className="svc-num">{s.num}</p>
                  <h2 className="svc-card-title">{s.title}</h2>
                  <p>{s.description}</p>
                  <span className="svc-card-link">Learn more →</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Contact />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Services", url: `${site.url}/services` },
        ])}
      />
    </>
  );
}
