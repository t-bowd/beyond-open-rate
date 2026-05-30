import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { captureLead } from "@/lib/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LeadSchema = z.object({
  email: z.string().email().max(254),
  source: z
    .string()
    .min(1)
    .max(64)
    .regex(/^(hero-audit|contact-form|tool:[a-z0-9-]+)$/, "invalid source"),
  name: z.string().max(200).optional(),
  website: z.string().max(500).optional(),
  message: z.string().max(5000).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  // honeypot — bots fill it, humans don't
  company: z.string().max(0).optional().or(z.literal("")),
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_input" },
      { status: 400 },
    );
  }

  const { company, ...input } = parsed.data;
  if (company) {
    return NextResponse.json({ ok: true, id: "skipped" });
  }

  try {
    const result = await captureLead({
      ...input,
      source: input.source as Parameters<typeof captureLead>[0]["source"],
      userAgent: req.headers.get("user-agent") ?? undefined,
      ip,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (err) {
    console.error("[/api/lead] capture failed", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
