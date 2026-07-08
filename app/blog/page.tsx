import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import BlogListing from "@/components/BlogListing";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Email marketing strategy and advice",
  description:
    "Practical thinking on lifecycle automation, deliverability, segmentation, and the metrics that drive email revenue — for Australian e-commerce and service businesses.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHero
        label="Blog"
        title={<>Email marketing <span className="highlight">strategy and advice</span>.</>}
        sub="Thinking on lifecycle, automation, deliverability, and the metrics
          that actually move revenue."
      />

      <section className="section">
        <div className="wrap">
          {posts.length === 0 ? (
            <Reveal>
              <p style={{ color: "var(--ink-soft)" }}>First posts coming soon.</p>
            </Reveal>
          ) : (
            <BlogListing
              posts={posts.map((p) => ({
                slug: p.slug,
                title: p.title,
                description: p.description,
                publishedAt: p.publishedAt,
                tags: p.tags,
              }))}
            />
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
