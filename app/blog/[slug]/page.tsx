import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import CtaBand from "@/components/CtaBand";
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
              <dl>
                {post.faq.map((f) => (
                  <div key={f.q}>
                    <dt>{f.q}</dt>
                    <dd>{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </article>

      <CtaBand />

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
