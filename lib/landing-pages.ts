import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const LANDING_DIR = join(process.cwd(), "content", "landing");

export type PageHeroBlock = {
  _template: "pageHero";
  label?: string;
  titlePre: string;
  titleHighlight: string;
  titlePost?: string;
  sub?: string;
  ctaText?: string;
  ctaHref?: string;
};

export type TextSectionBlock = {
  _template: "textSection";
  heading?: string;
  paragraphs: string[];
};

export type GuaranteeBandBlock = { _template: "guaranteeBand" };
export type SplitOfferBlock = { _template: "splitOffer" };
export type FinalCtaBlock = { _template: "finalCta" };
export type TestimonialsBlock = { _template: "testimonials" };

export type BenefitsListBlock = {
  _template: "benefitsList";
  heading: string;
  items: string[];
  ctaText?: string;
  ctaHref?: string;
};

export type FaqSectionBlock = {
  _template: "faqSection";
  heading?: string;
  questions: { q: string; a: string }[];
};

export type Block =
  | PageHeroBlock
  | TextSectionBlock
  | GuaranteeBandBlock
  | BenefitsListBlock
  | SplitOfferBlock
  | FinalCtaBlock
  | FaqSectionBlock
  | TestimonialsBlock;

export type LandingPage = {
  slug: string;
  title: string;
  description?: string;
  blocks: Block[];
};

export async function getAllLandingPages(): Promise<{ slug: string }[]> {
  let entries: string[];
  try {
    entries = await readdir(LANDING_DIR);
  } catch {
    return [];
  }
  return entries
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(".json", "") }));
}

export async function getLandingPage(slug: string): Promise<LandingPage | null> {
  try {
    const raw = await readFile(join(LANDING_DIR, `${slug}.json`), "utf8");
    const data = JSON.parse(raw);
    return { slug, ...data };
  } catch {
    return null;
  }
}
