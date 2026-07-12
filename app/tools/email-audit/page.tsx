import type { Metadata } from "next";
import EmailAudit from "@/components/quiz/EmailAudit";
import Faq from "@/components/Faq";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free email marketing audit , score your program in 3 minutes",
  description:
    "Free email audit for Australian businesses. Ten questions on your automations, deliverability, and segmentation , with an instant scored breakdown.",
  alternates: { canonical: "/tools/email-audit" },
};

const faqs = [
  {
    q: "What does the audit cover?",
    a: "Ten questions designed to expose the gaps most businesses don't know they have. Automations, segmentation, deliverability, revenue tracking. You'll get a score out of 75 and a prioritised list of what needs attention.",
  },
  {
    q: "How long does it take?",
    a: "Three minutes. Ten questions. Know where you stand.",
  },
  {
    q: "Why do you need my email?",
    a: "That's where we send your results. A scored breakdown and your priority fixes, so you know what to do first.",
  },
  {
    q: "Who is this for?",
    a: "Are you a business? Do you send emails? If you answered yes to both, this is for you. Especially if you're not sure whether your email setup is working as hard as it should be.",
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
      <PageHero
        label="Email audit"
        title={<>Revenue killing email marketing <span className="highlight">secrets exposed</span></>}
        sub={<>
          What marketing agencies won't tell you...and it's slowly killing your revenue.{" "}
 Unlock instant expert recommendations with this free audit - just answer 10 quick questions.

        </>}
      />

      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <EmailAudit />
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="section-head">
            <h2>How it works</h2>
          </div>
          <Faq items={faqs} standalone={false} />
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
