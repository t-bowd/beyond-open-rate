// Supabase Edge Function — run-deliverability-audit
// Triggered by a Supabase Database Webhook when an audit row's status
// changes to 'processing'. Runs all 13 deliverability checks, scores
// the result, updates the DB, and sends a Brevo notification.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckStatus = "pass" | "warning" | "fail" | "unknown";
type CR = { status: CheckStatus; detail?: string };

type AuditResults = {
  spf: CR;
  dkim: CR & { signing_domain?: string };
  dmarc: CR & { policy?: string };
  blacklist: CR & { listed_on?: string[]; checked?: number };
  ip_type: CR & { type?: string };
  esp: CR & { name?: string };
  tls: CR;
  ptr: CR;
  reply_to_mismatch: CR;
  subject_spam: CR & { triggers?: string[] };
  html_text_ratio: CR;
  list_unsubscribe: CR;
  one_click_unsubscribe: CR;
};

type RawEmail = {
  to: string;
  from: string;
  subject: string;
  sending_ip: string | null;
  headers: Record<string, string | string[]>;
  html: string | null;
  text: string | null;
};

// ── DNS over HTTPS (Cloudflare) ───────────────────────────────────────────────

async function doh(
  name: string,
  type: string,
): Promise<{ Status: number; Answer?: { data: string }[] }> {
  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
    const res = await fetch(url, {
      headers: { Accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { Status: -1 };
    return await res.json();
  } catch {
    return { Status: -1 };
  }
}

function header(
  headers: Record<string, string | string[]>,
  key: string,
): string {
  const v = headers[key.toLowerCase()];
  return Array.isArray(v) ? v[0] : v ?? "";
}

function allHeaders(headers: Record<string, string | string[]>): string {
  return JSON.stringify(headers).toLowerCase();
}

// ── Authentication checks ─────────────────────────────────────────────────────

function parseAuthResults(raw: string) {
  const spf = raw.match(/\bspf=([\w]+)/i)?.[1]?.toLowerCase() ?? null;
  const dkim = raw.match(/\bdkim=([\w]+)/i)?.[1]?.toLowerCase() ?? null;
  const dkimDomain =
    raw.match(/header\.i=@?([\w.-]+)/i)?.[1]?.toLowerCase() ?? null;
  const dmarc = raw.match(/\bdmarc=([\w]+)/i)?.[1]?.toLowerCase() ?? null;
  return { spf, dkim, dkimDomain, dmarc };
}

function checkSpf(parsed: ReturnType<typeof parseAuthResults>): CR {
  switch (parsed.spf) {
    case "pass":
      return { status: "pass", detail: "SPF pass" };
    case "softfail":
      return { status: "warning", detail: "SPF softfail — ~all policy" };
    case "fail":
      return { status: "fail", detail: "SPF hard fail" };
    case "neutral":
      return { status: "warning", detail: "SPF neutral" };
    case null:
      return { status: "unknown", detail: "No SPF result in Authentication-Results" };
    default:
      return { status: "warning", detail: `SPF: ${parsed.spf}` };
  }
}

function checkDkim(parsed: ReturnType<typeof parseAuthResults>): CR & { signing_domain?: string } {
  if (parsed.dkim === "pass") {
    return {
      status: "pass",
      detail: parsed.dkimDomain ? `Signed by ${parsed.dkimDomain}` : "DKIM pass",
      signing_domain: parsed.dkimDomain ?? undefined,
    };
  }
  if (parsed.dkim === "fail") {
    return { status: "fail", detail: "DKIM signature invalid" };
  }
  if (parsed.dkim === null) {
    return { status: "fail", detail: "No DKIM signature found" };
  }
  return { status: "warning", detail: `DKIM: ${parsed.dkim}` };
}

async function checkDmarc(
  sendingDomain: string,
  authDmarc: string | null,
): Promise<CR & { policy?: string }> {
  // Check what the Authentication-Results header says
  const arResult = authDmarc;

  // Fetch the actual DMARC DNS record for the policy
  const result = await doh(`_dmarc.${sendingDomain}`, "TXT");
  const txt =
    result.Answer?.find((a) => a.data.includes("v=DMARC1"))?.data ?? null;

  if (!txt) {
    return {
      status: "fail",
      detail: "No DMARC record found",
      policy: undefined,
    };
  }

  const policyMatch = txt.match(/\bp=([\w]+)/i);
  const policy = policyMatch?.[1]?.toLowerCase() ?? "none";

  if (policy === "reject") {
    return { status: "pass", detail: "p=reject", policy: "reject" };
  }
  if (policy === "quarantine") {
    return { status: "warning", detail: "p=quarantine — consider upgrading to reject", policy: "quarantine" };
  }
  return { status: "warning", detail: "p=none — monitoring only, not enforcing", policy: "none" };
}

// ── Blacklist check ───────────────────────────────────────────────────────────

const DNSBL_LISTS = [
  "zen.spamhaus.org",
  "b.barracudacentral.org",
  "bl.spamcop.net",
  "dnsbl.sorbs.net",
  "psbl.surriel.com",
  "dnsbl-1.uceprotect.net",
  "bl.mailspike.net",
  "dnsbl.dronebl.org",
  "truncate.gbudb.net",
  "dnsbl.justspam.org",
];

async function checkBlacklists(
  ip: string,
): Promise<CR & { listed_on?: string[]; checked?: number }> {
  const reversed = ip.split(".").reverse().join(".");

  const checks = await Promise.allSettled(
    DNSBL_LISTS.map(async (list) => {
      const r = await doh(`${reversed}.${list}`, "A");
      const listed = r.Status === 0 && (r.Answer?.length ?? 0) > 0;
      return { list, listed };
    }),
  );

  const listed = checks
    .filter((r) => r.status === "fulfilled" && r.value.listed)
    .map((r) => (r as PromiseFulfilledResult<{ list: string; listed: boolean }>).value.list);

  if (listed.length > 0) {
    return {
      status: "fail",
      detail: `Listed on ${listed.length} of ${DNSBL_LISTS.length} lists`,
      listed_on: listed,
      checked: DNSBL_LISTS.length,
    };
  }

  return {
    status: "pass",
    detail: `Clean on all ${DNSBL_LISTS.length} lists checked`,
    listed_on: [],
    checked: DNSBL_LISTS.length,
  };
}

// ── PTR (reverse DNS) ─────────────────────────────────────────────────────────

async function checkPtr(ip: string): Promise<CR> {
  const reversed = ip.split(".").reverse().join(".");
  const result = await doh(`${reversed}.in-addr.arpa`, "PTR");

  if (result.Status === 0 && result.Answer?.length) {
    const ptr = result.Answer[0].data.replace(/\.$/, "");
    return { status: "pass", detail: ptr };
  }

  return { status: "fail", detail: "No PTR record — sending IP has no reverse DNS" };
}

// ── IP type (shared vs dedicated) ────────────────────────────────────────────

async function checkIpType(
  ip: string,
): Promise<CR & { type?: string }> {
  const ptrResult = await doh(
    `${ip.split(".").reverse().join(".")}.in-addr.arpa`,
    "PTR",
  );
  const ptr =
    ptrResult.Answer?.[0]?.data?.toLowerCase().replace(/\.$/, "") ?? "";

  const sharedPatterns = [
    "mailout", "mta", "smtp", "mail", "outbound", "relay",
    "klaviyo", "mailchimp", "sendgrid", "amazonses", "mailgun",
    "sparkpost", "postmark", "brevo", "sendinblue", "constantcontact",
    "activecampaign", "hubspot", "salesforce", "exacttarget",
  ];

  const looksShared = sharedPatterns.some((p) => ptr.includes(p));

  if (!ptr) {
    return { status: "unknown", detail: "Could not determine IP type", type: "unknown" };
  }

  if (looksShared) {
    return {
      status: "warning",
      detail: `Shared IP (${ptr})`,
      type: "shared",
    };
  }

  return { status: "pass", detail: `Dedicated IP (${ptr})`, type: "dedicated" };
}

// ── ESP detection ─────────────────────────────────────────────────────────────

function detectEsp(
  headers: Record<string, string | string[]>,
): CR & { name?: string } {
  const h = allHeaders(headers);

  const esps: [string, string[]][] = [
    ["Klaviyo", ["klaviyo"]],
    ["Mailchimp", ["mailchimp", "chimpapp", "mcsv.net"]],
    ["HubSpot", ["hubspot", "hs-email"]],
    ["ActiveCampaign", ["activecampaign", "ac-m.com"]],
    ["Customer.io", ["customerio", "customer.io"]],
    ["SendGrid", ["sendgrid"]],
    ["Mailgun", ["mailgun"]],
    ["Omnisend", ["omnisend"]],
    ["Drip", ["drip", "getdrip"]],
    ["Campaign Monitor", ["campaignmonitor", "createsend", "cmail"]],
    ["Constant Contact", ["constantcontact", "ctct"]],
    ["Brevo", ["brevo", "sendinblue"]],
    ["Amazon SES", ["amazonses", "amazon ses"]],
    ["Postmark", ["postmark"]],
    ["Dotdigital", ["dotdigital", "dotmailer"]],
    ["AWeber", ["aweber"]],
    ["GetResponse", ["getresponse"]],
  ];

  for (const [name, patterns] of esps) {
    if (patterns.some((p) => h.includes(p))) {
      return { status: "pass", detail: name, name };
    }
  }

  return { status: "unknown", detail: "Could not identify sending platform", name: undefined };
}

// ── TLS in transit ────────────────────────────────────────────────────────────

function checkTls(headers: Record<string, string | string[]>): CR {
  const received = headers["received"];
  const allReceived = Array.isArray(received)
    ? received.join(" ")
    : received ?? "";

  const hasTls =
    /with ESMTPS/i.test(allReceived) ||
    /TLS/i.test(allReceived) ||
    /STARTTLS/i.test(allReceived);

  if (hasTls) {
    return { status: "pass", detail: "Encrypted in transit (TLS)" };
  }

  return { status: "fail", detail: "No TLS detected in Received headers" };
}

// ── Reply-to mismatch ─────────────────────────────────────────────────────────

function checkReplyToMismatch(
  headers: Record<string, string | string[]>,
): CR {
  const extractDomain = (addr: string) => {
    const match = addr.match(/@([\w.-]+)/);
    return match?.[1]?.toLowerCase() ?? null;
  };

  const fromDomain = extractDomain(header(headers, "from"));
  const replyToDomain = extractDomain(header(headers, "reply-to"));
  const returnPathDomain = extractDomain(header(headers, "return-path"));

  if (!replyToDomain && !returnPathDomain) {
    return { status: "pass", detail: "No Reply-to mismatch" };
  }

  const mismatches: string[] = [];

  if (replyToDomain && fromDomain && replyToDomain !== fromDomain) {
    mismatches.push(`Reply-To (${replyToDomain}) ≠ From (${fromDomain})`);
  }

  if (
    returnPathDomain &&
    fromDomain &&
    !returnPathDomain.endsWith(fromDomain) &&
    !fromDomain.endsWith(returnPathDomain)
  ) {
    // Return-path is often the ESP's bounce domain — only flag if clearly different
    // Check if they share a root domain
    const rootFrom = fromDomain.split(".").slice(-2).join(".");
    const rootReturn = returnPathDomain.split(".").slice(-2).join(".");
    if (rootFrom !== rootReturn) {
      mismatches.push(`Return-Path (${returnPathDomain}) ≠ From (${fromDomain})`);
    }
  }

  if (mismatches.length > 0) {
    return {
      status: "warning",
      detail: mismatches.join("; "),
    };
  }

  return { status: "pass", detail: "Domains aligned" };
}

// ── Subject spam triggers ─────────────────────────────────────────────────────

const SPAM_TRIGGERS = [
  "free!", "100% free", "guaranteed", "winner", "you've won", "you have won",
  "act now", "act immediately", "limited time", "urgent", "don't delete",
  "click here", "buy now", "order now", "call now", "apply now",
  "cash bonus", "earn money", "extra income", "make money", "fast cash",
  "no cost", "no obligation", "no purchase necessary", "risk-free",
  "congratulations", "dear friend", "dear winner", "you are a winner",
  "claim your", "claim now", "collect your", "special promotion",
  "once in a lifetime", "lowest price", "this won't last",
];

function checkSubjectSpam(subject: string): CR & { triggers?: string[] } {
  const lower = subject.toLowerCase();
  const found = SPAM_TRIGGERS.filter((t) => lower.includes(t));

  if (found.length > 0) {
    return {
      status: "warning",
      detail: `${found.length} spam trigger${found.length > 1 ? "s" : ""} found`,
      triggers: found,
    };
  }

  return { status: "pass", detail: "No spam triggers detected" };
}

// ── HTML / text ratio ─────────────────────────────────────────────────────────

function checkHtmlTextRatio(html: string | null, text: string | null): CR {
  if (text && text.trim().length > 0) {
    return { status: "pass", detail: "Plain text version present" };
  }
  if (html) {
    return {
      status: "warning",
      detail: "HTML only — no plain text version",
    };
  }
  return { status: "unknown", detail: "Could not determine email format" };
}

// ── List-Unsubscribe ──────────────────────────────────────────────────────────

function checkListUnsubscribe(
  headers: Record<string, string | string[]>,
): CR {
  const h = header(headers, "list-unsubscribe");
  if (h) {
    return { status: "pass", detail: "List-Unsubscribe header present" };
  }
  return {
    status: "fail",
    detail: "Missing — required by Gmail and Yahoo for bulk senders",
  };
}

function checkOneClickUnsubscribe(
  headers: Record<string, string | string[]>,
): CR {
  const h = header(headers, "list-unsubscribe-post");
  if (h && h.toLowerCase().includes("list-unsubscribe=one-click")) {
    return { status: "pass", detail: "One-click unsubscribe supported" };
  }
  return {
    status: "fail",
    detail: "Missing List-Unsubscribe-Post header — Gmail/Yahoo 2024 requirement",
  };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

type Grade = "A" | "B" | "C" | "D" | "F";

const WEIGHTS: Record<string, number> = {
  spf_fail: -20,
  spf_softfail: -10,
  spf_warning: -5,
  dkim_fail: -20,
  dmarc_none: -10,
  dmarc_missing: -15,
  dmarc_warning: -5,
  blacklist_fail: -25,
  ptr_fail: -5,
  tls_fail: -10,
  reply_to_warning: -10,
  subject_spam_warning: -10,
  html_text_warning: -5,
  list_unsubscribe_fail: -15,
  one_click_fail: -10,
};

function calculateScore(
  results: AuditResults,
): { score: number; grade: Grade; isCritical: boolean } {
  let score = 100;
  let isCritical = false;

  // SPF
  if (results.spf.status === "fail") {
    score += WEIGHTS.spf_fail;
    isCritical = true;
  } else if (results.spf.detail?.includes("softfail")) {
    score += WEIGHTS.spf_softfail;
  } else if (results.spf.status === "warning") {
    score += WEIGHTS.spf_warning;
  }

  // DKIM
  if (results.dkim.status === "fail") {
    score += WEIGHTS.dkim_fail;
    isCritical = true;
  }

  // DMARC
  if (results.dmarc.status === "fail") {
    score += WEIGHTS.dmarc_missing;
  } else if (results.dmarc.status === "warning") {
    const isNone = (results.dmarc as { policy?: string }).policy === "none";
    score += isNone ? WEIGHTS.dmarc_none : WEIGHTS.dmarc_warning;
  }

  // Blacklist
  if (results.blacklist.status === "fail") {
    score += WEIGHTS.blacklist_fail;
    isCritical = true;
  }

  // PTR
  if (results.ptr.status === "fail") score += WEIGHTS.ptr_fail;

  // TLS
  if (results.tls.status === "fail") score += WEIGHTS.tls_fail;

  // Reply-to
  if (results.reply_to_mismatch.status === "warning") score += WEIGHTS.reply_to_warning;

  // Subject spam
  if (results.subject_spam.status === "warning") score += WEIGHTS.subject_spam_warning;

  // HTML/text
  if (results.html_text_ratio.status === "warning") score += WEIGHTS.html_text_warning;

  // List-Unsubscribe
  if (results.list_unsubscribe.status === "fail") score += WEIGHTS.list_unsubscribe_fail;

  // One-click
  if (results.one_click_unsubscribe.status === "fail") score += WEIGHTS.one_click_fail;

  score = Math.max(0, Math.min(100, score));

  // Critical failures cap the grade at D
  const maxScore = isCritical ? 59 : 100;
  const capped = Math.min(score, maxScore);

  let grade: Grade;
  if (capped >= 90) grade = "A";
  else if (capped >= 75) grade = "B";
  else if (capped >= 60) grade = "C";
  else if (capped >= 40) grade = "D";
  else grade = "F";

  return { score: capped, grade, isCritical };
}

// ── Brevo notification ────────────────────────────────────────────────────────

async function sendReadyEmail(
  name: string,
  toEmail: string,
  auditId: string,
  score: number,
  grade: string,
  siteUrl: string,
) {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  if (!apiKey) return;

  const reportUrl = `${siteUrl}/tools/deliverability-audit/report/${auditId}`;

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Beyond Open Rate", email: "hello@beyondopenrate.com.au" },
      to: [{ email: toEmail, name }],
      subject: `Your deliverability audit is ready — Grade ${grade}`,
      htmlContent: `
        <p>Hi ${name},</p>
        <p>Your email deliverability audit is complete.</p>
        <p><strong>Score: ${score}/100 &mdash; Grade ${grade}</strong></p>
        <p>
          <a href="${reportUrl}" style="background:#6A00CC;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;">
            View your report →
          </a>
        </p>
        <p style="color:#888;font-size:13px;">
          The full report (explanations, fix steps, revenue impact) is available for $9 on the report page.
        </p>
        <p>Tim Bowman<br>Director, Beyond Open Rate</p>
      `,
    }),
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Verify webhook secret
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: { record?: { id?: string; raw_email?: RawEmail; status?: string } };
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const record = payload.record;
  if (!record?.id || !record?.raw_email || record.status !== "processing") {
    return new Response("Nothing to do", { status: 200 });
  }

  const auditId = record.id;
  const raw: RawEmail = record.raw_email;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SERVICE_ROLE_KEY") ?? "",
  );

  // Prevent double-processing
  const { data: current } = await supabase
    .from("deliverability_audits")
    .select("status")
    .eq("id", auditId)
    .single();

  if (!current || current.status !== "processing") {
    return new Response("Already processed", { status: 200 });
  }

  try {
    // ── Extract metadata ────────────────────────────────────────────────────

    const authResultsHeader =
      header(raw.headers, "authentication-results") ||
      header(raw.headers, "x-google-dkim-signature") || "";

    const parsed = parseAuthResults(authResultsHeader);

    // Sending domain from From header
    const fromHeader = header(raw.headers, "from");
    const sendingDomain =
      fromHeader.match(/@([\w.-]+)/)?.[1]?.toLowerCase() ?? null;

    const sendingIp = raw.sending_ip;

    // ── Run checks ──────────────────────────────────────────────────────────

    const [
      dmarcResult,
      blacklistResult,
      ptrResult,
      ipTypeResult,
    ] = await Promise.all([
      sendingDomain
        ? checkDmarc(sendingDomain, parsed.dmarc)
        : Promise.resolve({ status: "unknown" as CheckStatus, detail: "Could not determine sending domain" }),
      sendingIp
        ? checkBlacklists(sendingIp)
        : Promise.resolve({ status: "unknown" as CheckStatus, detail: "No sending IP found", listed_on: [], checked: 0 }),
      sendingIp
        ? checkPtr(sendingIp)
        : Promise.resolve({ status: "unknown" as CheckStatus, detail: "No sending IP found" }),
      sendingIp
        ? checkIpType(sendingIp)
        : Promise.resolve({ status: "unknown" as CheckStatus, detail: "No sending IP found", type: "unknown" }),
    ]);

    const espResult = detectEsp(raw.headers);

    const results: AuditResults = {
      spf: checkSpf(parsed),
      dkim: checkDkim(parsed),
      dmarc: dmarcResult,
      blacklist: blacklistResult,
      ip_type: ipTypeResult,
      esp: espResult,
      tls: checkTls(raw.headers),
      ptr: ptrResult,
      reply_to_mismatch: checkReplyToMismatch(raw.headers),
      subject_spam: checkSubjectSpam(raw.subject),
      html_text_ratio: checkHtmlTextRatio(raw.html, raw.text),
      list_unsubscribe: checkListUnsubscribe(raw.headers),
      one_click_unsubscribe: checkOneClickUnsubscribe(raw.headers),
    };

    // ── Score ────────────────────────────────────────────────────────────────

    const { score, grade } = calculateScore(results);

    // ── Save to DB ───────────────────────────────────────────────────────────

    await supabase
      .from("deliverability_audits")
      .update({
        results,
        score,
        grade,
        sending_domain: sendingDomain,
        sending_ip: sendingIp,
        esp_detected: espResult.name ?? null,
        status: "complete",
        completed_at: new Date().toISOString(),
        raw_email: null,
      })
      .eq("id", auditId);

    // ── Notify via Brevo ─────────────────────────────────────────────────────

    const { data: audit } = await supabase
      .from("deliverability_audits")
      .select("name, email")
      .eq("id", auditId)
      .single();

    if (audit) {
      const siteUrl =
        Deno.env.get("SITE_URL") ?? "https://beyondopenrate.com.au";
      await sendReadyEmail(audit.name, audit.email, auditId, score, grade, siteUrl);
    }

    console.log(`Audit ${auditId} complete — score ${score} grade ${grade}`);
    return new Response(JSON.stringify({ ok: true, score, grade }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(`Audit ${auditId} failed:`, err);

    // Mark as failed so the pending page doesn't hang forever
    await supabase
      .from("deliverability_audits")
      .update({ status: "complete", score: 0, grade: "F" })
      .eq("id", auditId);

    return new Response("Internal error", { status: 500 });
  }
});
