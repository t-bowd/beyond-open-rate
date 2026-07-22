#!/usr/bin/env node
/**
 * audit.js
 * Weekly SEO audit. Pulls GSC data, scores opportunities, generates content
 * briefs via Claude, and opens a GitHub PR with the report.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *   ANTHROPIC_API_KEY
 *   GITHUB_TOKEN
 *   GITHUB_REPOSITORY
 */

import { google } from "googleapis";
import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "sc-domain:beyondopenrate.com.au";
const DAYS = 90;

// ── Auth ──────────────────────────────────────────────────────────────────────

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const searchconsole = google.searchconsole({ version: "v1", auth });

// ── Pull GSC data ─────────────────────────────────────────────────────────────

const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - DAYS);

const fmt = (d) => d.toISOString().split("T")[0];

console.log(`Pulling GSC data (${fmt(startDate)} → ${fmt(endDate)})...`);

const { data: gscData } = await searchconsole.searchanalytics.query({
  siteUrl: SITE_URL,
  requestBody: {
    startDate: fmt(startDate),
    endDate: fmt(endDate),
    dimensions: ["query"],
    rowLimit: 1000,
    dataState: "final",
  },
});

const rows = gscData.rows || [];
console.log(`${rows.length} queries from GSC.`);

if (rows.length === 0) {
  console.log("No data returned. Check GSC property access.");
  process.exit(1);
}

// ── Score opportunities ───────────────────────────────────────────────────────

function scoreOpportunity({ clicks, impressions, ctr, position }) {
  let score = 0;

  // Demand: how many people are searching this
  if (impressions >= 500) score += 30;
  else if (impressions >= 100) score += 22;
  else if (impressions >= 50) score += 14;
  else if (impressions >= 20) score += 8;
  else score += 3;

  // Rank opportunity: page 2 → page 1 flip is highest value
  if (position > 10 && position <= 20) score += 30;
  else if (position > 5 && position <= 10) score += 22;
  else if (position > 20 && position <= 30) score += 14;
  else if (position > 30) score += 6;
  else score += 8; // already top 5

  // CTR opportunity: ranking but barely getting clicked
  if (position <= 15 && ctr < 0.03 && impressions >= 20) score += 20;

  // Content gap: getting shown but zero clicks
  if (clicks === 0 && impressions >= 20) score += 10;

  return Math.min(Math.round(score), 100);
}

const scored = rows
  .map((row) => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: Math.round(row.ctr * 1000) / 10,
    position: Math.round(row.position * 10) / 10,
    score: scoreOpportunity(row),
  }))
  .sort((a, b) => b.score - a.score);

// ── Save opportunities.json ───────────────────────────────────────────────────

const dataDir = path.join(ROOT, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const today = fmt(new Date());

const opportunitiesData = {
  generated_at: new Date().toISOString(),
  period: { start: fmt(startDate), end: fmt(endDate) },
  total_queries: rows.length,
  opportunities: scored,
};

const opportunitiesPath = path.join(dataDir, "opportunities.json");
fs.writeFileSync(opportunitiesPath, JSON.stringify(opportunitiesData, null, 2) + "\n", "utf8");
console.log(`Saved ${scored.length} scored opportunities.`);

// ── Analyse with Claude ───────────────────────────────────────────────────────

const top20 = scored.slice(0, 20);
const top = scored[0];

const client = new Anthropic();

const systemPrompt = `You are an SEO strategist for Beyond Open Rate, a boutique email lifecycle agency in Australia. They work with e-commerce brands doing $1M–$20M/year in revenue.

Their goal: rank on Google and get cited by AI tools (ChatGPT, Perplexity, Claude) when founders search for email agency help. Content should be authoritative, specific, and connect email directly to revenue — recovered carts, LTV lift, repeat purchase rate. Never generic.`;

const analysisPrompt = `Here are Beyond Open Rate's top 20 GSC opportunities this week, scored 0–100:

${top20.map((r, i) => `${i + 1}. "${r.query}" — score ${r.score} | pos ${r.position} | ${r.impressions} impressions | ${r.ctr}% CTR | ${r.clicks} clicks`).join("\n")}

Do three things:

## DIGEST
2–3 paragraphs, plain English. What's the overall picture? What's working, what's leaking? What should Tim focus on this week?

## TOP 5 OPPORTUNITIES
For each of the top 5, one sentence: why it's an opportunity and what action it needs (write new content / optimise existing page / fix meta title & description).

## PRIORITY CONTENT BRIEF
Pick the single highest-leverage opportunity and write a full brief for a blog post that would help BOR rank for it AND get cited in AI answers. Include:
- Target query
- Working title
- What the post needs to cover (5–8 specific bullet points)
- Word count target
- Angle that makes it distinctly BOR — not advice any agency could write
- One specific stat or claim they should lead with`;

let analysis;
try {
  const response = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: analysisPrompt }],
  });
  analysis = response.content.find((b) => b.type === "text")?.text ?? "";
  console.log("Claude analysis done.");
} catch (err) {
  console.error("Anthropic API failed:", err.message);
  analysis = "_Analysis unavailable this week._";
}

