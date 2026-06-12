import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuditById } from "@/lib/deliverability/db";
import PendingClient from "@/components/deliverability/PendingClient";

export const metadata: Metadata = {
  title: "Waiting for your email — Deliverability audit",
  robots: { index: false, follow: false },
};

// Re-render on every request (status changes server-side)
export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function PendingPage({ params }: Props) {
  const audit = await getAuditById(params.id);
  if (!audit) notFound();

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 680 }}>
        <div className="da-pending-header">
          <h1>Send your email to us</h1>
          <p className="da-pending-sub">
            Open your email platform, grab one of your real campaign emails,
            and send it to the address below. Your report appears here automatically.
          </p>
        </div>

        <PendingClient
          id={audit.id}
          inboundAddress={audit.inbound_address}
          initialStatus={audit.status}
          supabaseUrl={process.env.SUPABASE_URL!}
        />

        <div className="da-pending-faq">
          <details>
            <summary>Which email should I send?</summary>
            <p>
              Any recent broadcast or flow email from your ESP. The more representative
              of your normal sends the better — use the same &ldquo;send from&rdquo; address
              you normally use, not a test address.
            </p>
          </details>
          <details>
            <summary>Why not a test send?</summary>
            <p>
              Most ESPs strip or modify headers on test sends. The audit reads authentication
              results, relay chain, and content headers — all of which need to come from a
              real send to be accurate.
            </p>
          </details>
          <details>
            <summary>How long does it take?</summary>
            <p>
              10–30 seconds after your email arrives. This page updates automatically —
              no need to refresh.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
