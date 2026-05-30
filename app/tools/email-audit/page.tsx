import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import EmailAudit from "@/components/quiz/EmailAudit";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free email program audit",
  description:
    "Score your email marketing program against best practice in under three minutes. Ten questions, tailored recommendations, no sales pitch.",
  alternates: { canonical: "/tools/email-audit" },
};

const faqs = [
  {
    q: "How long does the audit take?",
    a: "About three minutes. Nine multiple-choice questions and one optional free-text question, then your scored results.",
  },
  {
    q: "Do I need to give my email to see results?",
    a: "Yes — we email you the scored results so you have them on file. We don't add you to a follow-up sequence and we never sell your details.",
  },
  {
    q: "Is this just lead bait?",
    a: "The recommendations are the same ones our consultants would give in a paid audit. We share them because the people who book a paid audit are the ones who already know they need help — the tool just makes the gap visible.",
  },
  {
    q: "What kinds of businesses is this for?",
    a: "Mostly e-commerce and SaaS, but the underlying mechanics travel — any business with a list and a product fits. The recommendations adapt to your industry choice.",
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
            Where does your email program <span className="accent">actually</span> stand?
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Ten questions, a score against best practice, and a tailored set
            of next moves emailed straight to you.
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
          <h2>About this audit</h2>
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
