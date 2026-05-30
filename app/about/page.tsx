import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Beyond Open Rate is a small, senior email marketing consultancy. We work with a handful of brands at a time, do the work ourselves, and report against the numbers your business actually runs on.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="hero" data-screen-label="About">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Small team. <span className="accent">Senior hands.</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Beyond Open Rate is a focused email marketing consultancy. We work
            with a handful of brands at a time so the people you meet are the
            people doing the work.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Reveal>
            <h2>What we believe</h2>
            <p>
              Most email programs are quietly leaving money on the table — not
              because the team is bad, but because email is everyone&apos;s
              third priority. Our job is to make it someone&apos;s first.
            </p>
            <p>
              We don&apos;t outsource the work. We don&apos;t use templates we
              haven&apos;t written ourselves. We don&apos;t report on opens.
              We optimise against revenue, and we&apos;ll tell you when
              something isn&apos;t worth doing.
            </p>
            <h2>Who we work with</h2>
            <p>
              Growing e-commerce and SaaS brands, mostly post-product-market-fit,
              where email is real revenue and deserves real attention. We work
              with founders, marketing leads, and in-house teams who want a
              partner — not a vendor.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ])}
      />
    </>
  );
}
