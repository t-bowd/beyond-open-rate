import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllSeoPages } from "@/lib/seo-pages";

const u = (path: string) => `${site.url}${path}`;

// Per-file last-edit date. Tries git log first (accurate commit date),
// falls back to fs.statSync mtime (accurate file date, works on Vercel
// where git history is unavailable), then finally the build time.
// Never returns new Date() for every file — that makes Google ignore lastmod.
function lastModified(relativePath: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${relativePath}"`, {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // git not available in this build environment
  }
  try {
    return statSync(join(process.cwd(), relativePath)).mtime;
  } catch {
    // file not found
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, seoPages] = await Promise.all([
    getAllPosts(),
    getAllSeoPages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: u("/"),                    lastModified: lastModified("app/page.tsx"),                        changeFrequency: "weekly",  priority: 1.0 },
    { url: u("/email-lifecycle"),     lastModified: lastModified("app/email-lifecycle/page.tsx"),        changeFrequency: "monthly", priority: 0.9 },
    { url: u("/paid-social"),         lastModified: lastModified("app/paid-social/page.tsx"),            changeFrequency: "monthly", priority: 0.9 },
    { url: u("/organic-social"),      lastModified: lastModified("app/organic-social/page.tsx"),         changeFrequency: "monthly", priority: 0.9 },
    { url: u("/seo"),                 lastModified: lastModified("app/seo/page.tsx"),                    changeFrequency: "monthly", priority: 0.9 },
    { url: u("/landing-pages"),       lastModified: lastModified("app/landing-pages/page.tsx"),          changeFrequency: "monthly", priority: 0.9 },
    { url: u("/services"),            lastModified: lastModified("app/services/page.tsx"),               changeFrequency: "monthly", priority: 0.6 },
    { url: u("/tools"),               lastModified: lastModified("app/tools/page.tsx"),                  changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools/email-audit"),   lastModified: lastModified("app/tools/email-audit/page.tsx"),      changeFrequency: "monthly", priority: 0.9 },
    { url: u("/blog"),                lastModified: lastModified("app/blog/page.tsx"),                   changeFrequency: "weekly",  priority: 0.7 },
    { url: u("/about"),               lastModified: lastModified("app/about/page.tsx"),                  changeFrequency: "monthly", priority: 0.5 },
    { url: u("/strategy-session"),    lastModified: lastModified("app/strategy-session/page.tsx"),       changeFrequency: "monthly", priority: 0.9 },
    { url: u("/retainer"),            lastModified: lastModified("app/retainer/page.tsx"),               changeFrequency: "monthly", priority: 0.8 },
    { url: u("/audit"),               lastModified: lastModified("app/audit/page.tsx"),                  changeFrequency: "monthly", priority: 0.8 },
    { url: u("/projects"),            lastModified: lastModified("app/projects/page.tsx"),               changeFrequency: "monthly", priority: 0.8 },
    { url: u("/strategy"),            lastModified: lastModified("app/strategy/page.tsx"),               changeFrequency: "monthly", priority: 0.8 },
    { url: u("/ai-information"),      lastModified: lastModified("app/ai-information/page.tsx"),         changeFrequency: "monthly", priority: 0.5 },
  ];

  const serviceEntries: MetadataRoute.Sitemap = [];

  const seoEntries: MetadataRoute.Sitemap = seoPages.map((p) => ({
    url: u(`/${p.slug}`),
    lastModified: lastModified(`content/seo/${p.slug}.mdx`),
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
