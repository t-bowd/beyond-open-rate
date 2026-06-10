"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

type Props = {
  id: string;
  inboundAddress: string;
  initialStatus: string;
  supabaseUrl: string;
};

export default function PendingClient({ id, inboundAddress, initialStatus, supabaseUrl }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    // If already complete when page loads, redirect immediately
    if (status === "complete") {
      router.replace(`/tools/deliverability-audit/report/${id}`);
      return;
    }

    // Subscribe to realtime updates on this audit row
    const channel = supabaseClient(supabaseUrl)
      .channel(`audit-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "deliverability_audits",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const newStatus = payload.new?.status;
          setStatus(newStatus);
          if (newStatus === "complete") {
            router.replace(`/tools/deliverability-audit/report/${id}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient(supabaseUrl).removeChannel(channel);
    };
  }, [id, status, router]);

  function copyAddress() {
    navigator.clipboard.writeText(inboundAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isProcessing = status === "processing";

  return (
    <div className="da-pending">
      <div className="da-pending-step">
        <span className="da-step-num">1</span>
        <div>
          <p className="da-step-label">Open your email platform</p>
          <p className="da-step-sub">
            Go to Klaviyo, Mailchimp, or wherever you send campaigns and create a new email — or open one of your recent sends.
          </p>
        </div>
      </div>

      <div className="da-pending-step">
        <span className="da-step-num">2</span>
        <div>
          <p className="da-step-label">Send it to this address</p>
          <div className="da-address-box">
            <code className="da-address">{inboundAddress}</code>
            <button className="da-copy-btn" onClick={copyAddress} type="button">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="da-step-sub">
            Send it exactly as you would to a real subscriber — don&apos;t use a test send. The audit reads the real headers.
          </p>
        </div>
      </div>

      <div className="da-pending-step">
        <span className="da-step-num">3</span>
        <div>
          <p className="da-step-label">Wait here — your report appears automatically</p>
          <p className="da-step-sub">
            This page updates the moment we receive your email. Usually takes 10–30 seconds after sending.
          </p>
        </div>
      </div>

      <div className="da-waiting-indicator">
        {isProcessing ? (
          <>
            <span className="da-spinner" aria-hidden="true" />
            <span>Running checks…</span>
          </>
        ) : (
          <>
            <span className="da-pulse" aria-hidden="true" />
            <span>Waiting for your email…</span>
          </>
        )}
      </div>
    </div>
  );
}
