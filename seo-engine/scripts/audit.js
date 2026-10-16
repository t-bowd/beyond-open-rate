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

import { seoSystemPrompt, buildSeoUserPrompt } from "./seo-page-prompt.js";
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

const systemPrompt = `You are an SEO strategist for Beyond Marketing, a boutique full-funnel digital marketing agency in Australia (paid social, organic social, SEO and AI search visibility, landing pages, email and lifecycle). They work with two equal audiences: e-commerce brands and service businesses (professional services, SaaS, agencies, B2B). Never write for ecommerce only. Never use revenue ranges.

Their goal: rank on Google and get cited by AI tools (ChatGPT, Perplexity, Gemini) when business owners search for marketing help. Content should be authoritative, specific, and connect marketing directly to revenue. Never generic. Never invent statistics. The site was originally email-only and most existing search data is still email queries; flag where the data shows demand for the other services.`;

const analysisPrompt = `Here are Beyond Marketing's top 20 GSC opportunities this week, scored 0–100:

${top20.map((r, i) => `${i + 1}. "${r.query}" — score ${r.score} | pos ${r.position} | ${r.impressions} impressions | ${r.ctr}% CTR | ${r.clicks} clicks`).join("\n")}

Do three things:

## DIGEST
2–3 paragraphs, plain English. What's the overall picture? What's working, what's leaking? What should Tim focus on this week?

## TOP 5 OPPORTUNITIES
For each of the top 5, one sentence: why it's an opportunity and what action it needs (write new content / optimise existing page / fix meta title & description).

## PRIORITY CONTENT BRIEF
Pick the single highest-leverage opportunity and write a full brief for a blog post that would help Beyond Marketing rank for it AND get cited in AI answers. Include:
- Target query
- Working title
- What the post needs to cover (5–8 specific bullet points)
- Word count target
- Angle that makes it distinctly Beyond Marketing — not advice any agency could write
- One specific, real, widely published fact to lead with (never invent a statistic)`;

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

// Skip queries that aren't page-worthy (navigational, pricing-comparison, email-platform names, etc.)
const SKIP_TERMS = ["office", "login", "careers", "jobs", "support", "contact", "price", "pricing", "review", "vs ",
  "klaviyo", "mailchimp", "activecampaign", "hubspot", "omnisend", "brevo"];

function isPageWorthy(query) {
  const q = query.toLowerCase();
  return !SKIP_TERMS.some((term) => q.includes(term));
}

async function branchExists(name) {
  try {
    await octokit.git.getRef({ owner, repo, ref: `heads/${name}` });
    return true;
  } catch {
    return false;
  }
}

// Top-scored opportunity with no page and no page branch already in flight
let topGap = null;
for (const r of scored) {
  if (!isPageWorthy(r.query)) continue;
  const slug = queryToSlug(r.query);
  if (fs.existsSync(path.join(CONTENT_SEO_DIR, `${slug}.mdx`))) continue;
  if (await branchExists(`seo/page-${slug}`)) continue;
  topGap = r;
  break;
}

if (!topGap) {
  console.log("No content gap found this week — all top opportunities already have pages.");
  process.exit(0);
}

console.log(`\nTop content gap: "${topGap.query}" (score ${topGap.score}, pos ${topGap.position})`);
console.log("Generating page...");

const seoUserPrompt = buildSeoUserPrompt(
  topGap.query,
  `\nGSC context: this query has ${topGap.impressions} impressions over 90 days at position ${topGap.position} with ${topGap.clicks} clicks. There is no existing page targeting it.\n`,
);

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
