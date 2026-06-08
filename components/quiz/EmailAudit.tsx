"use client";

import { useMemo, useState } from "react";
import {
  questions,
  scoreAnswers,
  type Answers,
  type ScoreResult,
} from "@/lib/quiz/email-audit";
import { track } from "@/lib/analytics";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Phase = "intro" | "questions" | "gate" | "results" | "submitting";

export default function EmailAudit() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hp, setHp] = useState(""); // honeypot
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const q = questions[step];
  const total = questions.length;
  const progress = phase === "questions" ? ((step + 1) / (total + 1)) * 100 :
    phase === "gate" ? ((total) / (total + 1)) * 100 + (1 / (total + 1)) * 50 :
    phase === "results" ? 100 : 0;

  const canAdvance = useMemo(() => {
    if (!q) return false;
    const v = answers[q.id];
    if (q.kind === "multi") return Array.isArray(v) && v.length > 0;
    if (q.kind === "single") return typeof v === "string" && v.length > 0;
    if (q.kind === "text") return true; // optional
    return false;
  }, [answers, q]);

  function start() {
    track("audit_quiz_start");
    setPhase("questions");
    setStep(0);
  }

  function setSingle(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }
  function toggleMulti(id: string, value: string) {
    setAnswers((a) => {
      const cur = Array.isArray(a[id]) ? (a[id] as string[]) : [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...a, [id]: next };
    });
  }
  function setText(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function next() {
    if (step < total - 1) setStep(step + 1);
    else setPhase("gate");
  }
  function back() {
    if (phase === "gate") setPhase("questions");
    else if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setEmailError(null);
    setServerError(null);
    if (!emailRe.test(email.trim())) {
      setEmailError("Enter a valid email so we can send you the results.");
      return;
    }
    setPhase("submitting");
    track("audit_quiz_complete");

    const scored = scoreAnswers(answers);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "tool:email-audit",
          email,
          name: name || undefined,
          phone: phone || undefined,
          company: company || undefined,
          company_size: companySize || undefined,
          payload: {
            answers,
            score: scored.score,
            maxScore: scored.maxScore,
            tier: scored.tier,
          },
          _hp: hp,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: string };
      if (!res.ok || !json.ok) {
        track("lead_error", { source: "tool:email-audit", error: json.error ?? String(res.status) });
        setServerError(
          res.status === 429
            ? "A few too many tries — give it a minute and try again."
            : "Something went wrong saving your results. Try again, or email hello@beyondopenrate.com.au.",
        );
        setPhase("gate");
        return;
      }
      track("lead_success", { source: "tool:email-audit", tier: scored.tier });
      setLeadId(json.id ?? null);
      setResult(scored);
      setPhase("results");
    } catch {
      track("lead_error", { source: "tool:email-audit", error: "network" });
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setPhase("gate");
    }
  }

  async function requestAudit() {
    if (leadId) {
      fetch(`/api/lead/${leadId}`, { method: "PATCH" }).catch(() => {});
    }
    track("audit_full_requested", { tier: result?.tier });
    // TODO: replace with real Calendly URL when available
    window.open("https://calendly.com/beyondopenrate/30min", "_blank");
  }

  return (
    <div className="quiz">
      <div className="quiz-progress" aria-hidden="true">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {phase === "intro" && (
        <div className="quiz-card">
          <h2>Email program audit</h2>
          <p>
            Find your revenue killers in minutes with our free audit, PLUS get 5 instant recommendations to improve your email marketing results.
          </p>
          <ul className="quiz-bullets">
            <li>How to make money while you sleep — emails that work even when you&apos;re not</li>
            <li>How to deliver hot messages to your hot audience</li>
            <li>Sending to your whole list works, right? Wrong!</li>
            <li>The truth about landing in the inbox</li>
            <li>Have you been doing authentication wrong? Or at all?!</li>
            <li>Have you been tracking metrics wrong? (And it really does matter)</li>
          </ul>
          <button className="btn btn-primary btn-lg" onClick={start}>
            Start the audit →
          </button>
        </div>
      )}

      {phase === "questions" && q && (
        <div className="quiz-card">
          <p className="quiz-meta">
            QUESTION {step + 1} OF {total}
          </p>
          <h2 className="quiz-prompt">{q.prompt}</h2>
          {q.help && <p className="quiz-help">{q.help}</p>}

          {q.kind === "single" && (
            <ul className="quiz-options">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      className={`quiz-option ${selected ? "selected" : ""}`}
                      onClick={() => setSingle(q.id, o.value)}
                    >
                      {o.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q.kind === "multi" && (
            <ul className="quiz-options">
              {q.options.map((o) => {
                const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                const selected = cur.includes(o.value);
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      className={`quiz-option ${selected ? "selected" : ""}`}
                      onClick={() => toggleMulti(q.id, o.value)}
                    >
                      <span className="quiz-check" aria-hidden="true">
                        {selected ? "✓" : ""}
                      </span>
                      {o.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q.kind === "text" && (
            <textarea
              className="quiz-textarea"
              placeholder={q.placeholder}
              value={(answers[q.id] as string) ?? ""}
              onChange={(e) => setText(q.id, e.target.value)}
              rows={4}
            />
          )}

          <div className="quiz-actions">
            {step > 0 && (
              <button className="btn btn-ghost" onClick={back}>
                ← Back
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={next}
              disabled={!canAdvance}
            >
              {step === total - 1 ? "See my results →" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {(phase === "gate" || phase === "submitting") && (
        <div className="quiz-card">
          <p className="quiz-meta">LAST STEP</p>
          <h2>Almost there.</h2>
          <p>
            Enter your details and we&apos;ll show your score and recommendations right here.
          </p>

          <div className="quiz-form">
            <div className="quiz-form-row">
              <div className="field">
                <label htmlFor="qz-name">Name <span className="field-optional">(optional)</span></label>
                <input id="qz-name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={`field ${emailError ? "invalid" : ""}`}>
                <label htmlFor="qz-email">Email</label>
                <input
                  id="qz-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                />
                {emailError && <span className="err">{emailError}</span>}
              </div>
            </div>
            <div className="quiz-form-row">
              <div className="field">
                <label htmlFor="qz-phone">Phone <span className="field-optional">(optional)</span></label>
                <input id="qz-phone" type="tel" placeholder="+61 4XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="qz-company">Business name <span className="field-optional">(optional)</span></label>
                <input id="qz-company" type="text" placeholder="Your business" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="qz-size">Team / business size <span className="field-optional">(optional)</span></label>
              <select id="qz-size" className="quiz-select" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                <option value="">Select…</option>
                <option value="solo">Just me</option>
                <option value="2-10">2–10 people</option>
                <option value="11-50">11–50 people</option>
                <option value="51-200">51–200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </div>
            {/* honeypot */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="qz-hp">Leave blank</label>
              <input id="qz-hp" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </div>
            {serverError && (
              <p className="form-error" role="alert">
                {serverError}
              </p>
            )}
          </div>

          <div className="quiz-actions">
            <button className="btn btn-ghost" onClick={back} disabled={phase === "submitting"}>
              ← Back
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={submit}
              disabled={phase === "submitting"}
            >
              {phase === "submitting" ? "Scoring…" : "See my results →"}
            </button>
          </div>
        </div>
      )}

      {phase === "results" && result && (
        <div className="quiz-card quiz-results">
          <p className="quiz-meta">YOUR AUDIT</p>
          <div className="quiz-score">
            <div className="quiz-score-num">
              {result.score}
              <span>/{result.maxScore}</span>
            </div>
            <div>
              <h2 className="quiz-tier">{result.tierLabel}</h2>
              <p>{result.tierBlurb}</p>
            </div>
          </div>

          <h3>What we&apos;d do first</h3>
          <ul className="quiz-recs">
            {result.recommendations.map((r) => (
              <li key={r.title}>
                <h4>{r.title}</h4>
                <p>{r.body}</p>
              </li>
            ))}
          </ul>

          <div className="quiz-cta">
            <p>
              Want to know what these gaps are actually costing you?
              Book a free 30-minute call. No pitch, just the specifics.
            </p>
            <button className="btn btn-primary btn-lg" onClick={requestAudit}>
              Book a free 30-min call →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
