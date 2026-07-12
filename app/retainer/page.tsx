import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import GuaranteeBand from "@/components/GuaranteeBand";
import PageHero from "@/components/PageHero";
import ServiceBenefits from "@/components/ServiceBenefits";
import ServiceIntro from "@/components/ServiceIntro";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing retainer, Australia — Beyond Open Rate",
  description:
    "Full lifecycle email management under one monthly retainer. Flows, campaigns, copy, design, deliverability, and reporting — all managed. No scope creep, no surprises.",
  alternates: { canonical: "/retainer" },
  openGraph: {
    type: "website",
    url: `${site.url}/retainer`,
    title: "Email marketing retainer, Australia — Beyond Open Rate",
    description:
      "Full lifecycle email management under one monthly retainer. Flows, campaigns, copy, design, deliverability, and reporting — all managed. No scope creep, no surprises.",
  },
};

const faq = [
  {
    q: "Which flows should we build first?",
    a: "In order of typical revenue impact: welcome series, abandoned cart, post-purchase, win-back. Most programs are missing at least two of these, or have versions that haven't been touched since setup day. We audit your current setup first and prioritise based on where the actual gap is.",
  },
  {
    q: "Is this a one-time build, or do you manage the flows ongoing?",
    a: "Ongoing. Flows aren't set-and-forget — they need monthly monitoring, A/B testing, and trigger adjustments as your list and catalogue change. We include all of that in the monthly engagement. A flow built once and left alone will underperform within months.",
  },
  {
    q: "How long does it take to get the first flow live?",
    a: "Most clients are live with their first rebuilt or new flow within two weeks of kickoff. That covers the strategy brief, copy, design, build, and QA. We don't use off-the-shelf templates, so there's a real build process — but we move quickly.",
  },
  {
    q: "Do we need to be on Klaviyo?",
    a: "Not necessarily. Klaviyo is our preferred platform for e-commerce because of its data model and segmentation engine — but we work across HubSpot, Brevo, Customer.io, and Mailchimp where they're the right fit. We'll give you an honest recommendation based on your business model, not platform partnerships.",
  },
  {
    q: "What do you need from us to get started?",
    a: "Access to your email platform and any connected store or CRM, your brand assets, and a 30-minute kickoff call. We handle strategy, copy, design, build, and ongoing optimisation from there.",
  },
];

export default function RetainerPage() {
  return (
    <>
      <PageHero
        label="Email retainer"
        title="Finally. A fully managed email program that runs without you — and reports revenue, not open rates."
        sub="One all-inclusive monthly retainer covers everything — flows, campaigns, copy, design, deliverability, and reporting. You focus on your business; we make sure email is working for it."
      />

      <ServiceIntro />

      <GuaranteeBand />

      <ServiceBenefits />

      <section className="section">
        <div className="wrap" style={{ maxWidth: 740 }}>
          <h2 style={{ marginBottom: 20 }}>Your questions answered</h2>
          <Faq items={faq} standalone={false} />
        </div>
      </section>

      <Contact />

      <JsonLd data={serviceSchema({ name: "Email marketing retainer", description: metadata.description as string, slug: "retainer" })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Email retainer", url: `${site.url}/retainer` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
