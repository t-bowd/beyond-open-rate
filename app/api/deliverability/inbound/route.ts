import { NextRequest, NextResponse } from "next/server";
import { getAuditByInboundAddress, saveRawEmail } from "@/lib/deliverability/db";
import type { RawEmail } from "@/lib/deliverability/types";

export async function POST(req: NextRequest) {
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

  const audit = await getAuditByInboundAddress(body.to.toLowerCase());
  if (!audit) {
    console.warn(`[inbound] No audit found for address: ${body.to}`);
    return NextResponse.json({ ok: true });
  }

  if (audit.status === "expired") {
    console.warn(`[inbound] Audit ${audit.id} is expired`);
    return NextResponse.json({ ok: true });
  }

  try {
    await saveRawEmail(audit.id, body);
    console.log(`[inbound] Saved raw email for audit ${audit.id}`);
  } catch (err) {
    console.error(`[inbound] Failed to save raw email for audit ${audit.id}:`, err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  // Fire the Edge Function without awaiting — returns 200 to Cloudflare immediately.
  // The Edge Function runs the full audit asynchronously (up to 150s on Supabase).
  const edgeFnUrl = `${process.env.SUPABASE_URL}/functions/v1/run-deliverability-audit`;
  fetch(edgeFnUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "x-webhook-secret": process.env.EDGE_FUNCTION_WEBHOOK_SECRET ?? "",
    },
    body: JSON.stringify({
      record: {
        id: audit.id,
        status: "processing",
        raw_email: body,
      },
    }),
  }).catch((err) => console.error("[inbound] Edge Function trigger failed:", err));

  return NextResponse.json({ ok: true });
}
