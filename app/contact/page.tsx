import type { Metadata } from "next";
import { Suspense } from "react";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — request your free email audit",
  description:
    "Tell us about your current email program. We'll come back within one business day with a free 20-minute teardown and where we'd start.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="hero" data-screen-label="Contact">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Tell us where you&apos;re <span className="accent">at</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            One business day to a free teardown of your current email program.
            No pitch, no obligation.
          </Reveal>
        </div>
      </section>

      <section className="section cta" id="contact">
        <div className="wrap">
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Contact", url: `${site.url}/contact` },
        ])}
      />
    </>
  );
}
