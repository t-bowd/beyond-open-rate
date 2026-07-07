"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ListPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags?: string[];
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogListing({ posts }: { posts: ListPost[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? posts.filter((p) => p.tags?.includes(active)) : posts;

  return (
    <div className="blog-layout">
      <ul className="blog-list">
        {filtered.length === 0 && (
          <p style={{ color: "var(--ink-soft)" }}>No posts in this category yet.</p>
        )}
        {filtered.map((p) => (
          <li className="blog-row" key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="blog-row-link">
              <h2>{p.title}</h2>
              <p className="post-meta">
                <time dateTime={p.publishedAt}>{fmt(p.publishedAt)}</time>
                {p.tags && p.tags.length > 0 && (
                  <span className="post-tags"> · {p.tags.join(" · ")}</span>
                )}
              </p>
              <p className="blog-row-desc">{p.description}</p>
              <span className="blog-card-cta">Read more →</span>
            </Link>
          </li>
        ))}
      </ul>

      <aside className="blog-sidebar">
        <div className="blog-sidebar-section">
          <p className="blog-sidebar-heading">Categories</p>
          <div className="blog-tag-pills">
            <button
              type="button"
              className={`tag-pill ${active === null ? "selected" : ""}`}
              onClick={() => setActive(null)}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag-pill ${active === t ? "selected" : ""}`}
                onClick={() => setActive(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-sidebar-offer">
          <p className="eyebrow">Free tool</p>
          <h3>Email program audit</h3>
          <p>
            Ten questions on your automations, deliverability, and
            segmentation. Takes about three minutes — you get a score out of
            75 and a prioritised list of what to fix first.
          </p>
          <Link href="/tools/email-audit" className="btn btn-primary">
            Take the free audit
          </Link>
        </div>
      </aside>
    </div>
  );
}
