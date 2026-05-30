import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/lib/jsonld";
import { services } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing & automation services",
  description:
    "Lifecycle automation, campaign management, copy and design, platform setup, deliverability and reporting — the full email program, run end to end.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="hero" data-screen-label="Services">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            The whole email program — <span className="accent">built and run</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Six things we do, all part of the same retainer. No piecemeal scope,
            no handing the strategy to one agency and the build to another.
          </Reveal>
        </div>
      </section>

      <section className="section" id="services">
        <div className="wrap">
          <div className="svc-grid">
            {services.map((s) => (
              <Reveal as="article" className="svc-card" key={s.slug}>
                <div className="svc-num">{s.num}</div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />

      {services.map((s) => (
        <JsonLd
          key={s.slug}
          data={serviceSchema({
            name: s.title,
            description: s.description,
            slug: s.slug,
          })}
        />
      ))}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Services", url: `${site.url}/services` },
        ])}
      />
    </>
  );
}
