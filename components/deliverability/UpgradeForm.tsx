"use client";

import { useState, type FormEvent } from "react";

type Props = { auditId: string };

export default function UpgradeForm({ auditId }: Props) {
  const [listSize, setListSize] = useState("");
  const [frequency, setFrequency] = useState("");
  const [revenuePerEmail, setRevenuePerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/deliverability/upgrade/${auditId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          list_size: listSize,
          send_frequency: frequency,
          revenue_per_email: revenuePerEmail || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong — please try again.");
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form className="da-upgrade-form" onSubmit={handleSubmit}>
      <p className="da-upgrade-intro">
        Two quick questions to personalise your revenue impact estimate.
      </p>

      <label className="da-field">
        <span>Approximate list size</span>
        <select value={listSize} onChange={(e) => setListSize(e.target.value)} required>
          <option value="">Select…</option>
          <option value="<1k">Under 1,000</option>
          <option value="1k-10k">1,000 – 10,000</option>
          <option value="10k-50k">10,000 – 50,000</option>
          <option value="50k+">Over 50,000</option>
        </select>
      </label>

      <label className="da-field">
        <span>How often do you send campaigns?</span>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} required>
          <option value="">Select…</option>
          <option value="weekly">About weekly</option>
          <option value="fortnightly">Every couple of weeks</option>
          <option value="monthly">Roughly monthly</option>
        </select>
      </label>

      <label className="da-field">
        <span>Average revenue per email sent <em>(optional)</em></span>
        <input
          type="text"
          value={revenuePerEmail}
          onChange={(e) => setRevenuePerEmail(e.target.value)}
          placeholder="e.g. $2,400 per send"
        />
      </label>

      {error && <p className="da-form-error">{error}</p>}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? "Redirecting to checkout…" : "Unlock full report for $9 →"}
      </button>

      <p className="da-form-note">
        One-off payment. No subscription. Includes re-test access for 30 days.
      </p>
    </form>
  );
}
