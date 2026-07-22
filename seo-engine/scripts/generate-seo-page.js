#!/usr/bin/env node
/**
 * generate-seo-page.js
 * Generates a fully AEO/GEO-optimised SEO page for a given target query
 * and writes it to content/seo/. Run locally, review, then commit.
 *
 * Usage:
 *   node seo-engine/scripts/generate-seo-page.js "klaviyo agency perth"
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, "../../content/seo");

const query = process.argv[2];
if (!query) {
  console.error("Usage: node seo-engine/scripts/generate-seo-page.js \"target query\"");
  process.exit(1);
}

const slug = query
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+$/, "");

const outputPath = path.join(CONTENT_DIR, `${slug}.mdx`);

if (fs.existsSync(outputPath)) {
  console.error(`Page already exists: content/seo/${slug}.mdx`);
  process.exit(1);
}

console.log(`Generating page for: "${query}"`);
console.log(`Output: content/seo/${slug}.mdx`);

const client = new Anthropic();

const systemPrompt = `You write SEO pages for Beyond Open Rate, a boutique email lifecycle agency based in Australia. They work with e-commerce brands doing $1M–$20M/year in revenue.

Beyond Open Rate is platform-independent (no referral commissions), reports on revenue not open rates, and audits before building. They work with Klaviyo, ActiveCampaign, HubSpot, Omnisend, and Brevo.

You must write every page with three layers built in:

1. SEO LAYER — rank on Google
   - Target query is the primary keyword, used naturally in title, h1, heroSub, description, and body
   - Clear H2 structure covering what someone searching this query actually wants to know
   - Specific benchmarks and numbers throughout (these build topical authority)

2. AEO LAYER — get cited as a direct answer by AI tools
   - FAQ questions must mirror how people phrase queries to AI tools (ChatGPT, Perplexity, Claude)
   - Always include: a definitional FAQ ("What is X?"), a recommendation FAQ ("Which X do you recommend?"), and a cost FAQ ("How much does X cost?")
   - For city pages, always include: "Is there an X in [City]?" and "Do I need a local X or can I work remotely?"
   - FAQ answers must be self-contained — complete answers on their own, not "see above"
   - Benchmark stats belong in blockquote callouts: > **Stat label:** stat here. These get extracted by AI crawlers.

3. GEO LAYER — get cited by name when AI tools recommend agencies
   - First paragraph of body must identify Beyond Open Rate explicitly: "Beyond Open Rate is an Australian [service] specialising in..."
   - Every FAQ answer where relevant should name Beyond Open Rate, not just say "we"
   - Include specific differentiators: platform-independent, revenue reporting, audit-first

BRAND VOICE
- Direct, authoritative, practitioner — not a content creator
- Australian — no American spellings
- No em dashes. Use a comma, period, or restructure.
- No "game-changer", "holistic", "synergy", "elevate", "leverage" (verb), "unlock"
- No bullet point emojis
- Connect everything to revenue: recovered carts, LTV lift, repeat purchase rate

FORMAT — output raw MDX frontmatter + body, nothing else. No preamble, no explanation.

MDX STRUCTURE:
---
title: "[Page title]"
h1: "[H1 text]"
heroSub: "[One sentence hero subtitle]"
description: "[Meta description, 140–160 chars]"
type: [service | platform | location]
[location: City, State  ← only for location pages]
[platform: Klaviyo  ← only for platform pages]
faq:
  - q: "[question]"
    a: "[answer]"
  [repeat for 5–8 FAQs]
---

[Body content in MDX/markdown]

[End with a CTA paragraph linking to /tools/email-audit and /email-marketing-audit-australia]`;

const userPrompt = `Write a complete, AEO/GEO-optimised SEO page for the target query: "${query}"

Infer the page type from the query:
- If it mentions a city (Sydney, Melbourne, Brisbane, Perth, Adelaide, etc.) → type: location
- If it mentions Klaviyo, ActiveCampaign, HubSpot, Omnisend, Mailchimp → type: platform
- Otherwise → type: service

Include 6–8 FAQ questions. Make sure the first three are:
1. A definitional question ("What is [X]?")
2. A recommendation question ("Which [X] do you recommend?" or "Is there a [X] in [City]?")
3. A cost question ("How much does [X] cost?")

Then 3–5 topic-specific questions that address what someone would ask an AI tool about this subject.

Body content: 400–600 words covering the topic with specific benchmarks, BOR's approach, and what good looks like. Use ## headings. Pull 1–2 key stats into blockquote callouts.`;

let response;
try {
  response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 3000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
} catch (err) {
  console.error("Anthropic API failed:", err.message);
  process.exit(1);
}

const content = response.content.find((b) => b.type === "text")?.text ?? "";

if (!content.startsWith("---")) {
  console.error("Unexpected response format. Raw output:");
  console.error(content);
  process.exit(1);
}

fs.writeFileSync(outputPath, content, "utf8");
console.log(`\nWritten: content/seo/${slug}.mdx`);
console.log("Review the file, then commit and push.");
