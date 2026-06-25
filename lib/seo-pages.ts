import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const SEO_DIR = join(process.cwd(), "content", "seo");

export type SeoPageFaq = { q: string; a: string };
export type SeoPageType = "platform" | "service" | "location";

export type SeoPageFrontmatter = {
  title: string;
  h1: string;
  heroSub: string;
  description: string;
  type: SeoPageType;
  location?: string;
  platform?: string;
  faq?: SeoPageFaq[];
};

export type SeoPage = SeoPageFrontmatter & {
  slug: string;
  content: string;
};

function parse(raw: string): SeoPageFrontmatter {
  const { data } = matter(raw);
  if (!data.title) throw new Error("seo page missing `title`");
  if (!data.h1) throw new Error("seo page missing `h1`");
  if (!data.description) throw new Error("seo page missing `description`");
  return data as SeoPageFrontmatter;
}

export async function getAllSeoPages(): Promise<SeoPage[]> {
  let entries: string[];
  try {
    entries = await readdir(SEO_DIR);
  } catch {
    return [];
  }
  return Promise.all(
    entries.filter((f) => f.endsWith(".mdx")).map(async (file) => {
      const raw = await readFile(join(SEO_DIR, file), "utf8");
      const fm = parse(raw);
      const { content } = matter(raw);
      return { ...fm, content, slug: file.replace(/\.mdx$/, "") };
    }),
  );
}

export async function getSeoPage(slug: string): Promise<SeoPage | null> {
  try {
    const raw = await readFile(join(SEO_DIR, `${slug}.mdx`), "utf8");
    const fm = parse(raw);
    const { content } = matter(raw);
    return { ...fm, content, slug };
  } catch {
    return null;
  }
}
