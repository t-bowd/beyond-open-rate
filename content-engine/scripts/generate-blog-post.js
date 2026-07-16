#!/usr/bin/env node
/**
 * generate-blog-post.js
 * Picks the next queued blog topic, calls the Anthropic API for a full
 * MDX blog post, writes it to content/blog/, and opens a GitHub PR for review.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *   GITHUB_TOKEN
 *   GITHUB_REPOSITORY  (auto-set by GitHub Actions, e.g. "owner/repo")
 */

import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.resolve(ROOT, "..");

// ── Load files ────────────────────────────────────────────────────────────────

const topicsPath = path.join(ROOT, "topics.json");
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8"));

const systemPrompt = fs.readFileSync(
  path.join(ROOT, "prompts", "blog-system-prompt.txt"),
  "utf8"
);

const briefTemplate = fs.readFileSync(
  path.join(ROOT, "prompts", "blog-brief-template.md"),
  "utf8"
);

// ── Pick next blog topic ──────────────────────────────────────────────────────

const topic = topics.topics.find(
  (t) => t.status === "queued" && t.type === "blog"
);

if (!topic) {
  console.log("No queued blog topics — nothing to do. Add blog topics to topics.json.");
  process.exit(0);
}

console.log(`Generating blog post for topic ${topic.id}: "${topic.topic}"`);

const primaryKeyword = Array.isArray(topic.target_keywords)
  ? topic.target_keywords[0]
  : topic.topic;

// ── Build user prompt ─────────────────────────────────────────────────────────

const userPrompt = briefTemplate
  .replace("[topic]", topic.topic)
  .replace("[target_keywords]", Array.isArray(topic.target_keywords)
    ? topic.target_keywords.join(", ")
    : topic.topic)
  .replace("[primary_keyword]", primaryKeyword)
  .replace("[seed_claim]", topic.seed_claim)
  .replace("[audience_angle]", topic.audience_angle)
  .replace("[format]", topic.format || "guide")
  .replace("[notes]", topic.notes || "None")
  .replace(/\[primary_keyword\]/g, primaryKeyword);

// ── Call Anthropic API ────────────────────────────────────────────────────────

const client = new Anthropic();

let apiResponse;
try {
  apiResponse = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 6000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
} catch (err) {
  console.error("Anthropic API call failed:", err.message);
  process.exit(1);
}

const rawText = apiResponse.content.find((b) => b.type === "text")?.text;
if (!rawText) {
  console.error("No text block in API response:", JSON.stringify(apiResponse.content));
  process.exit(1);
}
console.log("API response received.");

// ── Parse response ────────────────────────────────────────────────────────────

const metaStart = rawText.indexOf("---METADATA---");
const metaEnd = rawText.indexOf("---END METADATA---");

if (metaStart === -1 || metaEnd === -1) {
  console.error("Metadata block not found in API response. Raw output:");
  console.error(rawText);
  process.exit(1);
}

const postBody = rawText.slice(0, metaStart).trim();
const metaBlock = rawText.slice(metaStart + "---METADATA---".length, metaEnd).trim();

function parseMeta(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function parseFaqs(block) {
  const faqs = [];
  for (let i = 1; i <= 6; i++) {
    const q = parseMeta(block, `FAQ_${i}_Q`);
    const a = parseMeta(block, `FAQ_${i}_A`);
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

const title = parseMeta(metaBlock, "TITLE");
const description = parseMeta(metaBlock, "DESCRIPTION");
const tagsRaw = parseMeta(metaBlock, "TAGS");
const author = parseMeta(metaBlock, "AUTHOR") || "Tim";
const faqs = parseFaqs(metaBlock);

if (!title || !description) {
  console.error("Missing required metadata (TITLE or DESCRIPTION). Block:");
  console.error(metaBlock);
  process.exit(1);
}

const tags = tagsRaw
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

// ── Build slug and date ───────────────────────────────────────────────────────

const today = new Date().toISOString().split("T")[0];
const slug = topic.topic
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .slice(0, 60)
  .replace(/-+$/, "");

const fileName = `${slug}.mdx`;
const blogPath = path.join(SITE_ROOT, "content", "blog", fileName);

// ── Build MDX frontmatter ─────────────────────────────────────────────────────

const faqYaml = faqs
  .map((f) => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`)
  .join("\n");

const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
publishedAt: "${today}"
author: "${author}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
faq:
${faqYaml}
---

${postBody}
`;

fs.writeFileSync(blogPath, mdxContent, "utf8");
console.log(`Blog post written to ${blogPath}`);

// ── Mark topic as in_review ───────────────────────────────────────────────────

topic.status = "in_review";
fs.writeFileSync(topicsPath, JSON.stringify(topics, null, 2) + "\n", "utf8");

// ── Open GitHub PR ────────────────────────────────────────────────────────────

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");

if (!owner || !repo) {
  console.log("GITHUB_REPOSITORY not set — skipping PR creation.");
  process.exit(0);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { data: refData } = await octokit.git.getRef({
  owner,
  repo,
  ref: "heads/main",
});
const baseSha = refData.object.sha;

const branchName = `blog/${today}-${slug.slice(0, 40)}`;
await octokit.git.createRef({
  owner,
  repo,
  ref: `refs/heads/${branchName}`,
  sha: baseSha,
});

const { data: topicsFile } = await octokit.repos.getContent({
  owner,
  repo,
  path: "content-engine/topics.json",
});

await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: `content/blog/${fileName}`,
  message: `content: add blog draft — ${topic.topic}`,
  content: Buffer.from(mdxContent).toString("base64"),
  branch: branchName,
});

await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: "content-engine/topics.json",
  message: `blog: mark topic ${topic.id} as in_review`,
  content: Buffer.from(JSON.stringify(topics, null, 2) + "\n").toString("base64"),
  sha: topicsFile.sha,
  branch: branchName,
});

const { data: pr } = await octokit.pulls.create({
  owner,
  repo,
  title: `[Blog] ${topic.topic} — ${today}`,
  head: branchName,
  base: "main",
  body: `## Blog post draft — review before merging

**Topic:** ${topic.topic}
**File:** \`content/blog/${fileName}\`
**Primary keyword:** ${primaryKeyword}

---

### Tim — review checklist
- [ ] Read through for accuracy and voice — edit the file directly if anything needs changing
- [ ] Merge to publish

---

### Post preview (first 500 chars)

\`\`\`
${postBody.slice(0, 500)}...
\`\`\`
`,
});

await octokit.issues.addAssignees({
  owner,
  repo,
  issue_number: pr.number,
  assignees: [owner],
});

console.log(`PR opened: ${pr.html_url}`);
