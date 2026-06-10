// ── Check results ─────────────────────────────────────────────────────────────

export type CheckStatus = "pass" | "warning" | "fail" | "unknown";

export type CheckResult = {
  status: CheckStatus;
  detail?: string; // short factual string, e.g. "via include:_spf.klaviyo.com"
};

export type AuditResults = {
  spf: CheckResult;
  dkim: CheckResult & { signing_domain?: string };
  dmarc: CheckResult & { policy?: "none" | "quarantine" | "reject" };
  blacklist: CheckResult & { listed_on?: string[]; checked?: number };
  ip_type: CheckResult & { type?: "shared" | "dedicated" | "unknown" };
  esp: CheckResult & { name?: string };
  tls: CheckResult;
  ptr: CheckResult;
  reply_to_mismatch: CheckResult;
  subject_spam: CheckResult & { triggers?: string[] };
  html_text_ratio: CheckResult;
  list_unsubscribe: CheckResult;
  one_click_unsubscribe: CheckResult;
};

// ── Raw inbound email (stored temporarily until Edge Function processes it) ──

export type RawEmail = {
  to: string;
  from: string;
  subject: string;
  sending_ip: string;
  headers: Record<string, string | string[]>;
  html: string | null;
  text: string | null;
};

// ── Full audit record ─────────────────────────────────────────────────────────

export type AuditStatus = "pending" | "processing" | "complete" | "expired";
export type AuditTier = "free" | "premium";
export type AuditGrade = "A" | "B" | "C" | "D" | "F";

export type DeliverabilityAudit = {
  id: string;
  name: string;
  email: string;
  inbound_address: string;
  status: AuditStatus;
  tier: AuditTier;
  results: AuditResults | null;
  raw_email: RawEmail | null;
  score: number | null;
  grade: AuditGrade | null;
  sending_domain: string | null;
  sending_ip: string | null;
  esp_detected: string | null;
  list_size: string | null;
  send_frequency: string | null;
  revenue_per_email: string | null;
  stripe_payment_intent: string | null;
  pdf_path: string | null;
  created_at: string;
  completed_at: string | null;
  expires_at: string;
};

// ── UI helpers ────────────────────────────────────────────────────────────────

export type CheckMeta = {
  key: keyof AuditResults;
  label: string;
  category: "Authentication" | "Infrastructure" | "Content signals";
};

export const CHECKS: CheckMeta[] = [
  { key: "spf",                 label: "SPF",                      category: "Authentication" },
  { key: "dkim",                label: "DKIM",                     category: "Authentication" },
  { key: "dmarc",               label: "DMARC policy",             category: "Authentication" },
  { key: "blacklist",           label: "Blacklist check",          category: "Infrastructure" },
  { key: "ip_type",             label: "Sending IP type",          category: "Infrastructure" },
  { key: "esp",                 label: "Sending platform",         category: "Infrastructure" },
  { key: "tls",                 label: "TLS in transit",           category: "Infrastructure" },
  { key: "ptr",                 label: "Reverse DNS (PTR)",        category: "Infrastructure" },
  { key: "reply_to_mismatch",   label: "Reply-to alignment",       category: "Content signals" },
  { key: "subject_spam",        label: "Subject line",             category: "Content signals" },
  { key: "html_text_ratio",     label: "Plain text version",       category: "Content signals" },
  { key: "list_unsubscribe",    label: "List-Unsubscribe header",  category: "Content signals" },
  { key: "one_click_unsubscribe", label: "One-click unsubscribe",  category: "Content signals" },
];

export function issueCount(results: AuditResults): number {
  return Object.values(results).filter(
    (r) => (r as CheckResult).status === "fail" || (r as CheckResult).status === "warning"
  ).length;
}

export function gradeColour(grade: AuditGrade | null): string {
  switch (grade) {
    case "A": return "var(--grade-a)";
    case "B": return "var(--grade-b)";
    case "C": return "var(--grade-c)";
    case "D": return "var(--grade-d)";
    case "F": return "var(--grade-f)";
    default:  return "var(--ink-faint)";
  }
}
