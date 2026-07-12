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
  title: "Email foundations setup, Australia — Beyond Open Rate",
  description:
    "The flows your email program needs to start converting, retaining, and recovering customers — scoped to your business and built to run without you.",
  alternates: { canonical: "/foundations" },
  openGraph: {
    type: "website",
    url: `${site.url}/foundations`,
    title: "Email foundations setup, Australia — Beyond Open Rate",
    description:
      "The flows your email program needs to start converting, retaining, and recovering customers — scoped to your business and built to run without you.",
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
  "A 30-minute kickoff call — everything we build is scoped around your business goals and tech stack, so there are no surprises mid-project.",
  "Flows built to work 24/7, without you lifting a finger. Welcome series, abandoned cart, post-purchase, win-back and more, based on your needs.",
  "Every email written in your brand voice, designed to drive results. Nothing for you to write.",
  "Segmentation setup to ensure the right message reaches the right customer at the right time — boosting relevance, results, and revenue.",
  "List clean and suppression, so you're only reaching people who are likely to engage. Better deliverability, better results.",
  "Deliverability checks and a warm-up plan if needed, so your emails land in inboxes.",
  "Professional, on-brand templates that look great on any device — without hiring a designer.",
  "A customised 30-day plan, so you know what to send after handover.",
  "A handover call to walk you through everything, so you feel confident and set up.",
  "A handover document to support you post-call, so you or your team can move forward without confusion.",
  "30 days of monitoring after go-live, so any issues are caught and fixed before they cost you revenue.",
];

const faq = [
  {
    q: "Which flows are included?",
    a: "It depends on your business and what's missing — that's what the kickoff call is for. Most foundations builds include a welcome series, abandoned cart, post-purchase sequence, and win-back. We scope to what will have the highest revenue impact for your specific setup, not a fixed template.",
  },
  {
    q: "How long does the build take?",
    a: "Most foundations builds are complete within three to four weeks from kickoff. The timeline depends on the number of flows, platform complexity, and how quickly we can get brand assets and access from you. We'll give you a clear timeline before we start.",
  },
  {
    q: "Do we need to be on a specific platform?",
    a: "No. We work across Klaviyo, HubSpot, Brevo, Customer.io, and Mailchimp. If you're not sure which platform is right for your business, we'll tell you — honestly, based on your setup and goals, not on what we prefer to work with.",
  },
  {
    q: "What do you need from us to get started?",
    a: "Access to your email platform and any connected store or CRM, your brand assets (logo, fonts, colours, tone guidelines if you have them), and the 30-minute kickoff call. We handle everything from there — copy, design, build, and setup.",
  },
  {
    q: "What happens after the 30-day monitoring period?",
    a: "You own everything we build, fully. Some clients continue with us on a retainer to manage and optimise the program ongoing. Others run it themselves with the handover document as their guide. Either way, you leave with a working email program, not a dependency on us.",
  },
];

export default function FoundationsPage() {
  noStore();
  const updated = getUpdatedDate();

  return (
    <>
      <PageHero
        label="Email foundations"
        title="Get the email foundations that turn first-time buyers into repeat customers."
        sub="The flows your email program needs to start converting, retaining, and recovering customers — without you having to build it."
      />

      <section className="section narrative-letter" data-screen-label="Foundations intro">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            <p>If you don't have the right flows in place, you're leaving money on the table every day.</p>
            <p>Why? The system that should be turning first-time buyers into repeat customers, and recovering the ones who almost bought, isn't there yet.</p>
            <p>Every day without it is another day of customers slipping through gaps that should be closed. That's revenue going to a competitor, or nowhere at all.</p>
            <p>We build those foundations. Everything scoped specifically to your business, and built to run without you.</p>
          </Reveal>
        </div>
      </section>

      <GuaranteeBand />

      <section className="section" data-screen-label="Foundations benefits">
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
              Stop leaving money on the table. Let&apos;s build. <ArrowIcon />
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

      <JsonLd data={serviceSchema({ name: "Email foundations setup", description: metadata.description as string, slug: "foundations" })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Email foundations", url: `${site.url}/foundations` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
