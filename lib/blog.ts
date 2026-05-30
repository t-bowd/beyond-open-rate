import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = join(process.cwd(), "content", "blog");

export type Faq = { q: string; a: string };

export type PostFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  faq?: Faq[];
  draft?: boolean;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
};

function parseFrontmatter(raw: string): PostFrontmatter {
  const { data } = matter(raw);
  if (!data.title) throw new Error("post missing required `title` frontmatter");
  if (!data.description) throw new Error("post missing required `description` frontmatter");
  if (!data.publishedAt) throw new Error("post missing required `publishedAt` frontmatter");
  return data as PostFrontmatter;
}

export async function getAllPosts(): Promise<Post[]> {
  let entries: string[];
  try {
    entries = await readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const fm = parseFrontmatter(raw);
      return { ...fm, content, slug: file.replace(/\.mdx$/, ""), ...(data as object) } as Post;
    }),
  );
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const raw = await readFile(join(POSTS_DIR, `${slug}.mdx`), "utf8");
    const fm = parseFrontmatter(raw);
    const { content } = matter(raw);
    return { ...fm, content, slug };
  } catch {
    return null;
  }
}
