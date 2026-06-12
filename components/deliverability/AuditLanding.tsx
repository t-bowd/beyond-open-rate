"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Tier = "free" | "full";

export default function AuditLanding() {
  const [tier, setTier] = useState<Tier>("full");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function selectTier(t: Tier) {
    setTier(t);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/deliverability/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), tier }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong — please try again.");
      }

      const { id } = await res.json();
      router.push(`/tools/deliverability-audit/pending/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="da-landing-flow">
      {/* Tier selector — both always visible */}
      <div className="da-tier-grid">
        <div className={`da-tier-card${tier === "free" ? " da-tier-card--selected" : ""}`}>
          <div className="da-tier-card-head">
            <span className="da-tier-card-name">Free</span>
            <span className="da-tier-card-price">$0</span>
          </div>
          <ul className="da-tier-list">
            <li>Overall score (0–100) and grade</li>
            <li>Pass / fail for all 13 checks</li>
            <li>Sending platform identified</li>
            <li>Issue count summary</li>
          </ul>
          <div className="da-tier-card-foot">
            <p className="da-tier-limit">You&apos;ll see what&apos;s failing — not why or how to fix it.</p>
            <button
              type="button"
              className={`btn btn-secondary da-tier-select-btn${tier === "free" ? " da-tier-select-btn--active" : ""}`}
              onClick={() => selectTier("free")}
            >
              {tier === "free" ? "Selected ✓" : "Select free"}
            </button>
          </div>
        </div>

        <div className={`da-tier-card da-tier-card--premium${tier === "full" ? " da-tier-card--selected" : ""}`}>
          <div className="da-tier-card-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="da-tier-card-name">Full report</span>
              <span className="da-tier-recommended">Recommended</span>
            </div>
            <span className="da-tier-card-price">$9 <span className="da-tier-card-price-note">one-off</span></span>
          </div>
          <ul className="da-tier-list">
            <li>Everything in free</li>
            <li>Plain-English explanation of every issue</li>
            <li>Specific fix steps for every failure</li>
            <li>Revenue impact estimate for your list size</li>
            <li>Industry benchmarks per issue</li>
            <li>Re-test link — address active for 30 days</li>
            <li>Shareable PDF for your dev or agency</li>
          </ul>
          <div className="da-tier-card-foot">
            <p className="da-tier-limit">Run the audit free — unlock the full report for $9 on your results page.</p>
            <button
              type="button"
              className={`btn btn-primary da-tier-select-btn${tier === "full" ? " da-tier-select-btn--active" : ""}`}
              onClick={() => selectTier("full")}
            >
              {tier === "full" ? "Selected ✓" : "Select full report"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form ref={formRef} className="da-form" onSubmit={handleSubmit}>
        <div className="da-form-fields">
          <label className="da-field">
            <span>Your name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              autoComplete="name"
            />
          </label>
          <label className="da-field">
            <span>Your email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@yourbrand.com"
              required
              autoComplete="email"
            />
          </label>
        </div>

        {error && <p className="da-form-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? "Setting up your audit…" : "Run my audit →"}
        </button>

        <p className="da-form-note">
          {tier === "full"
            ? "Your audit runs free — unlock the full report for $9 on your results page. No account needed."
            : "No account required. Your unique address stays active for 30 days."}
        </p>
      </form>
    </div>
  );
}
