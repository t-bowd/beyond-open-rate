import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/jsonld";
import { getAllServicePages, getServicePage } from "@/lib/services";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pages = await getAllServicePages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      type: "website",
      url: `${site.url}/services/${slug}`,
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

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) notFound();

  const url = `${site.url}/services/${slug}`;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero" data-screen-label={page.h1}>
        <div className="wrap hero-inner">
          <h1>{page.h1}</h1>
          {page.heroSub && <p className="hero-sub">{page.heroSub}</p>}
          <div className="hero-actions">
            <Link href="/tools/email-audit" className="btn btn-primary btn-lg">
              Score your email program →
            </Link>
            <Link href="/#contact" className="btn btn-ghost btn-lg">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap prose" style={{ maxWidth: 740 }}>
          <MDXRemote
            source={page.content}
            options={{ mdxOptions: mdxOptions as never }}
          />
        </div>
      </section>

      {/* ── Audit CTA ────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--surface-soft)" }}>
        <div className="wrap" style={{ maxWidth: 680, textAlign: "center" }}>
          <h2 style={{ marginBottom: 12 }}>Not sure where to start?</h2>
          <p style={{ marginBottom: 28 }}>
            Take the free 3-minute audit. Ten questions on your automations,
            deliverability, and segmentation — and a scored breakdown of what
            to fix first.
          </p>
          <Link href="/tools/email-audit" className="btn btn-primary btn-lg">
            Start the free audit →
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {page.faq && page.faq.length > 0 && (
        <section className="section">
          <div className="wrap" style={{ maxWidth: 740 }}>
            <h2>Frequently asked</h2>
            <dl className="post-faq">
              {page.faq.map((f) => (
                <div key={f.q}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <Contact />

      {/* ── Schema ───────────────────────────────────────────── */}
      <JsonLd
        data={serviceSchema({
          name: page.h1,
          description: page.description,
          slug,
          ...(page.location ? { areaServed: page.location } : {}),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: page.h1, url },
        ])}
      />
      {page.faq && page.faq.length > 0 && <JsonLd data={faqSchema(page.faq)} />}
    </>
  );
}
