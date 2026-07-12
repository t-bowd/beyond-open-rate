import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import ArrowIcon from "@/components/ArrowIcon";
import Contact from "@/components/Contact";
import CtaLink from "@/components/CtaLink";
import Faq from "@/components/Faq";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { getAllSeoPages, getSeoPage } from "@/lib/seo-pages";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pages = await getAllSeoPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getSeoPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      url: `${site.url}/${slug}`,
      title: page.title,
      description: page.description,
    },
  };
}

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: "anchor" } }],
  ],
};

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, allPages] = await Promise.all([getSeoPage(slug), getAllSeoPages()]);
  if (!page) notFound();

  const url = `${site.url}/${slug}`;

  return (
    <>
      <PageHero
        label={page.h1}
        title={page.h1}
        sub={page.heroSub}
        actions={
          <>
            <CtaLink href="/tools/email-audit" className="btn btn-primary btn-lg btn-arrow" label="audit_cta" location="hero">
              Score your email program <ArrowIcon />
            </CtaLink>
            <CtaLink href="/strategy-session" className="btn btn-ghost btn-lg" label="contact_cta" location="hero">
              Talk to us
            </CtaLink>
          </>
        }
      />

      <section className="section">
        <div className="wrap prose" style={{ maxWidth: 740 }}>
          <MDXRemote
            source={page.content}
            options={{ mdxOptions: mdxOptions as never }}
          />
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <h2 style={{ marginBottom: 12 }}>Not sure where to start?</h2>
          <p style={{ marginBottom: 28 }}>
            Take the free 3-minute audit. Ten questions on your automations,
            deliverability, and segmentation — and a scored breakdown of what
            to fix first.
          </p>
          <CtaLink href="/tools/email-audit" className="btn btn-primary btn-lg btn-arrow" label="audit_cta" location="mid_page">
            Start the free audit <ArrowIcon />
          </CtaLink>
        </div>
      </section>

      {page.faq && page.faq.length > 0 && (
        <section className="section">
          <div className="wrap" style={{ maxWidth: 740 }}>
            <h2 style={{ marginBottom: 20 }}>Your questions answered</h2>
            <Faq items={page.faq} standalone={false} />
          </div>
        </section>
      )}

      {(() => {
        const related = page.type === "location"
          ? allPages.filter((p) => p.slug !== slug && p.type !== "location")
          : allPages.filter((p) => p.slug !== slug && p.type === "location");
        if (!related.length) return null;
        const heading = "Related articles";
        return (
          <section className="section">
            <div className="wrap" style={{ maxWidth: 740 }}>
              <h2 style={{ marginBottom: 16 }}>{heading}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "10px 24px" }}>
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`}>{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })()}

      {page.type === "location" && (() => {
        const siblings = allPages.filter((p) => p.slug !== slug && p.type === "location");
        if (!siblings.length) return null;
        return (
          <section className="section">
            <div className="wrap" style={{ maxWidth: 740 }}>
              <h2 style={{ marginBottom: 16 }}>We also serve</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "10px 24px" }}>
                {siblings.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`}>{p.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })()}

      <Contact />

      <JsonLd
        data={serviceSchema({
          name: page.h1,
          description: page.description,
          ...(page.location ? { areaServed: page.location } : {}),
        })}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: page.h1, url }])} />
      {page.faq && page.faq.length > 0 && <JsonLd data={faqSchema(page.faq)} />}
    </>
  );
}
