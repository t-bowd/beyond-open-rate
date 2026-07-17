import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import Faq from "@/components/Faq";
import GuaranteeBand from "@/components/GuaranteeBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SplitOffer from "@/components/SplitOffer";
import FinalCta from "@/components/FinalCta";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import type { Block, LandingPage } from "@/lib/landing-pages";

function BlockPageHero({ b }: { b: Extract<Block, { _template: "pageHero" }> }) {
  const title = (
    <>
      {b.titlePre} <span className="highlight">{b.titleHighlight}</span>{b.titlePost ?? ""}
    </>
  );
  return (
    <PageHero
      label={b.label ?? ""}
      title={title}
      sub={b.sub}
      actions={
        b.ctaText && b.ctaHref ? (
          <>
            <Link href={b.ctaHref} className="btn btn-primary btn-lg btn-arrow">
              {b.ctaText} <ArrowIcon />
            </Link>
            {b.microCopy && <p className="micro-copy">{b.microCopy}</p>}
          </>
        ) : undefined
      }
    />
  );
}

function BlockTextSection({ b }: { b: Extract<Block, { _template: "textSection" }> }) {
  return (
    <section className="section narrative-letter">
      <div className="wrap narrative-inner">
        {b.heading && <Reveal as="h2" style={{ marginBottom: 24 }}>{b.heading}</Reveal>}
        <Reveal as="div" className="narrative-body">
          {b.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </Reveal>
      </div>
    </section>
  );
}

function BlockBenefitsList({ b }: { b: Extract<Block, { _template: "benefitsList" }> }) {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 740 }}>
        <Reveal as="h2" style={{ marginBottom: 32 }}>{b.heading}</Reveal>
        <Reveal as="ul" className="benefits-list">
          {b.items.map((item, i) => (
            <li key={i} className="benefits-item">
              <span className="benefits-check" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </Reveal>
        {b.ctaText && b.ctaHref && (
          <Reveal style={{ marginTop: 40 }}>
            <Link href={b.ctaHref} className="btn btn-primary btn-lg btn-arrow">
              {b.ctaText} <ArrowIcon />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function BlockFaqSection({ b }: { b: Extract<Block, { _template: "faqSection" }> }) {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 740 }}>
        <h2 style={{ marginBottom: 20 }}>{b.heading ?? "Your questions answered"}</h2>
        <Faq items={b.questions} standalone={false} />
      </div>
    </section>
  );
}

function renderBlock(block: Block, i: number) {
  switch (block._template) {
    case "pageHero":      return <BlockPageHero key={i} b={block} />;
    case "textSection":   return <BlockTextSection key={i} b={block} />;
    case "guaranteeBand": return <GuaranteeBand key={i} />;
    case "benefitsList":  return <BlockBenefitsList key={i} b={block} />;
    case "splitOffer":    return <SplitOffer key={i} />;
    case "finalCta":      return <FinalCta key={i} />;
    case "faqSection":    return <BlockFaqSection key={i} b={block} />;
    case "testimonials":  return <Testimonial key={i} />;
    default:              return null;
  }
}

export default function LandingPageRenderer({ page }: { page: LandingPage }) {
  return (
    <>
      {page.blocks.map((block, i) => renderBlock(block, i))}
      <Contact />
    </>
  );
}
