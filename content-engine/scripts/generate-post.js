#!/usr/bin/env node
/**
 * generate-post.js
 * Picks the next queued topic, calls the Anthropic API for 2 post variants,
 * writes an MDX draft file, and opens a GitHub PR for review.
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

// ── Load files ────────────────────────────────────────────────────────────────

const topicsPath = path.join(ROOT, "topics.json");
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8"));

const systemPrompt = fs.readFileSync(
  path.join(ROOT, "prompts", "system-prompt.txt"),
  "utf8"
);

const briefTemplate = fs.readFileSync(
  path.join(ROOT, "prompts", "post-brief-template.md"),
  "utf8"
);

// ── Pick next topic ───────────────────────────────────────────────────────────

const topic = topics.topics.find((t) => t.status === "queued");

if (!topic) {
  console.log("No queued topics — nothing to do. Add topics to topics.json.");
  process.exit(0);
}

console.log(`Generating post for topic ${topic.id}: "${topic.topic}"`);

// ── Build user prompt ─────────────────────────────────────────────────────────

const userPrompt = briefTemplate
  .replace("[pillar]", topic.pillar || "educational")
  .replace("[tier]", topic.tier)
  .replace("[topic]", topic.topic)
  .replace("[seed_claim]", topic.seed_claim)
  .replace("[audience_angle]", topic.audience_angle)
  .replace("[cta_style]", topic.cta_style)
  .replace("[notes]", topic.notes || "None");

// ── Call Anthropic API ────────────────────────────────────────────────────────

const client = new Anthropic();

let apiResponse;
try {
  apiResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
} catch (err) {
  console.error("Anthropic API call failed:", err.message);
  process.exit(1);
}

const rawText = apiResponse.content[0].text;
console.log("API response received.");

// ── Parse variants ────────────────────────────────────────────────────────────

function parseVariant(text, label) {
  const start = text.indexOf(`VARIANT ${label}`);
  const end =
    label === "A"
      ? text.indexOf("VARIANT B")
      : text.length;

  if (start === -1) return null;

  const block = text.slice(start, end).trim();

  const subjectMatch = block.match(/SUBJECT:\s*(.+)/);
  const hookMatch = block.match(/HOOK ANALYSIS:\s*(.+)/);
  const ctaMatch = block.match(/CTA LINE:\s*(.+)/);

  // Extract post copy — everything after the metadata lines
  const metaEnd = block.search(/\n\n(?!SUBJECT|HOOK|CTA)/);
  const postCopy = metaEnd > -1
    ? block.slice(metaEnd).trim()
    : block.replace(/VARIANT [AB]\n[\s\S]*?\n\n/, "").trim();

  return {
    subject: subjectMatch ? subjectMatch[1].trim() : "",
    hookAnalysis: hookMatch ? hookMatch[1].trim() : "",
    ctaLine: ctaMatch ? ctaMatch[1].trim() : "none",
    copy: postCopy,
  };
}

const variantA = parseVariant(rawText, "A");
const variantB = parseVariant(rawText, "B");

if (!variantA || !variantB) {
  console.error("Failed to parse variants from API response. Raw output:");
  console.error(rawText);
  process.exit(1);
}

// ── Build slug and date ───────────────────────────────────────────────────────

const today = new Date().toISOString().split("T")[0];
const slug = topic.topic
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .replace(/\s+/g, "-")
  .slice(0, 50)
  .replace(/-+$/, "");

const fileName = `${today}-${slug}.mdx`;
const draftPath = path.join(ROOT, "posts", "drafts", fileName);

// ── Write MDX file ────────────────────────────────────────────────────────────

const scheduleDefault = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 0, 0, 0);
  return d.toISOString().replace("Z", "+10:00");
})();

const mdxContent = `---
id: "${topic.id}"
date_generated: "${today}"
topic_slug: "${slug}"
tier: "${topic.tier}"
status: "draft"
approved_variant: "A"
schedule_time: "${scheduleDefault}"
platforms:
  linkedin: true
  facebook: false
facebook_variant: ""
---

## Variant A

${variantA.copy}

---

## Variant B

${variantB.copy}

---

## Generation metadata

Hook analysis A: ${variantA.hookAnalysis}
Hook analysis B: ${variantB.hookAnalysis}
CTA A: ${variantA.ctaLine}
CTA B: ${variantB.ctaLine}
`;

fs.writeFileSync(draftPath, mdxContent, "utf8");
console.log(`Draft written to ${draftPath}`);

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

// Get default branch SHA
const { data: refData } = await octokit.git.getRef({
  owner,
  repo,
  ref: "heads/main",
});
const baseSha = refData.object.sha;

// Create branch
const branchName = `linkedin/${today}-${slug}`;
await octokit.git.createRef({
  owner,
  repo,
  ref: `refs/heads/${branchName}`,
  sha: baseSha,
});

// Get current topics.json SHA for update
const { data: topicsFile } = await octokit.repos.getContent({
  owner,
  repo,
  path: "content-engine/topics.json",
});

// Create MDX draft file
await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: `content-engine/posts/drafts/${fileName}`,
  message: `linkedin: add draft — ${topic.topic}`,
  content: Buffer.from(mdxContent).toString("base64"),
  branch: branchName,
});

// Update topics.json
await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: "content-engine/topics.json",
  message: `linkedin: mark topic ${topic.id} as in_review`,
  content: Buffer.from(JSON.stringify(topics, null, 2) + "\n").toString("base64"),
  sha: topicsFile.sha,
  branch: branchName,
});

// Open PR
const { data: pr } = await octokit.pulls.create({
  owner,
  repo,
  title: `[LinkedIn] ${topic.topic} — ${today}`,
  head: branchName,
  base: "main",
  body: `## LinkedIn post draft — review before merging

**Topic:** ${topic.topic}
**Tier:** ${topic.tier}
**File:** \`content-engine/posts/drafts/${fileName}\`

---

### Variant A
> ${variantA.hookAnalysis}

${variantA.copy}

---

### Variant B
> ${variantB.hookAnalysis}

${variantB.copy}

---

### Review checklist
- [ ] Pick the better variant — set \`approved_variant: "A"\` or \`"B"\` in frontmatter (or \`"EDITED"\` if you rewrote it)
- [ ] Edit copy if needed
- [ ] Set \`schedule_time\` to desired publish time (default: tomorrow 8am AEST)
- [ ] Toggle \`facebook: true\` and add \`facebook_variant\` copy if repurposing
- [ ] Merge to publish`,
});

// pulls.create has no `assignees` field — it's silently ignored there.
// Assignees live on the underlying issue, so they need a separate call.
await octokit.issues.addAssignees({
  owner,
  repo,
  issue_number: pr.number,
  assignees: [owner, "tara-rose"],
});

console.log(`PR opened: ${pr.html_url}`);
