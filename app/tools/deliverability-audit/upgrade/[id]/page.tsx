import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuditById } from "@/lib/deliverability/db";
import UpgradeForm from "@/components/deliverability/UpgradeForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unlock your full deliverability report — $9",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } };

export default async function UpgradePage({ params }: Props) {
  const audit = await getAuditById(params.id);
  if (!audit) notFound();

  // Already premium
  if (audit.tier === "premium") {
    redirect(`/tools/deliverability-audit/report/${params.id}`);
  }

  // Audit not complete yet
  if (audit.status !== "complete") {
    redirect(`/tools/deliverability-audit/pending/${params.id}`);
  }

  const issues = audit.score !== null ? (100 - audit.score) : null;

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 600 }}>
        <p className="eyebrow">One-off $9</p>
        <h1>Unlock your full report</h1>

        {audit.score !== null && audit.grade && (
          <div className="da-upgrade-score-summary">
            <p>
              Your deliverability score is <strong>{audit.score}/100</strong> (grade <strong>{audit.grade}</strong>).
              {" "}The full report shows you exactly what&apos;s causing every failure and how to fix it.
            </p>
          </div>
        )}

        <div className="da-upgrade-whats-included">
          <h2>What you&apos;re unlocking</h2>
          <ul>
            <li><strong>Plain-English explanations</strong> — what each failure means and why it matters</li>
            <li><strong>Fix steps</strong> — the exact DNS records or settings changes to make</li>
            <li><strong>Revenue impact estimate</strong> — how many emails you&apos;re losing to filters based on your list size</li>
            <li><strong>Industry benchmarks</strong> — how your setup compares to similar senders</li>
            <li><strong>Re-test access</strong> — same address stays active 30 days so you can verify fixes</li>
            <li><strong>PDF report</strong> — formatted to share with a developer or agency</li>
          </ul>
        </div>

        <UpgradeForm auditId={params.id} />
      </div>
    </section>
  );
}
