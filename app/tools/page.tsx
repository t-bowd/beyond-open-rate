import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArrowIcon from "@/components/ArrowIcon";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free email marketing tools for Australian businesses",
  description:
    "Free diagnostic tools to audit your email program. See where your automations, deliverability, and segmentation are losing you revenue.",
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
      <PageHero
        label="Tools"
        title={<><span className="highlight">Tools</span> to improve your email program.</>}
        sub="Practical diagnostics that show you where your email program stands, and what to actually do about it."
      />

      <section className="section">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <div className="tool-grid">
            {tools.map((t) => (
              <Reveal key={t.slug} className="tool-card">
                <span className="tool-icon" aria-hidden="true">{t.icon}</span>
                <h2>{t.title}</h2>
                <p>{t.description}</p>
                <Link href={`/tools/${t.slug}`} className="btn btn-primary btn-arrow">
                  {t.cta} <ArrowIcon />
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
