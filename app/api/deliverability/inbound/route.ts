import { NextRequest, NextResponse } from "next/server";
import { getAuditByInboundAddress, saveRawEmail } from "@/lib/deliverability/db";
import type { RawEmail } from "@/lib/deliverability/types";

/**
 * POST /api/deliverability/inbound
 *
 * Called by the Cloudflare Email Worker when an inbound email arrives.
 * Expects a JSON body matching the RawEmail type + a shared secret header.
 *
 * After saving the raw email, the Supabase Database Webhook fires the
 * Edge Function (configured in Supabase dashboard) which runs all checks.
 */
export async function POST(req: NextRequest) {
  // Verify shared secret from Cloudflare Worker
  const secret = req.headers.get("x-worker-secret");
  if (!secret || secret !== process.env.CLOUDFLARE_WORKER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RawEmail;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.to || !body.from || !body.headers) {
    return NextResponse.json({ error: "Missing required fields: to, from, headers" }, { status: 400 });
  }

  // Match to audit record
  const audit = await getAuditByInboundAddress(body.to.toLowerCase());
  if (!audit) {
    // Unknown address — silently accept so Cloudflare doesn't retry
    console.warn(`[inbound] No audit found for address: ${body.to}`);
    return NextResponse.json({ ok: true });
  }

  if (audit.status === "expired") {
    console.warn(`[inbound] Audit ${audit.id} is expired`);
    return NextResponse.json({ ok: true });
  }

  // Save raw email and set status to 'processing'
  // The Supabase Database Webhook fires the Edge Function from here
  try {
    await saveRawEmail(audit.id, body);
    console.log(`[inbound] Saved raw email for audit ${audit.id}`);
  } catch (err) {
    console.error(`[inbound] Failed to save raw email for audit ${audit.id}:`, err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
