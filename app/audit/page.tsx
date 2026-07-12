import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing audit, Australia , Beyond Open Rate",
  description:
    "A complete diagnostic of your email and lifecycle setup, delivered with a prioritised action plan. Find out exactly what your email program is worth , and what it's costing you.",
  alternates: { canonical: "/audit" },
  openGraph: {
    type: "website",
    url: `${site.url}/audit`,
    title: "Email marketing audit, Australia , Beyond Open Rate",
    description:
      "A complete diagnostic of your email and lifecycle setup, delivered with a prioritised action plan.",
  },
};

function ordinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

function getUpdatedDate() {
  const MS_PER_DAY = 86_400_000;
  const now = Date.now();
  const bucketStart = Math.floor(now / (MS_PER_DAY * 3)) * (MS_PER_DAY * 3);
  const d = new Date(bucketStart);
  const month = d.toLocaleString("en-AU", { month: "long" });
  return `${ordinal(d.getDate())} of ${month} ${d.getFullYear()}`;
}

const benefits = [
  "A 30-minute pre-audit call, so we understand your business and setup before we assess it. You get audit findings that reflect your actual situation, not a generic checklist.",
  "A clear picture of where you're leaving money on the table across your customer journey.",
  "The truth about whether your emails are even reaching inboxes before you spend another dollar on campaigns.",
  "A list health assessment so you know which segments are costing you in relevance, revenue, and sender reputation.",
  "A campaign history review that shows you what's driving revenue , and what isn't.",
  "A copy and design review that pinpoints why opens, clicks, or conversions are underperforming.",
  "A tech stack review so you know if you're paying for tools you don't need, or missing tools that would make a real difference.",
  "An estimate of what better lifecycle email is potentially worth to your specific business.",
  "A PDF report that you can act on, or share internally.",
  "A walkthrough session to get clarity on findings, so you can ask questions and leave knowing what you need to do next.",
  "A prioritised action plan, so there's no confusion about what to fix first for the biggest impact.",
];

const faq = [
  {
    q: "What exactly does the audit cover?",
    a: "Your active flows and automations, campaign history and performance, deliverability and authentication setup, list health and segmentation, copy and design, and your tech stack. We look at everything that affects whether email is making you money , not just whether it's sending.",
  },
  {
    q: "How long does the audit take?",
    a: "We run the audit over five to seven business days from the kickoff call. You'll receive the PDF report before the walkthrough session, so you have time to read through it and come with questions.",
  },
  {
    q: "Do you need access to our email platform?",
    a: "Yes. A meaningful audit requires looking at what's actually in your account , flows, campaign history, deliverability data, list segments. Read-only access is fine. We'll tell you exactly what we need before we start.",
  },
  {
    q: "What happens after we get the report?",
    a: "That's up to you. Some clients take the report and implement it themselves or with their team. Others ask us to do it , which we can quote as a project or a retainer, depending on scope. There's no obligation to continue, and we won't upsell you during the audit itself.",
  },
  {
    q: "Is the audit a one-off, or can we work together ongoing?",
    a: "The audit is a standalone engagement with a fixed fee. If what we find points to ongoing work , and it usually does , we'll scope a retainer or project off the back of the findings. You'd go into that knowing exactly what needs fixing and why, which makes the engagement faster and more effective.",
  },
];

export default function AuditPage() {
  noStore();
  const updated = getUpdatedDate();

  return (
    <>
      <PageHero
        label="Email audit"
        title="Your email program is either making you money or losing it. Find out which."
        sub="A complete diagnostic of your email and lifecycle setup, delivered with a prioritised action plan."
      />

      <section className="section narrative-letter" data-screen-label="Audit intro">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            <p>Most businesses assume their email is working well enough. Most of them are wrong.</p>
            <p>Flows that haven't been touched since setup. Deliverability issues that are quietly suppressing reach. Campaigns going out with no clear picture of what's actually driving revenue.</p>
            <p>The result? Money that should be yours is slipping through the cracks, and nobody's noticed because the open rates look fine.</p>
            <p>An audit finds what's broken, what's missing, and what it's costing you. This isn't a vanity exercise , it's a revenue diagnostic.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" data-screen-label="Audit benefits">
        <div className="wrap" style={{ maxWidth: 740 }}>
          <Reveal as="h2" style={{ marginBottom: 32 }}>What you get</Reveal>
          <Reveal as="ul" className="benefits-list">
            {benefits.map((b, i) => (
              <li key={i} className="benefits-item">
                <span className="benefits-check" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>{b}</span>
              </li>
            ))}
          </Reveal>
          <Reveal style={{ marginTop: 40 }}>
            <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">
              Ready to find out what your email program is actually worth? <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 740 }}>
          <h2 style={{ marginBottom: 20 }}>Your questions answered</h2>
          <Faq items={faq} standalone={false} />
        </div>
      </section>

      <Contact />

      <JsonLd data={serviceSchema({ name: "Email marketing audit", description: metadata.description as string, slug: "audit" })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Email audit", url: `${site.url}/audit` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
