import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getAuditById, saveUpgradeDetails } from "@/lib/deliverability/db";

const schema = z.object({
  list_size: z.enum(["<1k", "1k-10k", "10k-50k", "50k+"]),
  send_frequency: z.enum(["weekly", "fortnightly", "monthly"]),
  revenue_per_email: z.string().max(100).nullable().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const audit = await getAuditById(params.id);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }
  if (audit.tier === "premium") {
    return NextResponse.json({ error: "Already premium" }, { status: 400 });
  }
  if (audit.status !== "complete") {
    return NextResponse.json({ error: "Audit not complete" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { list_size, send_frequency, revenue_per_email } = parsed.data;

  // Save upgrade details
  await saveUpgradeDetails(params.id, list_size, send_frequency, revenue_per_email ?? null);

  // Create Stripe Checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondopenrate.com.au";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: process.env.STRIPE_DELIVERABILITY_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      audit_id: params.id,
    },
    customer_email: audit.email,
    success_url: `${baseUrl}/tools/deliverability-audit/success/${params.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/tools/deliverability-audit/upgrade/${params.id}`,
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
