import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — email marketing thinking",
  description:
    "Notes on email marketing, lifecycle automation, deliverability, and the numbers that actually matter.",
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
            Notes on <span className="accent">email that works</span>.
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Thinking on lifecycle, deliverability, segmentation, and the
            difference between a vanity metric and a revenue lever.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          {posts.length === 0 ? (
            <Reveal>
              <p>First posts coming soon.</p>
            </Reveal>
          ) : (
            <ul className="post-list">
              {posts.map((p) => (
                <Reveal as="li" className="post-list-item" key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="post-link">
                    <p className="post-meta">
                      <time dateTime={p.publishedAt}>{fmt(p.publishedAt)}</time>
                      {p.tags && p.tags.length > 0 && (
                        <span className="post-tags"> · {p.tags.join(" · ")}</span>
                      )}
                    </p>
                    <h2>{p.title}</h2>
                    <p>{p.description}</p>
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
