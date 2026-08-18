import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllSeoPages } from "@/lib/seo-pages";

const u = (path: string) => `${site.url}${path}`;

// Real per-file last-edit date from git history, NOT `new Date()`.
// `new Date()` reflects "when this build ran", which fires on every
// deploy even when a given page's content didn't change, so every page
// would falsely report "updated today". Reading the actual last commit
// date per file keeps the signal meaningful without manual upkeep.
function lastModified(relativePath: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${relativePath}"`, {
      cwd: process.cwd(),
      encoding: "utf8",
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // git not available (e.g. some build environments), fall through
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, seoPages] = await Promise.all([
    getAllPosts(),
    getAllSeoPages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: u("/"),                   lastModified: lastModified("app/page.tsx"),                  changeFrequency: "weekly",  priority: 1.0 },
    { url: u("/services"),           lastModified: lastModified("app/services/page.tsx"),         changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools"),              lastModified: lastModified("app/tools/page.tsx"),            changeFrequency: "monthly", priority: 0.8 },
    { url: u("/tools/email-audit"),  lastModified: lastModified("app/tools/email-audit/page.tsx"), changeFrequency: "monthly", priority: 0.9 },
    { url: u("/blog"),               lastModified: lastModified("app/blog/page.tsx"),             changeFrequency: "weekly",  priority: 0.7 },
    { url: u("/about"),              lastModified: lastModified("app/about/page.tsx"),            changeFrequency: "monthly", priority: 0.5 },
    { url: u("/strategy-session"),  lastModified: lastModified("app/strategy-session/page.tsx"), changeFrequency: "monthly", priority: 0.9 },
    { url: u("/retainer"),          lastModified: lastModified("app/retainer/page.tsx"),          changeFrequency: "monthly", priority: 0.8 },
    { url: u("/audit"),             lastModified: lastModified("app/audit/page.tsx"),             changeFrequency: "monthly", priority: 0.8 },
    { url: u("/foundations"),       lastModified: lastModified("app/foundations/page.tsx"),       changeFrequency: "monthly", priority: 0.8 },
    { url: u("/strategy"),          lastModified: lastModified("app/strategy/page.tsx"),          changeFrequency: "monthly", priority: 0.8 },
    { url: u("/ai-information"),   lastModified: lastModified("app/ai-information/page.tsx"),    changeFrequency: "monthly", priority: 0.5 },
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
