import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const SERVICES_DIR = join(process.cwd(), "content", "services");

export type ServicePageFaq = { q: string; a: string };

export type ServicePageType = "platform" | "service" | "location";

export type ServicePageFrontmatter = {
  title: string;
  h1: string;
  heroSub: string;
  description: string;
  type: ServicePageType;
  location?: string;
  platform?: string;
  faq?: ServicePageFaq[];
};

export type ServicePage = ServicePageFrontmatter & {
  slug: string;
  content: string;
};

function parseFrontmatter(raw: string): ServicePageFrontmatter {
  const { data } = matter(raw);
  if (!data.title) throw new Error("service page missing `title`");
  if (!data.h1) throw new Error("service page missing `h1`");
  if (!data.description) throw new Error("service page missing `description`");
  return data as ServicePageFrontmatter;
}

export async function getAllServicePages(): Promise<ServicePage[]> {
  let entries: string[];
  try {
    entries = await readdir(SERVICES_DIR);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(SERVICES_DIR, file), "utf8");
      const fm = parseFrontmatter(raw);
      const { content } = matter(raw);
      return { ...fm, content, slug: file.replace(/\.mdx$/, "") };
    }),
  );
}

export async function getServicePage(slug: string): Promise<ServicePage | null> {
  try {
    const raw = await readFile(join(SERVICES_DIR, `${slug}.mdx`), "utf8");
    const fm = parseFrontmatter(raw);
    const { content } = matter(raw);
    return { ...fm, content, slug };
  } catch {
    return null;
  }
}
