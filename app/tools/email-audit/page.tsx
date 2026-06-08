import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import EmailAudit from "@/components/quiz/EmailAudit";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free email marketing audit — score your program in 3 minutes",
  description:
    "Free email audit for Australian businesses. Ten questions on your automations, deliverability, and segmentation — score out of 75 with a prioritised fix list. Takes 3 minutes.",
  alternates: { canonical: "/tools/email-audit" },
};

const faqs = [
  {
    q: "What does the audit actually cover?",
    a: "The ten questions cover the areas that account for most of the gap between a mediocre email program and a well-run one: which automations you have live, how you approach segmentation and sends, your deliverability setup, authentication, and whether you're tracking metrics that connect to revenue. You get a score out of 75 and a prioritised list of what to address first, based on your specific answers.",
  },
  {
    q: "How long does it take?",
    a: "About three minutes. Ten multiple-choice questions and one optional free-text question — then your scored results are emailed to you.",
  },
  {
    q: "Why do you need my email?",
    a: "We send the results to your inbox so you have a concrete record to refer back to — a scored breakdown and your priority recommendations in one place.",
  },
  {
    q: "Who is this for?",
    a: "Any business that sends marketing email. The scoring and recommendations adapt based on your business type and what you currently have live, so the output reflects where you actually are — not generic best-practice advice.",
  },
];

export default function EmailAuditPage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Audit your email marketing program",
    description:
      "A nine-question self-assessment that scores your email program and returns a tailored set of next moves.",
    totalTime: "PT3M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Answer nine questions on your current setup, platform, and flows" },
      { "@type": "HowToStep", position: 2, name: "Enter your email to receive your scored results" },
      { "@type": "HowToStep", position: 3, name: "Get a personalised list of next-move recommendations" },
    ],
  };

  return (
    <>
      <section className="hero" data-screen-label="Email audit">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Revenue Killing Email Marketing <span className="accent">Secrets Exposed</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            What marketing agencies won&apos;t tell you&hellip;and it&apos;s leaving money on the table.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            What you don&apos;t know about email marketing that&apos;s killing your revenue.
            Unlock instant improvement recommendations with this free audit &mdash; just answer 10 quick questions.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <EmailAudit />
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <h2>How it works</h2>
          <dl className="post-faq">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <JsonLd data={howTo} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Tools", url: `${site.url}/tools` },
          { name: "Email audit", url: `${site.url}/tools/email-audit` },
        ])}
      />
    </>
  );
}
