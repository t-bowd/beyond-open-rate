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
    q: "What's actually included in the monthly retainer?",
    a: "Everything your email program needs to run and perform: lifecycle flows built and maintained, a monthly campaign calendar planned and executed, copy and design handled in-house, deliverability monitored, and a monthly strategy call and revenue report. One engagement, no bolt-ons.",
  },
  {
    q: "How does pricing work?",
    a: "A flat monthly fee scoped to your program. No per-email charges, no hourly billing, no surprise extras. You know exactly what you're paying before we start, and it doesn't change unless the scope does — which we'd discuss with you first.",
  },
  {
    q: "How quickly can we get started?",
    a: "A 30-minute kickoff call, then we're building. Most clients have their first flow live or rebuilt within two weeks of signing. The campaign calendar kicks off in the first full month.",
  },
  {
    q: "Is there a lock-in contract?",
    a: "There's an initial commitment to give the program enough time to compound — email isn't a switch you flip. After that, it's month-to-month. We'd rather keep clients because the results are there than because they're contractually stuck.",
  },
  {
    q: "What do you need from us on an ongoing basis?",
    a: "A monthly approval on the campaign calendar, your brand assets upfront, and access to your platform. Beyond that, the goal is to keep your involvement as light as possible. Most clients spend less than an hour a month on email once the program is set up.",
  },
];

export default function RetainerPage() {
  return (
    <>
      <PageHero
        label="Email retainer"
        title="Full email management. Real results. No guesswork."
        sub="Full lifecycle management, from strategy to send. Your program works the way it should, without you having to run it."
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
