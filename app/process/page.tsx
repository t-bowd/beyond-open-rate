import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/lib/jsonld";
import { processSteps, faqs } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How we work — audit, build, scale",
  description:
    "Our three-step process: audit your current email program, build the flows and calendar that earn revenue, then scale month over month against the numbers that matter.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <section className="hero" data-screen-label="Process">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Simple to start. <span className="accent">Built to compound.</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            We get the foundations live in weeks, not quarters. Then we
            compound from there — month over month, against revenue.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="steps">
            {processSteps.map((s) => (
              <Reveal className="step" key={s.num}>
                <div className="num">{s.num}</div>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq />
      <CtaBand />

      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Process", url: `${site.url}/process` },
        ])}
      />
    </>
  );
}
