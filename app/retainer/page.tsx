import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import GuaranteeBand from "@/components/GuaranteeBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing retainer, Australia, Beyond Open Rate",
  description:
    "Full lifecycle email management under one monthly retainer. Flows, campaigns, copy, design, deliverability, and reporting, all managed. No scope creep, no surprises.",
  alternates: { canonical: "/retainer" },
  openGraph: {
    type: "website",
    url: `${site.url}/retainer`,
    title: "Email marketing retainer, Australia, Beyond Open Rate",
    description:
      "Full lifecycle email management under one monthly retainer. Flows, campaigns, copy, design, deliverability, and reporting, all managed. No scope creep, no surprises.",
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
  "A complimentary 30-minute kickoff call. We start with context, not assumptions, so the strategy we build is specific to your business from day one.",
  "No guesswork, with full management of your customer engagement platform to drive revenue and engagement.",
  "Everything your email program needs, covered under one monthly engagement. No separate quotes, no scope creep, no surprises.",
  "Every email written for you, aligned with your brand, designed to drive action beyond open rates.",
  "Testing and reporting to know exactly what's working (and what's not), so every dollar goes towards what actually converts.",
  "Peace of mind that your emails are landing in the inbox, not spam, to protect the revenue you're already generating.",
  "Proactive monitoring of your sender reputation, to identify and fix issues before they cost you money.",
  "A clean, engaged list. No dead weight dragging down your sender reputation or results.",
  "Clear monthly reporting that ties email directly to revenue. No more guessing whether it's worth it.",
  "A 60-minute dedicated monthly strategy call with an expert, so decisions are made faster and stay aligned with your business goals.",
  "Flexible support that scales with your stage, from early-stage brands and start-ups to full lifecycle ownership.",
  "Unlimited email support, to ensure your questions never go unanswered.",
];

const faq = [
  {
    q: "What's actually included in the monthly retainer?",
    a: "Everything your email program needs to run and perform: lifecycle flows built and maintained, a monthly campaign calendar planned and executed, copy and design handled in-house, deliverability monitored, and a monthly strategy call and revenue report. One engagement, no bolt-ons.",
  },
  {
    q: "How does pricing work?",
    a: "A flat monthly fee scoped to your program. No per-email charges, no hourly billing, no surprise extras. You know exactly what you're paying before we start, and it doesn't change unless the scope does, which we'd discuss with you first.",
  },
  {
    q: "How quickly can we get started?",
    a: "A 30-minute kickoff call, then we're building. Most clients have their first flow live or rebuilt within two weeks of signing. The campaign calendar kicks off in the first full month.",
  },
  {
    q: "Is there a lock-in contract?",
    a: "There's an initial commitment to give the program enough time to compound, email isn't a switch you flip. After that, it's month-to-month. We'd rather keep clients because the results are there than because they're contractually stuck.",
  },
  {
    q: "What do you need from us on an ongoing basis?",
    a: "A monthly approval on the campaign calendar, your brand assets upfront, and access to your platform. Beyond that, the goal is to keep your involvement as light as possible. Most clients spend less than an hour a month on email once the program is set up.",
  },
];

export default function RetainerPage() {
  noStore();
  const updated = getUpdatedDate();

  return (
    <>
      <PageHero
        label="Email retainer"
        title="Full email management. Real results. No guesswork."
        sub="Full lifecycle management, from strategy to send. Your program works the way it should, without you having to run it."
      />

      <section className="section narrative-letter" data-screen-label="Retainer intro">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            <p>Your email list is one of the most valuable assets in your business. It's also one of the most neglected. Campaigns only go out when someone has time. Flows are set and forgotten. Nobody's really sure what's driving revenue and what's just noise.</p>
            <p>That's a capacity and expertise problem, and it's quietly costing you money.</p>
            <p>We take full ownership of email and CRM management, working as an extension of your team. You stay focused on your business, while we make sure email is working for it.</p>
          </Reveal>
        </div>
      </section>

      <GuaranteeBand />

      <section className="section" data-screen-label="Retainer benefits">
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
              Let&apos;s get your email earning <ArrowIcon />
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
