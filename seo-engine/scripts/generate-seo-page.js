#!/usr/bin/env node
/**
 * generate-seo-page.js
 * Generates a fully AEO/GEO-optimised SEO page for a given target query.
 * When run in GitHub Actions (GITHUB_REPOSITORY set), opens a PR for review.
 * When run locally, writes the file for manual review and commit.
 *
 * Usage (local):
 *   node seo-engine/scripts/generate-seo-page.js "paid social agency perth"
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *   GITHUB_TOKEN + GITHUB_REPOSITORY  (GitHub Actions only, for PR creation)
 */

import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seoSystemPrompt, buildSeoUserPrompt } from "./seo-page-prompt.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, "../../content/seo");

const query = process.env.TARGET_QUERY || process.argv[2];
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

const systemPrompt = seoSystemPrompt;
const userPrompt = buildSeoUserPrompt(query);

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
console.log(`Written: content/seo/${slug}.mdx`);

// ── Open GitHub PR (GitHub Actions only) ─────────────────────────────────────

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");

if (!owner || !repo) {
  console.log("No GITHUB_REPOSITORY set — skipping PR. Review the file locally and commit.");
  process.exit(0);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { data: refData } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
const baseSha = refData.object.sha;

const branchName = `seo/page-${slug}`;
await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });

await octokit.repos.createOrUpdateFileContents({
  owner, repo,
  path: `content/seo/${slug}.mdx`,
  message: `seo: add page for "${query}"`,
  content: Buffer.from(content).toString("base64"),
  branch: branchName,
});

const { data: pr } = await octokit.pulls.create({
  owner, repo,
  title: `[SEO] ${query}`,
  head: branchName,
  base: "main",
  body: `## New SEO page: ${query}

**URL:** \`/${slug}\`

Review the page content in \`content/seo/${slug}.mdx\` before merging.

### Checklist
- [ ] Read through the page — edit copy if anything needs adjusting
- [ ] Check the FAQs cover the right questions for this query
- [ ] Merge to publish`,
});

await octokit.issues.addAssignees({ owner, repo, issue_number: pr.number, assignees: [owner] });

console.log(`PR opened: ${pr.html_url}`);
