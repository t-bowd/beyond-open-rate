#!/usr/bin/env node
/**
 * Picks the first queued topic from content/blog-queue.json,
 * calls the Anthropic API to generate an MDX post, writes it to
 * content/blog/<id>.mdx, and updates the queue status.
 *
 * Outputs SLUG=<id> and TITLE=<title> to stdout for the GitHub
 * Actions workflow to capture and use in the branch / PR.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFile, writeFile } from "node:fs/promises";

const client = new Anthropic();

// ── 1. Pick a topic ──────────────────────────────────────────────────────────

const queuePath = "content/blog-queue.json";
const queue = JSON.parse(await readFile(queuePath, "utf8"));
const idx = queue.findIndex((t) => t.status === "queued");

if (idx === -1) {
  console.log("::notice::No queued topics found — nothing to generate.");
  process.exit(0);
}

const topic = queue[idx];
console.error(`Generating post: ${topic.title}`);

// ── 2. Build today's date ────────────────────────────────────────────────────

const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Australia/Sydney",
}); // YYYY-MM-DD

// ── 3. Call Claude ───────────────────────────────────────────────────────────

const SYSTEM = `\
You are a content writer for Beyond Open Rate, an Australian email marketing agency.
You write substantive, practitioner-level blog posts — direct, confident, no fluff.

VOICE
- Write like a senior email specialist explaining something to a smart client
- Short paragraphs (2–4 sentences). Get to the point immediately.
- No filler intros ("In today's digital landscape…"). Open with the problem or the stakes.
- Concrete numbers and examples wherever possible.
- Australian spelling: optimise, colour, programme (but "email program" is fine as a term of art)

FORMAT
You output a complete MDX file — frontmatter + body — and nothing else.
No code fences. No preamble. Start with "---".

FRONTMATTER SCHEMA (all fields required unless marked optional)
---
title: "<post title>"
description: "<one sentence, 140–160 chars, includes the primary keyword>"
publishedAt: "<YYYY-MM-DD>"
author: "Beyond Open Rate"
tags: [<array of 2–4 tag strings>]
faq:
  - q: "<question someone would actually type into Google>"
    a: "<2–4 sentence answer>"
  - q: "..."
    a: "..."
  - q: "..."
    a: "..."
---

BODY STRUCTURE
- Opening paragraph: state the problem or stakes. No preamble.
- 4–7 ## sections covering the topic substantively
- Use ### subsections where a topic genuinely warrants depth
- Use **bold** for key terms on first use
- Use bullet/numbered lists only when genuinely list-like
- 800–1,200 words of body content

INTERNAL LINKS (include at least 2 naturally)
- /tools/email-audit — "run the free email program audit", "score your setup", etc.
- /#contact — once, near the end, for readers who want help
- /blog — if referencing other posts generically

EXAMPLE OF THE RIGHT TONE
Good: "For a decade, open rate was the metric every marketer reported on. It also happened to be deeply misleading."
Bad: "Open rate is a commonly used metric. In this article, we'll explore why it may not be the best choice."`;

const USER = `\
Write a blog post for the following topic. Today's date is ${today}.

Title: ${topic.title}
Primary keyword: ${topic.keyword}
Tags: ${topic.tags.join(", ")}
Notes: ${topic.notes}

Output the complete MDX file — frontmatter then body. Nothing else.`;

const message = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 4096,
  system: [
    {
      type: "text",
      text: SYSTEM,
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: USER }],
});

let mdx = message.content[0].text.trim();

// Strip accidental code fences if the model wraps the output
mdx = mdx.replace(/^```(?:mdx)?\n?/, "").replace(/\n?```$/, "").trim();

if (!mdx.startsWith("---")) {
  console.error("ERROR: generated content doesn't start with frontmatter.");
  console.error(mdx.slice(0, 200));
  process.exit(1);
}

// ── 4. Write the post ────────────────────────────────────────────────────────

const outPath = `content/blog/${topic.id}.mdx`;
await writeFile(outPath, mdx + "\n");
console.error(`Written: ${outPath}`);

// ── 5. Mark as published in the queue ───────────────────────────────────────

queue[idx] = { ...topic, status: "published" };
await writeFile(queuePath, JSON.stringify(queue, null, 2) + "\n");

// ── 6. Output for the GitHub Actions workflow ─────────────────────────────────
// These lines are parsed by the workflow step that does:
//   echo "slug=$SLUG" >> $GITHUB_OUTPUT

console.log(`slug=${topic.id}`);
console.log(`title=${topic.title}`);
