import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { unlockPremium } from "@/lib/deliverability/db";

/**
 * Stripe webhook — listens for checkout.session.completed.
 * Unlocks premium tier and triggers PDF generation + Brevo notification.
 *
 * Register this endpoint in the Stripe dashboard:
 *   https://dashboard.stripe.com/webhooks
 * Events to listen for: checkout.session.completed
 */
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-05-28.basil",
  });

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const auditId = session.metadata?.audit_id;

    if (!auditId) {
      console.warn("[stripe-webhook] No audit_id in session metadata");
      return NextResponse.json({ ok: true });
    }

    if (session.payment_status === "paid") {
      try {
        await unlockPremium(auditId, session.payment_intent as string);
        console.log(`[stripe-webhook] Premium unlocked for audit ${auditId}`);

        // TODO (step 8): trigger PDF generation + Brevo premium email
      } catch (err) {
        console.error(`[stripe-webhook] Failed to unlock premium for ${auditId}:`, err);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
