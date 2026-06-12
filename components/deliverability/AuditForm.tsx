"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AuditForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/deliverability/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
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
    <form className="da-form" onSubmit={handleSubmit}>
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
        Free. No account required. Your unique address stays active for 30 days.
      </p>
    </form>
  );
}