// ── Build report ──────────────────────────────────────────────────────────────

const report = `# SEO Audit — ${today}

**Period:** ${fmt(startDate)} → ${fmt(endDate)}
**Queries tracked:** ${rows.length}
**Top opportunity:** "${top.query}" (score ${top.score}, position ${top.position})

---

${analysis}

---

## Full opportunity list (top 20)

| # | Query | Score | Position | Impressions | CTR | Clicks |
|---|-------|-------|----------|-------------|-----|--------|
${top20.map((r, i) => `| ${i + 1} | ${r.query} | ${r.score} | ${r.position} | ${r.impressions} | ${r.ctr}% | ${r.clicks} |`).join("\n")}
`;

const reportsDir = path.join(ROOT, "reports");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

const reportPath = path.join(reportsDir, `${today}.md`);
fs.writeFileSync(reportPath, report, "utf8");
console.log(`Report written: reports/${today}.md`);

// ── Open GitHub PR ────────────────────────────────────────────────────────────

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");

if (!owner || !repo) {
  console.log("GITHUB_REPOSITORY not set — skipping PR.");
  process.exit(0);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { data: refData } = await octokit.git.getRef({ owner, repo, ref: "heads/main" });
const baseSha = refData.object.sha;

const branchName = `seo/audit-${today}`;

await octokit.git.createRef({
  owner, repo,
  ref: `refs/heads/${branchName}`,
  sha: baseSha,
});

// Commit report
await octokit.repos.createOrUpdateFileContents({
  owner, repo,
  path: `seo-engine/reports/${today}.md`,
  message: `seo: weekly audit ${today}`,
  content: Buffer.from(report).toString("base64"),
  branch: branchName,
});

// Commit opportunities.json (update if it already exists on main)
const { data: existingOpp } = await octokit.repos.getContent({
  owner, repo,
  path: "seo-engine/data/opportunities.json",
}).catch(() => ({ data: null }));

await octokit.repos.createOrUpdateFileContents({
  owner, repo,
  path: "seo-engine/data/opportunities.json",
  message: `seo: update opportunities ${today}`,
  content: Buffer.from(JSON.stringify(opportunitiesData, null, 2) + "\n").toString("base64"),
  branch: branchName,
  ...(existingOpp?.sha ? { sha: existingOpp.sha } : {}),
});

const { data: pr } = await octokit.pulls.create({
  owner, repo,
  title: `[SEO] Weekly audit — ${today}`,
  head: branchName,
  base: "main",
  body: `## Weekly SEO audit — ${today}

**Top opportunity:** "${top.query}" — score ${top.score}, position ${top.position}

---

${analysis.slice(0, 800)}

---

Full report: \`seo-engine/reports/${today}.md\``,
});

await octokit.issues.addAssignees({
  owner, repo,
  issue_number: pr.number,
  assignees: [owner],
});

console.log(`Audit PR opened: ${pr.html_url}`);

// ── Auto-generate page for the top content gap ────────────────────────────────

const CONTENT_SEO_DIR = path.resolve(__dirname, "../../content/seo");

function queryToSlug(q) {
  return q.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+$/, "");
}

