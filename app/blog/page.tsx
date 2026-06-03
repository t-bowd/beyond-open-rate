import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing strategy and advice — Beyond Open Rate",
  description:
    "Practical thinking on lifecycle automation, deliverability, segmentation, and the metrics that drive email revenue — for Australian e-commerce and service businesses.",
  alternates: { canonical: "/blog" },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="hero" data-screen-label="Blog">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Email marketing{" "}
            <span className="accent">strategy and advice</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Thinking on lifecycle, automation, deliverability, and the metrics
            that actually move revenue.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <Reveal>
              <p style={{ color: "var(--ink-soft)" }}>First posts coming soon.</p>
            </Reveal>
          ) : (
            <ul className="blog-grid">
              {posts.map((p) => (
                <Reveal as="li" key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="blog-card">
                    <p className="post-meta">
                      <time dateTime={p.publishedAt}>{fmt(p.publishedAt)}</time>
                      {p.tags && p.tags.length > 0 && (
                        <span className="post-tags"> · {p.tags.join(" · ")}</span>
                      )}
                    </p>
                    <h2>{p.title}</h2>
                    <p className="blog-card-desc">{p.description}</p>
                    <span className="blog-card-cta">Read more →</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Contact />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Blog", url: `${site.url}/blog` },
        ])}
      />
    </>
  );
}
