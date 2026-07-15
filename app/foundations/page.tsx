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
import pageData from "@/content/pages/services/foundations.json";

export const metadata: Metadata = {
  title: pageData.meta.title,
  description: pageData.meta.description,
  alternates: { canonical: "/foundations" },
  openGraph: {
    type: "website",
    url: `${site.url}/foundations`,
    title: pageData.meta.title,
    description: pageData.meta.description,
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

export default function FoundationsPage() {
  noStore();
  const updated = getUpdatedDate();
  const { hero, intro, benefits, faq } = pageData;

  return (
    <>
      <PageHero
        label={hero.label}
        title={<>{hero.titlePre} <span className="highlight">{hero.titleHighlight}</span>{hero.titlePost}</>}
        sub={hero.sub}
      />

      <section className="section narrative-letter" data-screen-label="Foundations intro">
        <div className="wrap narrative-inner">
          <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
          <Reveal as="div" className="narrative-body">
            {intro.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <GuaranteeBand />

      <section className="section" data-screen-label="Foundations benefits">
        <div className="wrap" style={{ maxWidth: 740 }}>
          <Reveal as="h2" style={{ marginBottom: 32 }}>{benefits.heading}</Reveal>
          <Reveal as="ul" className="benefits-list">
            {benefits.items.map((b, i) => (
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
            <Link href={benefits.ctaHref} className="btn btn-primary btn-lg btn-arrow">
              {benefits.ctaText} <ArrowIcon />
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

      <JsonLd data={serviceSchema({ name: "Email foundations setup", description: pageData.meta.description, slug: "foundations" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: "Email foundations", url: `${site.url}/foundations` }])} />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
