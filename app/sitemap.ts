import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllSeoPages } from "@/lib/seo-pages";
import { getAllServicePages } from "@/lib/services";

const u = (path: string) => `${site.url}${path}`;

// Real last-edit dates for static pages (pulled from git history).
// Bump these manually only when the page content actually changes —
// do NOT compute `new Date()` here, it falsely signals every page as
// freshly updated on every build, which dilutes freshness signals for
// both classic SEO and AI crawlers.
const STATIC_DATES = {
  home: new Date("2026-06-01"),
  services: new Date("2026-06-03"),
  tools: new Date("2026-06-03"),
  emailAudit: new Date("2026-06-08"),
  blog: new Date("2026-06-08"),
  about: new Date("2026-06-03"),
  contact: new Date("2026-06-01"),
};

// Fallback for service/seo content pages without an explicit
// `updatedAt` frontmatter field set yet.
const CONTENT_FALLBACK_DATE = new Date("2026-06-03");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, seoPages, servicePages] = await Promise.all([
    getAllPosts(),
    getAllSeoPages(),
    getAllServicePages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: u("/"),                   lastModified: STATIC_DATES.home,       changeFrequency: "weekly",  priority: 1.0 },
    { url: u("/services"),           lastModified: STATIC_DATES.services,   changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools"),              lastModified: STATIC_DATES.tools,      changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools/email-audit"),  lastModified: STATIC_DATES.emailAudit, changeFrequency: "monthly", priority: 0.9 },
    { url: u("/blog"),               lastModified: STATIC_DATES.blog,       changeFrequency: "weekly",  priority: 0.7 },
    { url: u("/about"),              lastModified: STATIC_DATES.about,      changeFrequency: "monthly", priority: 0.5 },
    { url: u("/contact"),            lastModified: STATIC_DATES.contact,    changeFrequency: "yearly",  priority: 0.4 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: u(`/services/${p.slug}`),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : CONTENT_FALLBACK_DATE,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const seoEntries: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: u(`/${p.slug}`),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : CONTENT_FALLBACK_DATE,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: u(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...seoEntries, ...blogEntries];
}