// Skip queries that aren't page-worthy (Klaviyo's own office, navigational, etc.)
const SKIP_TERMS = ["office", "login", "careers", "jobs", "support", "contact", "price", "pricing", "review", "vs "];

function isPageWorthy(query) {
  const q = query.toLowerCase();
  return !SKIP_TERMS.some((term) => q.includes(term));
}

// Find the top-scored opportunity where no page exists yet
const topGap = scored.find((r) => {
  if (!isPageWorthy(r.query)) return false;
  const slug = queryToSlug(r.query);
  return !fs.existsSync(path.join(CONTENT_SEO_DIR, `${slug}.mdx`));
});

if (!topGap) {
  console.log("No content gap found this week — all top opportunities already have pages.");
  process.exit(0);
}

console.log(`\nTop content gap: "${topGap.query}" (score ${topGap.score}, pos ${topGap.position})`);
console.log("Generating page...");

const seoSystemPrompt = `You write SEO pages for Beyond Open Rate, a boutique email lifecycle agency based in Australia. They work with e-commerce brands doing $1M–$20M/year in revenue.

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
  [repeat for 6–8 FAQs]
---

[Body content in MDX/markdown]

[End with a CTA paragraph linking to /tools/email-audit and /email-marketing-audit-australia]`;

const seoUserPrompt = `Write a complete, AEO/GEO-optimised SEO page for the target query: "${topGap.query}"

GSC context: this query has ${topGap.impressions} impressions over 90 days at position ${topGap.position} with ${topGap.clicks} clicks. There is no existing page targeting it.

Infer the page type from the query:
- If it mentions a city (Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast, etc.) → type: location
- If it mentions Klaviyo, ActiveCampaign, HubSpot, Omnisend, Mailchimp → type: platform
- Otherwise → type: service

Include 6–8 FAQ questions. The first three must be:
1. A definitional question ("What is [X]?")
2. A recommendation question ("Which [X] do you recommend?" or "Is there a [X] in [City]?")
3. A cost question ("How much does [X] cost?")

Then 3–5 topic-specific questions that address what someone would ask an AI tool.

Body: 400–600 words. Use ## headings. Pull 1–2 key stats into blockquote callouts.`;

let pageContent;
try {
  const pageResponse = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 3000,
    system: seoSystemPrompt,
    messages: [{ role: "user", content: seoUserPrompt }],
  });
  pageContent = pageResponse.content.find((b) => b.type === "text")?.text ?? "";
  console.log("Page content generated.");
} catch (err) {
  console.error("Page generation failed:", err.message);
  process.exit(0); // non-fatal — audit PR already opened
}

if (!pageContent.startsWith("---")) {
  console.error("Unexpected page format — skipping page PR.");
  process.exit(0);
}

const pageSlug = queryToSlug(topGap.query);
const pageBranch = `seo/page-${pageSlug}`;

await octokit.git.createRef({ owner, repo, ref: `refs/heads/${pageBranch}`, sha: refData.object.sha });

await octokit.repos.createOrUpdateFileContents({
  owner, repo,
  path: `content/seo/${pageSlug}.mdx`,
  message: `seo: add page for "${topGap.query}"`,
  content: Buffer.from(pageContent).toString("base64"),
  branch: pageBranch,
});

const { data: pagePr } = await octokit.pulls.create({
  owner, repo,
  title: `[SEO] ${topGap.query}`,
  head: pageBranch,
  base: "main",
  body: `## New SEO page: ${topGap.query}

**URL:** \`/${pageSlug}\`
**GSC:** ${topGap.impressions} impressions — position ${topGap.position} — score ${topGap.score}

Auto-generated from this week's audit. Review before merging.

### Checklist
- [ ] Read through the copy — edit anything that needs adjusting
- [ ] Check the FAQs cover the right questions
- [ ] Merge to publish`,
});

await octokit.issues.addAssignees({ owner, repo, issue_number: pagePr.number, assignees: [owner] });

console.log(`Page PR opened: ${pagePr.html_url}`);
