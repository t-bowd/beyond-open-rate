#!/usr/bin/env node
/**
 * Queries Google Search Console for pages with good impressions but low CTR,
 * fetches the top queries driving those impressions, asks Claude to rewrite
 * the meta title and description, and applies the changes to the source files.
 *
 * Outputs changed_files= to stdout for the GitHub Actions workflow.
 */

import Anthropic from "@anthropic-ai/sdk";
import { google } from "googleapis";
import { readFile, writeFile, access } from "node:fs/promises";

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

// ── Find site URL ─────────────────────────────────────────────────────────────

const sitesRes = await sc.sites.list();
const sites = sitesRes.data.siteEntry || [];
const siteUrl =
  sites.find((s) => s.siteUrl.includes("beyondopenrate"))?.siteUrl ||
  "sc-domain:beyondopenrate.com.au";

console.error(`Using site: ${siteUrl}`);

// ── Query GSC for page-level data ─────────────────────────────────────────────

const endDate = new Date().toISOString().split("T")[0];
const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

let pageRows = [];
try {
  const res = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 50,
      orderBy: [{ fieldName: "impressions", sortOrder: "DESCENDING" }],
    },
  });
  pageRows = res.data.rows || [];
} catch (e) {
  console.error("GSC page query failed:", e.message);
  console.log("changed_files=0");
  process.exit(0);
}

if (pageRows.length === 0) {
  console.error("No GSC page data yet.");
  console.log("changed_files=0");
  process.exit(0);
}

// Pages with impressions but low CTR — opportunity to improve meta
const lowCtrPages = pageRows
  .filter((r) => r.impressions >= 30 && r.ctr < 0.04 && r.position <= 20)
  .slice(0, 5); // audit top 5 per run

console.error(`Found ${lowCtrPages.length} low-CTR pages to audit`);

if (lowCtrPages.length === 0) {
  console.error("No pages need meta improvement right now.");
  console.log("changed_files=0");
  process.exit(0);
}

// ── Map URL → source file ─────────────────────────────────────────────────────

function urlToFile(url) {
  const path = new URL(url).pathname.replace(/\/$/, "") || "/";
  if (path === "/") return { file: "app/page.tsx", type: "tsx" };
  if (path === "/about") return { file: "app/about/page.tsx", type: "tsx" };
  if (path === "/blog") return { file: "app/blog/page.tsx", type: "tsx" };
  if (path === "/services") return { file: "app/services/page.tsx", type: "tsx" };
  if (path === "/tools") return { file: "app/tools/page.tsx", type: "tsx" };
  if (path === "/tools/email-audit") return { file: "app/tools/email-audit/page.tsx", type: "tsx" };
  if (path.startsWith("/blog/")) return { file: `content/blog/${path.replace("/blog/", "")}.mdx`, type: "mdx" };
  if (path.startsWith("/services/")) return { file: `content/services/${path.replace("/services/", "")}.mdx`, type: "mdx" };
  // Top-level SEO pages
  return { file: `content/seo/${path.replace("/", "")}.mdx`, type: "mdx" };
}

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

// ── Read current metadata from file ──────────────────────────────────────────

async function readMeta(file, type) {
  const content = await readFile(file, "utf8");
  if (type === "tsx") {
    const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
    const descMatch = content.match(/description:\s*[\n\r\s]*["'`]([^"'`]+)["'`]/);
    return {
      title: titleMatch?.[1] ?? "",
      description: descMatch?.[1] ?? "",
      content,
    };
  } else {
    // MDX frontmatter
    const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    const descMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    return {
      title: titleMatch?.[1]?.replace(/^["']|["']$/g, "") ?? "",
      description: descMatch?.[1]?.replace(/^["']|["']$/g, "") ?? "",
      content,
    };
  }
}

// ── Apply new metadata to file ────────────────────────────────────────────────

function applyMeta(content, type, newTitle, newDesc) {
  if (type === "tsx") {
    let updated = content.replace(
      /title:\s*["'`][^"'`]+["'`]/,
      `title: "${newTitle.replace(/"/g, "'")}"`
    );
    updated = updated.replace(
      /description:\s*[\n\r\s]*["'`][^"'`]+["'`]/,
      `description:\n    "${newDesc.replace(/"/g, "'")}"`
    );
    return updated;
  } else {
    let updated = content.replace(
      /^title:\s*["']?(.+?)["']?\s*$/m,
      `title: "${newTitle.replace(/"/g, "'")}"`
    );
    updated = updated.replace(
      /^description:\s*["']?(.+?)["']?\s*$/m,
      `description: "${newDesc.replace(/"/g, "'")}"`
    );
    return updated;
  }
}

// ── Process each low-CTR page ─────────────────────────────────────────────────

const client = new Anthropic();
const changedFiles = [];

for (const row of lowCtrPages) {
  const url = row.keys[0];
  const { file, type } = urlToFile(url);

  console.error(`\nProcessing: ${url} → ${file}`);

  if (!(await fileExists(file))) {
    console.error(`  File not found, skipping: ${file}`);
    continue;
  }

  // Get top queries for this page
  let pageQueries = [];
  try {
    const qRes = await sc.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        dimensionFilterGroups: [{
          filters: [{ dimension: "page", operator: "equals", expression: url }],
        }],
        rowLimit: 10,
        orderBy: [{ fieldName: "impressions", sortOrder: "DESCENDING" }],
      },
    });
    pageQueries = (qRes.data.rows || []).map((r) => r.keys[0]);
  } catch (e) {
    console.error(`  Could not fetch queries for ${url}:`, e.message);
  }

  const { title, description, content } = await readMeta(file, type);

  if (!title && !description) {
    console.error(`  Could not extract metadata, skipping`);
    continue;
  }

  // Ask Claude to improve the meta
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: `You are an SEO specialist for Beyond Open Rate, an Australian email marketing agency.
Rewrite the page title and meta description to improve click-through rate.

Rules:
- Title: 50–60 characters. Include the primary keyword. End with "— Beyond Open Rate" if space allows.
- Description: 140–155 characters exactly. Include keyword, benefit, and Australian signal where natural.
- Match search intent from the top queries provided.
- Be direct and specific — no vague phrases like "comprehensive guide".
- Australian spelling.

Output ONLY a JSON object, no explanation:
{"title": "...", "description": "..."}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Page URL: ${url}
Current title: ${title}
Current description: ${description}
GSC impressions (28d): ${Math.round(row.impressions)}
GSC CTR: ${(row.ctr * 100).toFixed(1)}%
GSC avg position: ${row.position.toFixed(1)}
Top queries driving impressions:
${pageQueries.slice(0, 8).join("\n")}

Rewrite title and description to better match these queries and improve CTR.`,
      },
    ],
  });

  let improved;
  try {
    const text = msg.content[0].text.trim();
    const json = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    improved = JSON.parse(json);
  } catch (e) {
    console.error(`  Failed to parse Claude response, skipping`);
    continue;
  }

  if (!improved.title || !improved.description) {
    console.error(`  Incomplete response, skipping`);
    continue;
  }

  console.error(`  Old title: ${title}`);
  console.error(`  New title: ${improved.title}`);
  console.error(`  Old desc:  ${description}`);
  console.error(`  New desc:  ${improved.description}`);

  const updated = applyMeta(content, type, improved.title, improved.description);

  if (updated === content) {
    console.error(`  No change detected, skipping`);
    continue;
  }

  await writeFile(file, updated);
  changedFiles.push(file);
  console.error(`  ✓ Updated ${file}`);
}

console.log(`changed_files=${changedFiles.length}`);
console.log(`files=${changedFiles.join(",")}`);
