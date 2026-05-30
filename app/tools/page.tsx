import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free email marketing tools",
  description:
    "Free tools to assess and improve your email program — built from what we use ourselves on client audits.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    slug: "email-audit",
    title: "Email program audit",
    description:
      "Ten quick questions on your current setup. We score where you are and email you a tailored set of next moves.",
    time: "~3 minutes",
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="hero" data-screen-label="Tools">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Free <span className="accent">tools</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            The same diagnostics we run on paid audits, packaged up so you can
            self-serve. No fluff, no upsell wall.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <ul className="post-list">
            {tools.map((t) => (
              <Reveal as="li" className="post-list-item" key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="post-link">
                  <p className="post-meta">FREE · {t.time}</p>
                  <h2>{t.title}</h2>
                  <p>{t.description}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Tools", url: `${site.url}/tools` },
        ])}
      />
    </>
  );
}
