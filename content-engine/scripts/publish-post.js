#!/usr/bin/env node
/**
 * publish-post.js
 * Fires on PR merge. Reads the approved MDX draft, schedules the post
 * via Buffer, moves the file to published/, and logs to posted.json.
 *
 * Required env vars:
 *   BUFFER_ACCESS_TOKEN
 *   BUFFER_LINKEDIN_PROFILE_ID
 *   BUFFER_FACEBOOK_PAGE_ID  (optional — only needed if facebook: true)
 *   GITHUB_TOKEN
 *   GITHUB_REPOSITORY
 *   PR_NUMBER                (passed from workflow)
 */

import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BUFFER_API = "https://api.bufferapp.com/1/updates/create.json";

// ── Find the merged draft file ────────────────────────────────────────────────

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");
const prNumber = parseInt(process.env.PR_NUMBER, 10);

if (!owner || !repo || !prNumber) {
  console.error("GITHUB_REPOSITORY and PR_NUMBER must be set.");
  process.exit(1);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { data: files } = await octokit.pulls.listFiles({
  owner,
  repo,
  pull_number: prNumber,
});

const draftFile = files.find(
  (f) =>
    f.filename.startsWith("content-engine/posts/drafts/") &&
    f.filename.endsWith(".mdx")
);

if (!draftFile) {
  console.log("No draft MDX file found in this PR — nothing to publish.");
  process.exit(0);
}

const draftPath = path.join(
  path.resolve(__dirname, "../.."),
  draftFile.filename
);

if (!fs.existsSync(draftPath)) {
  console.error(`Draft file not found locally: ${draftPath}`);
  process.exit(1);
}

console.log(`Publishing: ${draftFile.filename}`);

// ── Parse MDX frontmatter ─────────────────────────────────────────────────────

const raw = fs.readFileSync(draftPath, "utf8");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    fm[key] = val;
  }

  // Parse nested platforms block
  const platformsMatch = match[1].match(/platforms:\n((?:\s+\w+: \w+\n?)+)/);
  if (platformsMatch) {
    fm.platforms = {};
    for (const line of platformsMatch[1].trim().split("\n")) {
      const [k, v] = line.trim().split(":").map((s) => s.trim());
      fm.platforms[k] = v === "true";
    }
  }

  return fm;
}

const fm = parseFrontmatter(raw);
const approvedVariant = fm.approved_variant || "A";
const scheduleTime = fm.schedule_time;
const platforms = fm.platforms || { linkedin: true };
const facebookVariant = fm.facebook_variant || "";
const topicId = fm.id;

// ── Extract approved post copy ────────────────────────────────────────────────

function extractVariantCopy(content, variant) {
  const label = variant === "EDITED" ? "A" : variant; // if edited, A section has the final copy
  const sectionStart = content.indexOf(`## Variant ${label}`);
  const nextSection = content.indexOf("\n---\n", sectionStart);

  if (sectionStart === -1) return null;

  const end = nextSection > -1 ? nextSection : content.length;
  return content
    .slice(sectionStart, end)
    .replace(`## Variant ${label}`, "")
    .trim();
}

const postCopy = extractVariantCopy(raw, approvedVariant);

if (!postCopy) {
  console.error(`Could not extract copy for variant ${approvedVariant}`);
  process.exit(1);
}

console.log(`Approved variant: ${approvedVariant}`);
console.log(`Schedule time: ${scheduleTime}`);

// ── Schedule LinkedIn post via Buffer ─────────────────────────────────────────

async function bufferSchedule(profileId, text, scheduledAt) {
  const params = new URLSearchParams({
    "profile_ids[]": profileId,
    text,
    scheduled_at: scheduledAt,
    shorten: "false",
    access_token: process.env.BUFFER_ACCESS_TOKEN,
  });

  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(`Buffer API error: ${JSON.stringify(data)}`);
  }

  return data;
}

// LinkedIn
if (platforms.linkedin) {
  try {
    await bufferSchedule(
      process.env.BUFFER_LINKEDIN_PROFILE_ID,
      postCopy,
      scheduleTime
    );
    console.log("LinkedIn post scheduled.");
  } catch (err) {
    console.error("LinkedIn scheduling failed:", err.message);
    process.exit(1);
  }
}

// Facebook (optional)
if (platforms.facebook && facebookVariant && process.env.BUFFER_FACEBOOK_PAGE_ID) {
  try {
    // Schedule 2 hours after LinkedIn
    const fbTime = new Date(new Date(scheduleTime).getTime() + 2 * 60 * 60 * 1000).toISOString();
    await bufferSchedule(
      process.env.BUFFER_FACEBOOK_PAGE_ID,
      facebookVariant,
      fbTime
    );
    console.log("Facebook post scheduled.");
  } catch (err) {
    console.error("Facebook scheduling failed (non-fatal):", err.message);
  }
}

// ── Move file from drafts/ to published/ ─────────────────────────────────────

const fileName = path.basename(draftPath);
const publishedPath = path.join(ROOT, "posts", "published", fileName);

fs.renameSync(draftPath, publishedPath);
console.log(`Moved to published/${fileName}`);

// ── Append to posted.json ─────────────────────────────────────────────────────

const postedPath = path.join(ROOT, "posted.json");
const posted = JSON.parse(fs.readFileSync(postedPath, "utf8"));

posted.push({
  id: topicId,
  file: fileName,
  published_at: new Date().toISOString(),
  schedule_time: scheduleTime,
  variant: approvedVariant,
});

fs.writeFileSync(postedPath, JSON.stringify(posted, null, 2) + "\n", "utf8");
console.log("posted.json updated.");

// ── Commit the file move + posted.json update via GitHub API ──────────────────

const { data: mainRef } = await octokit.git.getRef({
  owner,
  repo,
  ref: "heads/main",
});

// Get current file SHAs
const { data: draftGitFile } = await octokit.repos.getContent({
  owner,
  repo,
  path: draftFile.filename,
}).catch(() => ({ data: null }));

const { data: postedGitFile } = await octokit.repos.getContent({
  owner,
  repo,
  path: "content-engine/posted.json",
});

// Delete draft file
if (draftGitFile) {
  await octokit.repos.deleteFile({
    owner,
    repo,
    path: draftFile.filename,
    message: `linkedin: publish ${fileName}`,
    sha: draftGitFile.sha,
  });
}

// Create published file
await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: `content-engine/posts/published/${fileName}`,
  message: `linkedin: archive published post ${fileName}`,
  content: Buffer.from(fs.readFileSync(publishedPath, "utf8")).toString("base64"),
});

// Update posted.json
await octokit.repos.createOrUpdateFileContents({
  owner,
  repo,
  path: "content-engine/posted.json",
  message: `linkedin: log published post ${topicId}`,
  content: Buffer.from(JSON.stringify(posted, null, 2) + "\n").toString("base64"),
  sha: postedGitFile.sha,
});

console.log("Done. Post scheduled and archived.");
