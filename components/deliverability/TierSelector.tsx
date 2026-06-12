"use client";

import { useState } from "react";

export default function TierSelector() {
  const [selected, setSelected] = useState<"free" | "full">("free");

  return (
    <div className="da-tier-selector">
      <div className="da-tier-tabs">
        <button
          type="button"
          className={`da-tier-tab${selected === "free" ? " da-tier-tab--active" : ""}`}
          onClick={() => setSelected("free")}
        >
          Free
        </button>
        <button
          type="button"
          className={`da-tier-tab${selected === "full" ? " da-tier-tab--active" : ""}`}
          onClick={() => setSelected("full")}
        >
          Full report <span className="da-tier-tab-price">$9</span>
        </button>
      </div>

      <div className="da-tier-panels">
        <div className={`da-tier-panel${selected === "free" ? " da-tier-panel--active" : ""}`}>
          <ul className="da-tier-list">
            <li>Overall score (0–100) and grade</li>
            <li>Pass / fail for each of the 13 checks</li>
            <li>Sending platform identified</li>
            <li>Issue count summary</li>
          </ul>
          <p className="da-tier-footnote">No account. No credit card. Takes 2 minutes.</p>
        </div>

        <div className={`da-tier-panel${selected === "full" ? " da-tier-panel--active" : ""}`}>
          <ul className="da-tier-list">
            <li>Everything in free</li>
            <li>Plain-English explanation of every issue</li>
            <li>Specific fix steps for every failure</li>
            <li>Revenue impact estimate based on your list size</li>
            <li>Industry benchmarks per issue</li>
            <li>Re-test link — same address active for 30 days</li>
            <li>Shareable PDF for your dev or agency</li>
          </ul>
          <p className="da-tier-footnote">Unlock after your free audit for $9 — one-time, no subscription.</p>
        </div>
      </div>
    </div>
  );
}
