import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArrowIcon from "@/components/ArrowIcon";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing services, Australia",
  description:
    "Full-service email marketing for Australian businesses. Lifecycle automation, Klaviyo, campaign management, copy, deliverability, and reporting — end to end.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title={<>There's revenue sitting in your email list right now. <span className="highlight">The question is whether you're getting it</span>.</>}
        sub="From one-off audits to full lifecycle management: we specialise in finding what's been missing and making sure it doesn't stay that way."
        actions={
          <>
            <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">
              Claim your free strategy session <ArrowIcon />
            </Link>
            <Link href="#services" className="btn btn-ghost btn-lg">
              Explore our services
            </Link>
          </>
        }
      />

      <section className="section" id="services">
        <div className="wrap">
          <ul className="svc-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {services.map((s) => (
              <Reveal as="li" key={s.slug}>
                <Link href={s.href ?? `/services/${s.slug}`} className="svc-card svc-card-linked">
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
