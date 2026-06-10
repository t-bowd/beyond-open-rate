import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAuditById } from "@/lib/deliverability/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Re-test your deliverability",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } };

export default async function RetestPage({ params }: Props) {
  const audit = await getAuditById(params.id);
  if (!audit) notFound();

  // Only premium users get re-test
  if (audit.tier !== "premium") {
    redirect(`/tools/deliverability-audit/upgrade/${params.id}`);
  }

  if (audit.status === "expired") {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 600 }}>
          <h1>This audit has expired</h1>
          <p>Re-test access is available for 30 days from the initial audit. Start a new audit below.</p>
          <Link href="/tools/deliverability-audit" className="btn btn-primary" style={{ marginTop: 24 }}>
            Start a new audit →
          </Link>
        </div>
      </section>
    );
  }

  const expiresDate = new Date(audit.expires_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 600 }}>
        <p className="eyebrow">Re-test</p>
        <h1>Send again to re-check</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 8 }}>
          Fixed something? Send another email to the same address. Your report will update automatically.
          This address is active until {expiresDate}.
        </p>

        <div className="da-address-box" style={{ marginTop: 32 }}>
          <code className="da-address">{audit.inbound_address}</code>
        </div>

        <div className="da-retest-steps" style={{ marginTop: 32 }}>
          <p>Make your fixes, send a fresh email to the address above, then check your updated report:</p>
          <Link
            href={`/tools/deliverability-audit/pending/${params.id}`}
            className="btn btn-primary"
            style={{ marginTop: 16, display: "inline-block" }}
          >
            Watch for results →
          </Link>
        </div>
      </div>
    </section>
  );
}
