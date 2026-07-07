"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  platformOptions,
  budgetOptions,
  timelineOptions,
  formatRevenue,
} from "@/lib/quiz/strategy-session";
import { track } from "@/lib/analytics";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEP_IDS = [
  "name",
  "email",
  "website",
  "platform",
  "budget",
  "current_revenue",
  "target_revenue",
  "obstacle",
  "timeline",
] as const;
type StepId = (typeof STEP_IDS)[number];

type Values = {
  name: string;
  email: string;
  website: string;
  platform: string;
  budget: string;
  current_revenue: number;
  target_revenue: number;
  obstacle: string;
  timeline: string;
  _hp: string;
};

const initialValues: Values = {
  name: "",
  email: "",
  website: "",
  platform: "",
  budget: "",
  current_revenue: 0,
  target_revenue: 0,
  obstacle: "",
  timeline: "",
  _hp: "",
};

type Phase = "intro" | "steps" | "submitting" | "done";

export default function StrategySession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Values>(() => ({
    ...initialValues,
    email: searchParams.get("email") ?? "",
  }));
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const stepId: StepId = STEP_IDS[stepIndex];
  const firstName = values.name.trim().split(/\s+/)[0] || "";

  const canAdvance = useMemo(() => {
    switch (stepId) {
      case "name":
        return values.name.trim().length > 0;
      case "email":
        return emailRe.test(values.email.trim());
      case "website":
        return values.website.trim().length > 0;
      case "platform":
        return values.platform.length > 0;
      case "budget":
        return values.budget.length > 0;
      case "current_revenue":
      case "target_revenue":
        return true;
      case "obstacle":
        return values.obstacle.trim().length > 0;
      case "timeline":
        return values.timeline.length > 0;
      default:
        return false;
    }
  }, [stepId, values]);

  function start() {
    track("strategy_session_start");
    setPhase("steps");
    setStepIndex(0);
  }

  function back() {
    setError(null);
    if (stepIndex === 0) {
      setPhase("intro");
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  async function next() {
    setError(null);
    if (!canAdvance) {
      if (stepId === "email") setError("Enter a valid email address.");
      return;
    }
    track("strategy_session_step", { step: stepId, step_number: stepIndex + 1 });
    if (stepIndex < STEP_IDS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    await submit();
  }

  async function submit() {
    setPhase("submitting");
    setServerError(null);
    track("strategy_session_complete");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "strategy-session",
          name: values.name,
          email: values.email,
          website: values.website,
          payload: {
            platform: values.platform,
            budget: values.budget,
            currentRevenue: values.current_revenue,
            targetRevenue: values.target_revenue,
            obstacle: values.obstacle,
            timeline: values.timeline,
          },
          _hp: values._hp,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        track("lead_error", { source: "strategy-session", error: json.error ?? String(res.status) });
        setServerError(
          res.status === 429
            ? "A few too many tries — give it a minute and try again."
            : "Something went wrong on our end. Try again, or email hello@beyondopenrate.com.au.",
        );
        setStepIndex(STEP_IDS.length - 1);
        setPhase("steps");
        return;
      }
      track("lead_success", { source: "strategy-session" });
      router.push("/thank-you");
    } catch {
      track("lead_error", { source: "strategy-session", error: "network" });
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setStepIndex(STEP_IDS.length - 1);
      setPhase("steps");
    }
  }

  const progress = ((stepIndex + 1) / STEP_IDS.length) * 100;

  return (
    <div className="quiz strategy-quiz">
      {phase === "intro" && (
        <div className="quiz-card strategy-intro">
          <span className="strategy-wave" aria-hidden="true">👋</span>
  
          <h1 className="strategy-headline">Free 30-minute strategy session (valued at $500)</h1>
          <p className="strategy-sub">
            If you’re serious about finding out where your email program is costing you money, then this session is for you. No obligation, 100% free, PLUS strategies to implement first.
<br /><br />
Session availability is limited, claim yours now or join the waitlist.

          </p>
          <button className="btn btn-primary btn-lg btn-arrow" onClick={start}>
            Get started
            <svg className="btn-arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
          <p className="audit-note-stars">
            {/*<span aria-hidden="true">★★★★★</span> 5.0 stars from 100 reviews*/}
          </p>
        </div>
      )}

      {phase !== "intro" && (
        <>
          <div className="strategy-dots" aria-hidden="true">
            {STEP_IDS.map((id, i) => (
              <span className="strategy-dot-wrap" key={id}>
                <span className={`strategy-dot ${i <= stepIndex ? "active" : ""}`} />
                {i < STEP_IDS.length - 1 && (
                  <span className={`strategy-dot-line ${i < stepIndex ? "active" : ""}`} />
                )}
              </span>
            ))}
          </div>

          <div className="quiz-card strategy-card">
            {stepId === "name" && (
              <>
                <h2 className="strategy-prompt">What&apos;s your name?</h2>
                <input
                  className="strategy-input"
                  type="text"
                  placeholder="Enter your first name"
                  autoFocus
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                />
              </>
            )}

            {stepId === "email" && (
              <>
                <h2 className="strategy-prompt">Awesome! What&apos;s your email{firstName ? `, ${firstName}` : ""}?</h2>
                <input
                  className={`strategy-input ${error ? "invalid" : ""}`}
                  type="email"
                  placeholder="you@company.com"
                  autoFocus
                  value={values.email}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, email: e.target.value }));
                    if (error) setError(null);
                  }}
                />
                {error && <span className="err">{error}</span>}
              </>
            )}

            {stepId === "website" && (
              <>
                <h2 className="strategy-prompt">{firstName ? `${firstName}, what's` : "What's"} your website URL?</h2>
                <p className="strategy-help">If you don&apos;t have one, type &quot;don&apos;t have one&quot;</p>
                <input
                  className="strategy-input"
                  type="text"
                  placeholder="yourstore.com"
                  autoFocus
                  value={values.website}
                  onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
                />
              </>
            )}

            {stepId === "platform" && (
              <>
                <h2 className="strategy-prompt">Which platform are you sending email from right now?</h2>
                <div className="strategy-pill-grid">
                  {platformOptions.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`strategy-pill ${values.platform === o.value ? "selected" : ""}`}
                      onClick={() => setValues((v) => ({ ...v, platform: o.value }))}
                    >
                      <span className="strategy-pill-dot" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {stepId === "budget" && (
              <>
                <h2 className="strategy-prompt">What&apos;s your monthly marketing budget?</h2>
                <p className="strategy-help">
                  We ask so we can figure out if we&apos;re a good fit, and what strategies make sense within your budget.
                </p>
                <div className="strategy-pill-grid">
                  {budgetOptions.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`strategy-pill ${values.budget === o.value ? "selected" : ""}`}
                      onClick={() => setValues((v) => ({ ...v, budget: o.value }))}
                    >
                      <span className="strategy-pill-dot" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {(stepId === "current_revenue" || stepId === "target_revenue") && (
              <>
                <h2 className="strategy-prompt">
                  What&apos;s your {stepId === "current_revenue" ? "current" : "TARGET"} monthly revenue?
                </h2>
                <p className="strategy-help">
                  {stepId === "current_revenue"
                    ? "We're asking so we only recommend strategies that'll actually move the needle for you."
                    : "We're asking so we can build you a growth plan to help you get there."}
                </p>
                <div className="strategy-slider">
                  <div className="strategy-slider-value">{formatRevenue(values[stepId])}</div>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={5000}
                    value={values[stepId]}
                    onChange={(e) => setValues((v) => ({ ...v, [stepId]: Number(e.target.value) }))}
                  />
                </div>
              </>
            )}

            {stepId === "obstacle" && (
              <>
                <h2 className="strategy-prompt">
                  {firstName ? `${firstName}, be` : "Be"} honest… what&apos;s the #1 thing holding your email revenue back?
                </h2>
                <p className="strategy-help">
                  Don&apos;t skip the hairy details — the more you tell us, the more useful the call will be.
                </p>
                <textarea
                  className="strategy-textarea"
                  autoFocus
                  value={values.obstacle}
                  onChange={(e) => setValues((v) => ({ ...v, obstacle: e.target.value }))}
                />
              </>
            )}

            {stepId === "timeline" && (
              <>
                <h2 className="strategy-prompt">When are you looking to get started?</h2>
                <div className="strategy-pill-grid">
                  {timelineOptions.map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      className={`strategy-pill ${o.full ? "full" : ""} ${values.timeline === o.value ? "selected" : ""}`}
                      onClick={() => setValues((v) => ({ ...v, timeline: o.value }))}
                    >
                      <span className="strategy-pill-dot" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="ss-hp">Leave blank</label>
              <input
                id="ss-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values._hp}
                onChange={(e) => setValues((v) => ({ ...v, _hp: e.target.value }))}
              />
            </div>

            {serverError && <p className="form-error" role="alert">{serverError}</p>}

            <div className="quiz-actions">
              <button className="btn btn-ghost" onClick={back} disabled={phase === "submitting"}>
                ← Back
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={next}
                disabled={!canAdvance || phase === "submitting"}
              >
                {phase === "submitting"
                  ? "Sending…"
                  : stepIndex === STEP_IDS.length - 1
                    ? "Book my session →"
                    : "Continue →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
