#!/usr/bin/env node
/**
 * get-refresh-token.js
 * One-time local script. Authenticates with Google as you, captures the
 * refresh token, and prints it so you can store it in GitHub Secrets.
 *
 * Usage:
 *   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=xxx node seo-engine/scripts/get-refresh-token.js
 */

import { google } from "googleapis";
import http from "http";
import { URL } from "url";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing env vars. Run as:");
  console.error("  GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=xxx node seo-engine/scripts/get-refresh-token.js");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/webmasters.readonly"],
  prompt: "consent", // required to get refresh_token every time
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\nWaiting for Google to redirect back...\n");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400);
    res.end(`Auth error: ${error}`);
    console.error("Auth error:", error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end("No code in callback.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Done. You can close this tab and check your terminal.</h2>");
    server.close();

    console.log("─────────────────────────────────────────");
    console.log("Add these three values to GitHub Secrets:");
    console.log("─────────────────────────────────────────");
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("─────────────────────────────────────────\n");
  } catch (err) {
    res.writeHead(500);
    res.end("Token exchange failed: " + err.message);
    console.error("Token exchange failed:", err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(3000, () => {});
