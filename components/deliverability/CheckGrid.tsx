import type { AuditResults, CheckStatus } from "@/lib/deliverability/types";
import { CHECKS } from "@/lib/deliverability/types";

type Props = {
  results: AuditResults;
  isPremium: boolean;
};

const STATUS_LABELS: Record<CheckStatus, string> = {
  pass:    "Pass",
  warning: "Warning",
  fail:    "Fail",
  unknown: "Unknown",
};

function StatusBadge({ status }: { status: CheckStatus }) {
  return (
    <span className={`da-badge da-badge-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const CATEGORIES = ["Authentication", "Infrastructure", "Content signals"] as const;

export default function CheckGrid({ results, isPremium }: Props) {
  return (
    <div className="da-checks">
      {CATEGORIES.map((cat) => {
        const checks = CHECKS.filter((c) => c.category === cat);
        return (
          <div key={cat} className="da-check-group">
            <h3 className="da-check-category">{cat}</h3>
            <ul className="da-check-list">
              {checks.map(({ key, label }) => {
                const result = results[key] as { status: CheckStatus; detail?: string };
                return (
                  <li key={key} className="da-check-row">
                    <span className="da-check-label">{label}</span>
                    <span className="da-check-right">
                      {isPremium && result.detail && (
                        <span className="da-check-detail">{result.detail}</span>
                      )}
                      <StatusBadge status={result.status} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
