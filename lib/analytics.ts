type EventName =
  | "lead_submit"
  | "lead_success"
  | "lead_error"
  | "audit_quiz_start"
  | "audit_quiz_complete"
  | "audit_full_requested"
  | "cta_click";

type EventProps = Record<string, string | number | boolean | null | undefined>;

export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...props });
  }
}
