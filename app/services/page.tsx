import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing services — Beyond Open Rate",
  description:
    "Lifecycle automation, Klaviyo builds, deliverability audits, and campaign management for Australian e-commerce and SaaS brands.",
  alternates: { canonical: "/services" },
};

const pages = [
  {
    href: "/services/email-marketing-audit-australia",
    title: "Email marketing audit",
    blurb: "A full review of your flows, deliverability, segmentation, and reporting — with a prioritised list of what to fix first.",
  },
  {
    href: "/services/klaviyo-agency-australia",
    title: "Klaviyo agency, Australia",
    blurb: "Strategy, flows, campaigns, and reporting for e-commerce brands that want more from Klaviyo than they're currently getting.",
  },
  {
    href: "/services/ecommerce-email-marketing-australia",
    title: "E-commerce email marketing",
    blurb: "The flows, campaigns, and strategy to turn your list into a predictable revenue channel.",
  },
  {
    href: "/services/email-marketing-agency-sydney",
    title: "Email marketing agency, Sydney",
    blurb: "Lifecycle automation and campaign management for Sydney businesses.",
  },
  {
    href: "/services/email-marketing-agency-melbourne",
    title: "Email marketing agency, Melbourne",
    blurb: "Email strategy and execution for Melbourne brands that want a channel built on owned data.",
  },
  {
    href: "/services/email-marketing-agency-brisbane",
    title: "Email marketing agency, Brisbane",
    blurb: "Lifecycle automation and email strategy for Brisbane businesses.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="hero" data-screen-label="Services">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Email marketing, <span className="accent">built to compound</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Strategy, automation, and execution for Australian e-commerce and
            SaaS brands — built and run end to end.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ul className="svc-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {pages.map((p) => (
              <Reveal as="li" key={p.href}>
                <Link href={p.href} className="svc-card svc-card-linked">
                  <h2 className="svc-card-title">{p.title}</h2>
                  <p>{p.blurb}</p>
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
