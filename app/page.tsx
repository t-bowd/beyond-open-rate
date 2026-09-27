import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import Hero from "@/components/Hero";
import SplitOffer from "@/components/SplitOffer";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Reveal from "@/components/Reveal";
import { JsonLd, faqSchema } from "@/lib/jsonld";
import homepageData from "@/content/homepage/homepage.json";

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
  const bucketStart = Math.floor(Date.now() / (MS_PER_DAY * 3)) * (MS_PER_DAY * 3);
  const d = new Date(bucketStart);
  const month = d.toLocaleString("en-AU", { month: "long" });
  return `${ordinal(d.getDate())} of ${month} ${d.getFullYear()}`;
}

const { problemAgitation, fullFunnel, differentiator, howWeWork, faq } = homepageData;

export const metadata: Metadata = {
  title: "Beyond Marketing — Full-funnel digital marketing agency, Australia",
  description:
    "Most businesses pour budget into ads and never fix what happens after the click. We oversee the whole funnel — email, paid social, SEO, landing pages — so the traffic you earn turns into revenue.",
  alternates: { canonical: "https://www.beyondmarketing.com.au/" },
};

export default function Page() {
  noStore();
  const updated = getUpdatedDate();
  return (
    <>
      <Hero />

      {/* Problem agitation */}
      <section className="section narrative-letter" data-screen-label="Problem agitation">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            <p>{problemAgitation.lead}</p>
            {problemAgitation.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <SplitOffer />

      {/* Full funnel */}
      <section className="section" data-screen-label="Full funnel">
        <div className="wrap">
          <Reveal className="section-head">
            {fullFunnel.eyebrow && <p className="eyebrow">{fullFunnel.eyebrow}</p>}
            <h2>{fullFunnel.headline}</h2>
            <p className="section-intro">{fullFunnel.body}</p>
          </Reveal>
          <Reveal as="div" className="funnel-grid">
            {fullFunnel.stages.map((stage) => (
              <Link key={stage.label} href={stage.href} className="funnel-card">
                <p className="funnel-card-label">{stage.label}</p>
                <p className="funnel-card-channels">{stage.channels}</p>
                <p className="funnel-card-body">{stage.body}</p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Differentiator */}
      <section className="section" data-screen-label="Differentiator">
        <div className="wrap" style={{ maxWidth: 740 }}>
          {differentiator.eyebrow && <Reveal as="p" className="eyebrow">{differentiator.eyebrow}</Reveal>}
          <Reveal as="h2" style={{ marginBottom: 24 }}>{differentiator.headline}</Reveal>
          <Reveal as="div" className="narrative-body">
            {differentiator.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      {/* How we work */}
      <section className="section" data-screen-label="How we work">
        <div className="wrap">
          <Reveal className="section-head">
            <h2>{howWeWork.headline}</h2>
          </Reveal>
          <Reveal as="ol" className="how-we-work-steps">
            {howWeWork.steps.map((step) => (
              <li key={step.number} className="how-we-work-step">
                <span className="step-number">{step.number}</span>
                <div>
                  <strong>{step.label}.</strong> {step.body}
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Testimonial />

      {/* FAQ */}
      <section className="section" id="faq" data-screen-label="FAQ">
        <div className="wrap">
          <Reveal className="section-head">
            <h2 className="display-huge faq-heading">Your questions answered</h2>
          </Reveal>
          <Faq items={faq} standalone={false} />
        </div>
      </section>

      <FinalCta />

      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
