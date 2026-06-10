import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { getAuditById, unlockPremium } from "@/lib/deliverability/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment confirmed — full report unlocked",
  robots: { index: false, follow: false },
};

type Props = {
  params: { id: string };
  searchParams: { session_id?: string };
};

export default async function SuccessPage({ params, searchParams }: Props) {
  const audit = await getAuditById(params.id);
  if (!audit) notFound();

  const sessionId = searchParams.session_id;

  // Verify Stripe payment if not yet unlocked
  if (audit.tier !== "premium" && sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-05-28.basil",
      });
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid" && session.metadata?.audit_id === params.id) {
        await unlockPremium(params.id, session.payment_intent as string);
      }
    } catch {
      // If verification fails, redirect to upgrade to try again
      redirect(`/tools/deliverability-audit/upgrade/${params.id}`);
    }
  }

  if (audit.tier !== "premium" && !sessionId) {
    redirect(`/tools/deliverability-audit/upgrade/${params.id}`);
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 600 }}>
        <p className="eyebrow">Payment confirmed</p>
        <h1>Your full report is ready.</h1>
        <p style={{ marginTop: 16, color: "var(--ink-soft)" }}>
          We&apos;ve also emailed the PDF to {audit.email} — check your inbox in the next minute or two.
        </p>
        <Link
          href={`/tools/deliverability-audit/report/${params.id}`}
          className="btn btn-primary btn-lg"
          style={{ marginTop: 32, display: "inline-block" }}
        >
          View full report →
        </Link>
      </div>
    </section>
  );
}
