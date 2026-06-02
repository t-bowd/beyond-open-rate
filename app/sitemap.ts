import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllSeoPages } from "@/lib/seo-pages";
import { getAllServicePages } from "@/lib/services";

const u = (path: string) => `${site.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [posts, seoPages, servicePages] = await Promise.all([
    getAllPosts(),
    getAllSeoPages(),
    getAllServicePages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: u("/"),                   lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: u("/services"),           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools"),              lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools/email-audit"),  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: u("/blog"),               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: u("/about"),              lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: u("/contact"),            lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: u(`/services/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const seoEntries: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: u(`/${p.slug}`),
    lastModified: now,
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
