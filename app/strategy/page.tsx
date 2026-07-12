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
  title: "Email strategy session, Australia, Beyond Open Rate",
  description:
    "A forward-focused session that gives you a clear email plan built for your business, not a template. Walk away knowing exactly what to build, in what order, and what it's worth.",
  alternates: { canonical: "/strategy" },
  openGraph: {
    type: "website",
    url: `${site.url}/strategy`,
    title: "Email strategy session, Australia, Beyond Open Rate",
    description:
      "A forward-focused session that gives you a clear email plan built for your business, not a template.",
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
  "A 60-minute working session of lifecycle mapping, to understand where you are now and where you should be, so you know where untapped revenue lies.",
  "Know which flows to build next for the fastest return, so you don't waste effort on the wrong priorities.",
  "Segmentation strategy to ensure the right message reaches the right person, without guesswork.",
  "An estimate of what better email could be worth to your business, so you can take action with confidence.",
  "Tech stack recommendations appropriate for your business, so you avoid wasted spend.",
  "A plan built with you in real time, not a generic template, tailored for your business.",
  "A take-away PDF summary of everything covered, so you walk away with something to implement straight away.",
];

const faq = [
  {
    q: "What actually happens in the session?",
    a: "We work through your current email setup, your business goals, and what's missing. From there we map your lifecycle, identify the highest-impact opportunities, and build a prioritised plan in real time. You leave with a PDF summary of everything covered, not a follow-up email telling you to book a call.",
  },
  {
    q: "How long does the session run?",
    a: "Sixty minutes. Enough time to go deep on your specific situation without wasting yours. We prepare before the call so we're not spending your time on basics, we're already across your setup when we start.",
  },
  {
    q: "Is this a sales call in disguise?",
    a: "No. We're upfront about that in the intro for a reason. This is a working session, you'll walk away with a plan you can act on regardless of whether you work with us after. If we think we can help you further, we'll say so at the end. There's no pitch in the middle of it.",
  },
  {
    q: "What should we prepare before the session?",
    a: "Nothing formal. It helps to have a rough sense of your current setup (what platform you're on, what flows are live, what your list size is) and what you're trying to achieve. If you have access to your ESP during the call, even better, but it's not required.",
  },
  {
    q: "What happens after the session?",
    a: "You get the PDF summary within 24 hours. From there, implement it yourself, hand it to your team, or bring it back to us, the choice is yours. If you want us to build or manage what we've mapped out, we'll scope that as a separate engagement.",
  },
];

export default function StrategyPage() {
  noStore();
  const updated = getUpdatedDate();

  return (
    <>
      <PageHero
        label="Email strategy"
        title="Stop guessing what to build. Start with a plan that's built for your business."
        sub="A forward-focused session that gives you a clear plan. Built for your business, not a template."
      />

      <section className="section narrative-letter" data-screen-label="Strategy intro">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            <p>Perhaps you don't have an email problem. You have a direction problem.</p>
            <p>You know email could be doing more for your revenue. You're just not sure what to prioritise, what to build next, or whether what you have is worth keeping. So you keep putting it off, or doing the same thing with the same results.</p>
            <p>A strategy session cuts through that.</p>
            <p>We map where you are now and where you should be, identify what to build next for the fastest return, and build a clear picture of what better email could be worth to your revenue.</p>
            <p>Leave with a plan you can act on, whether you implement it yourself, hand it to your team, or bring it back to us.</p>
            <p>This is a working session, not a sales call in disguise. You stand to get more out of it than most businesses get from a month of mediocre agency retainers.</p>
          </Reveal>
        </div>
      </section>

      <GuaranteeBand />

      <section className="section" data-screen-label="Strategy benefits">
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
              Let&apos;s map your next move. <ArrowIcon />
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

      <JsonLd data={serviceSchema({ name: "Email strategy session", description: metadata.description as string, slug: "strategy" })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Email strategy", url: `${site.url}/strategy` },
        ])}
      />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
