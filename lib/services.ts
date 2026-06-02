import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const SERVICES_DIR = join(process.cwd(), "content", "services");

export type ServiceFaq = { q: string; a: string };

export type ServiceFrontmatter = {
  title: string;
  h1: string;
  heroSub: string;
  description: string;
  faq?: ServiceFaq[];
};

export type ServicePage = ServiceFrontmatter & {
  slug: string;
  content: string;
};

function parse(raw: string): ServiceFrontmatter {
  const { data } = matter(raw);
  if (!data.title) throw new Error("service page missing `title`");
  if (!data.h1) throw new Error("service page missing `h1`");
  if (!data.description) throw new Error("service page missing `description`");
  return data as ServiceFrontmatter;
}

export async function getAllServicePages(): Promise<ServicePage[]> {
  let entries: string[];
  try {
    entries = await readdir(SERVICES_DIR);
  } catch {
    return [];
  }
  return Promise.all(
    entries.filter((f) => f.endsWith(".mdx")).map(async (file) => {
      const raw = await readFile(join(SERVICES_DIR, file), "utf8");
      const fm = parse(raw);
      const { content } = matter(raw);
      return { ...fm, content, slug: file.replace(/\.mdx$/, "") };
    }),
  );
}

export async function getServicePage(slug: string): Promise<ServicePage | null> {
  try {
    const raw = await readFile(join(SERVICES_DIR, `${slug}.mdx`), "utf8");
    const fm = parse(raw);
    const { content } = matter(raw);
    return { ...fm, content, slug };
  } catch {
    return null;
  }
}
