import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/jsonld";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  };
}

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      { behavior: "wrap", properties: { className: "anchor" } },
    ],
  ],
};

const BREAKING: Record<string, string[]> = {
  deliverability: [
    "The deliverability issue quietly killing your open rates — exposed",
    "Why your emails are going to spam (and what your ESP isn't telling you)",
    "Australia's top email agency reveals the inbox placement secret most brands miss",
    "Exposed: the sender reputation damage hiding in plain sight",
  ],
  authentication: [
    "The SPF, DKIM, and DMARC truth your ESP isn't making clear",
    "Exposed: the authentication gap costing senders inbox placement",
    "Australia's #1 email agency reveals the technical fix most brands skip",
  ],
  technical: [
    "The technical email fix most agencies won't tell you about",
    "Exposed: why your email setup is quietly failing you",
    "Australia's top email experts reveal what's actually breaking your program",
  ],
  flows: [
    "The email automation gap costing Australian brands thousands per month",
    "Revealed: the lifecycle flows your competitors are running (and you're not)",
    "Industry insiders expose the automation strategy hiding in plain sight",
    "Australia's #1 email agency reveals what a real lifecycle program looks like",
  ],
  automation: [
    "Revealed: the automation playbook behind Australia's best-performing email programs",
    "The set-and-forget email myth — exposed",
    "What your flows are missing (and what it's costing you every day)",
  ],
  ecommerce: [
    "How Australia's fastest-growing e-commerce brands are using email in 2026",
    "The cart abandonment truth no one's talking about — revealed",
    "E-commerce email experts expose what's actually driving repeat purchases",
    "Revealed: the email strategy behind Australia's highest-revenue online stores",
  ],
  segmentation: [
    "The segmentation secret separating high-performing programs from the rest",
    "Why sending to your whole list is quietly killing your results — exposed",
    "Australia's top email agency reveals the audience strategy most brands ignore",
  ],
  "list health": [
    "The email list truth Australian brands don't want to hear",
    "Revealed: why your subscriber count is lying to you",
    "Industry insiders expose the list hygiene mistake costing brands revenue",
  ],
  strategy: [
    "What the best-performing email programs in Australia have in common — revealed",
    "The email revenue gap most businesses don't know they have",
    "Australia's #1 email agency reveals what separates winning email programs",
    "Exposed: the strategy shift that turned email into a reliable revenue channel",
  ],
};

const BREAKING_DEFAULT = [
  "What Australia's best email programs have in common — revealed",
  "The email mistake costing brands revenue every single day",
  "Australia's #1 email agency exposes what most brands are getting wrong",
  "Revealed: the email strategy shift that changes everything",
];

function getBreakingNews(tags: string[] = [], slug: string): string {
  const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  for (const tag of tags) {
    const pool = BREAKING[tag.toLowerCase()];
    if (pool) return pool[seed % pool.length];
  }
  return BREAKING_DEFAULT[seed % BREAKING_DEFAULT.length];
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;

  return (
    <>
      <article className="section post" data-screen-label="Post">
        <div className="wrap" style={{ maxWidth: 740 }}>
          <p className="post-meta">
            <Link href="/blog">← Back to blog</Link>
          </p>
          <div className="post-breaking">
            <span className="post-breaking-dot" aria-hidden="true" />
            <span className="post-breaking-label">Breaking News</span>
            <span className="post-breaking-text">{getBreakingNews(post.tags, post.slug)}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">
            <time dateTime={post.publishedAt}>{fmt(post.publishedAt)}</time>
            {post.author && <span> · {post.author}</span>}
          </p>
          <div className="prose">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions: mdxOptions as never }}
            />
          </div>

          {post.faq && post.faq.length > 0 && (
            <section className="post-faq">
              <h2>Frequently asked</h2>
              <Faq items={post.faq} standalone={false} />
            </section>
          )}
        </div>
      </article>

      <Contact />

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          url,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: post.author,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Blog", url: `${site.url}/blog` },
          { name: post.title, url },
        ])}
      />
      {post.faq && post.faq.length > 0 && <JsonLd data={faqSchema(post.faq)} />}
    </>
  );
}
