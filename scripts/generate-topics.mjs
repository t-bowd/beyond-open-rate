#!/usr/bin/env node
/**
 * Queries Google Search Console for keyword opportunities,
 * sends them to Claude, and appends new blog topics to blog-queue.json.
 *
 * Outputs count= and titles= to stdout for the GitHub Actions workflow.
 */

import Anthropic from "@anthropic-ai/sdk";
import { google } from "googleapis";
import { readFile, writeFile } from "node:fs/promises";

// ── Auth ─────────────────────────────────────────────────────────────────────

const credentials = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
const delegatedEmail = process.env.GSC_DELEGATED_EMAIL;

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  subject: delegatedEmail,
});

const sc = google.searchconsole({ version: "v1", auth });

// ── Find the right site URL ───────────────────────────────────────────────────

const sitesRes = await sc.sites.list();
const sites = sitesRes.data.siteEntry || [];
console.error("Available sites:", sites.map((s) => s.siteUrl).join(", "));

const siteUrl =
  sites.find((s) => s.siteUrl.includes("beyondopenrate"))?.siteUrl ||
  "sc-domain:beyondopenrate.com.au";

console.error(`Using site: ${siteUrl}`);

// ── Query GSC for keyword opportunities ──────────────────────────────────────

const endDate = new Date().toISOString().split("T")[0];
const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

let rows = [];
try {
  const res = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 100,
      orderBy: [{ fieldName: "impressions", sortOrder: "DESCENDING" }],
    },
  });
  rows = res.data.rows || [];
} catch (e) {
  console.error("GSC query failed:", e.message);
  // Site may be too new — exit gracefully
  console.log("count=0");
  process.exit(0);
}

if (rows.length === 0) {
  console.error("No GSC data yet — site may be too new.");
  console.log("count=0");
  process.exit(0);
}

// Keyword opportunities: impressions but low CTR and not already in top 3
const opportunities = rows
  .filter((r) => r.impressions > 10 && r.ctr < 0.05 && r.position > 3)
  .map((r) => ({
    query: r.keys[0],
    impressions: Math.round(r.impressions),
    ctr: (r.ctr * 100).toFixed(1) + "%",
    position: r.position.toFixed(1),
  }))
  .slice(0, 40);

console.error(`Found ${opportunities.length} keyword opportunities`);

// ── Load existing queue ───────────────────────────────────────────────────────

const queuePath = "content/blog-queue.json";
const queue = JSON.parse(await readFile(queuePath, "utf8"));
const existingKeywords = queue.map((t) => t.keyword.toLowerCase());
const existingTitles = queue.map((t) => t.title.toLowerCase());

// ── Ask Claude to generate topics ────────────────────────────────────────────

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  system: [
    {
      type: "text",
      text: `You are an SEO content strategist for Beyond Open Rate, an Australian email marketing agency.
Your job is to analyse Google Search Console keyword data and generate blog post topics that:
1. Target keywords we are getting impressions for but not enough clicks (opportunity gap)
2. Match our audience: Australian e-commerce brands, Klaviyo users, email marketers
3. Cover email marketing topics: lifecycle automation, flows, deliverability, segmentation, Klaviyo, campaigns, copy

Generate exactly 5 new blog topics as a JSON array.
Output ONLY valid JSON — no preamble, no explanation, no code fences.

Format:
[
  {
    "id": "url-slug-here",
    "title": "Full compelling post title",
    "keyword": "primary keyword phrase",
    "tags": ["tag1", "tag2", "tag3"],
    "notes": "Specific notes on angle, what to cover, examples to include, internal links to suggest. 2-3 sentences.",
    "status": "queued"
  }
]`,
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [
    {
      role: "user",
      content: `Keyword opportunities from Search Console (last 90 days):
${JSON.stringify(opportunities, null, 2)}

Existing topics already in queue (do not duplicate):
${existingTitles.join("\n")}

Generate 5 new blog topics targeting the strongest opportunities.`,
    },
  ],
});

// ── Parse response ────────────────────────────────────────────────────────────

let newTopics;
try {
  const text = message.content[0].text.trim();
  const json = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  newTopics = JSON.parse(json);
} catch (e) {
  console.error("Failed to parse Claude response:", message.content[0].text.slice(0, 300));
  process.exit(1);
}

// Filter duplicates
newTopics = newTopics.filter(
  (t) =>
    !existingKeywords.includes(t.keyword.toLowerCase()) &&
    !existingTitles.includes(t.title.toLowerCase())
);

if (newTopics.length === 0) {
  console.error("All generated topics were duplicates — nothing added.");
  console.log("count=0");
  process.exit(0);
}

// ── Write updated queue ───────────────────────────────────────────────────────

const updatedQueue = [...queue, ...newTopics];
await writeFile(queuePath, JSON.stringify(updatedQueue, null, 2) + "\n");

console.error(`Added ${newTopics.length} topics to queue`);
console.log(`count=${newTopics.length}`);
console.log(`titles=${newTopics.map((t) => t.title).join(" | ")}`);
