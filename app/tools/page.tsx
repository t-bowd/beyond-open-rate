import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing tools",
  description:
    "Practical diagnostics to help you understand where your email program stands — and what to do about it.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    slug: "email-audit",
    title: "Email program audit",
    description:
      "Ten quick questions on your current setup. We score where you are and give you a tailored set of next moves.",
    cta: "Take the audit",
    icon: "✦",
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="hero" data-screen-label="Tools">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            <span className="accent">Tools</span> to improve your email program.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Practical diagnostics that show you where your email program stands
            — and what to actually do about it.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="tool-grid">
            {tools.map((t) => (
              <Reveal key={t.slug} className="tool-card">
                <span className="tool-icon" aria-hidden="true">{t.icon}</span>
                <h2>{t.title}</h2>
                <p>{t.description}</p>
                <Link href={`/tools/${t.slug}`} className="btn btn-primary">
                  {t.cta} →
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Contact />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Tools", url: `${site.url}/tools` },
        ])}
      />
    </>
  );
}
