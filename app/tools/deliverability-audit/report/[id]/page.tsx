import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAuditById } from "@/lib/deliverability/db";
import CheckGrid from "@/components/deliverability/CheckGrid";
import { issueCount, gradeColour } from "@/lib/deliverability/types";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Your deliverability report",
    robots: { index: false, follow: false },
  };
}

export default async function ReportPage({ params }: Props) {
  const audit = await getAuditById(params.id);
  if (!audit) notFound();

  // Not done yet — send back to pending
  if (audit.status === "pending" || audit.status === "processing") {
    redirect(`/tools/deliverability-audit/pending/${params.id}`);
  }

  if (audit.status === "expired") {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <h1>This report has expired</h1>
          <p>Audit reports are available for 30 days. Start a new audit to check your deliverability.</p>
          <Link href="/tools/deliverability-audit" className="btn btn-primary" style={{ marginTop: 24 }}>
            Start a new audit →
          </Link>
        </div>
      </section>
    );
  }

  const { results, score, grade, esp_detected, tier } = audit;
  const isPremium = tier === "premium";

  if (!results || score === null || grade === null) {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <h1>Something went wrong</h1>
          <p>We couldn&apos;t process this audit. Please <Link href="/contact">get in touch</Link> and we&apos;ll sort it out.</p>
        </div>
      </section>
    );
  }

  const issues = issueCount(results);

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 680 }}>

        {/* Score header */}
        <div className="da-report-header">
          <div className="da-score-block">
            <span
              className="da-grade"
              style={{ color: gradeColour(grade) }}
              aria-label={`Grade ${grade}`}
            >
              {grade}
            </span>
            <div className="da-score-detail">
              <span className="da-score-num">{score}<span className="da-score-max">/100</span></span>
              <span className="da-score-label">Deliverability score</span>
            </div>
          </div>

          <div className="da-report-meta">
            {esp_detected && (
              <p className="da-meta-row">
                <span className="da-meta-key">Sending platform</span>
                <span className="da-meta-val">{esp_detected}</span>
              </p>
            )}
            {audit.sending_domain && (
              <p className="da-meta-row">
                <span className="da-meta-key">Sending domain</span>
                <span className="da-meta-val">{audit.sending_domain}</span>
              </p>
            )}
            <p className="da-meta-row">
              <span className="da-meta-key">Issues found</span>
              <span className="da-meta-val da-meta-issues" data-issues={issues}>
                {issues} {issues === 1 ? "issue" : "issues"}
              </span>
            </p>
          </div>
        </div>

        {/* Check results */}
        <CheckGrid results={results} isPremium={isPremium} />

        {/* Upgrade CTA (free tier only) */}
        {!isPremium && (
          <div className="da-upgrade-cta">
            <div className="da-upgrade-cta-inner">
              <h2>See exactly what&apos;s costing you inbox placement</h2>
              <p>
                The full report explains every issue in plain English, gives you
                specific fix steps, and estimates the revenue impact based on your
                list size. One-off $9. Takes 30 seconds to unlock.
              </p>
              <ul className="da-upgrade-list">
                <li>Plain-English explanation of each failure</li>
                <li>Specific DNS records and settings to fix</li>
                <li>Revenue impact estimate for your list size</li>
                <li>Re-test in 30 days to verify fixes</li>
                <li>PDF report to share with your team</li>
              </ul>
              <Link
                href={`/tools/deliverability-audit/upgrade/${audit.id}`}
                className="btn btn-primary btn-lg"
              >
                Unlock full report — $9 →
              </Link>
            </div>
          </div>
        )}

        {/* Re-test link (premium) */}
        {isPremium && (
          <div className="da-retest-cta">
            <p>Fixed something? Re-send to the same address to re-check.</p>
            <Link
              href={`/tools/deliverability-audit/retest/${audit.id}`}
              className="btn btn-ghost"
            >
              Re-test →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
