"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import { track } from "@/lib/analytics";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", site: "", msg: "", company: "" });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Prefill email field when Hero form fires the bor:prefill event
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, email: detail || v.email }));
    };
    window.addEventListener("bor:prefill", onPrefill);
    return () => window.removeEventListener("bor:prefill", onPrefill);
  }, []);

  const set =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setInvalid((iv) => ({ ...iv, [key]: false }));
      if (serverError) setServerError(null);
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      name: !values.name.trim(),
      email: !emailRe.test(values.email.trim()),
      site: !values.site.trim(),
    };
    setInvalid(next);
    if (next.name || next.email || next.site) return;

    setSubmitting(true);
    setServerError(null);
    track("lead_submit", { source: "contact-form" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "contact-form",
          name: values.name,
          email: values.email,
          website: values.site,
          message: values.msg || undefined,
          company: values.company,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        track("lead_error", { source: "contact-form", error: json.error ?? String(res.status) });
        setServerError(
          res.status === 429
            ? "A few too many tries — give it a minute and try again."
            : "Something went wrong on our end. Try again, or email hello@beyondopenrate.com.au.",
        );
        return;
      }
      track("lead_success", { source: "contact-form" });
      router.push("/thank-you");
    } catch {
      track("lead_error", { source: "contact-form", error: "network" });
      setServerError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section cta" id="contact" data-screen-label="Contact">
      <div className="wrap">
        <Reveal className="cta-card">
          <div className="cta-copy">
            <h2>Let&apos;s have a chat.</h2>
            <p>
              Tell us a bit about your business and where email is at. We&apos;ll
              come back to you within one business day.
            </p>
            <ul className="cta-list">
              <li><span className="tick">✓</span> Free, no-obligation chat</li>
              <li><span className="tick">✓</span> You talk to the people who do the work</li>
              <li><span className="tick">✓</span> We&apos;ll respond within one business day</li>
            </ul>
          </div>
          <div>
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className={`field ${invalid.name ? "invalid" : ""}`}>
                <label htmlFor="c-name">Name</label>
                <input id="c-name" type="text" placeholder="Your name" value={values.name} onChange={set("name")} />
                <span className="err">Please tell us your name.</span>
              </div>
              <div className={`field ${invalid.email ? "invalid" : ""}`}>
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" placeholder="you@company.com" value={values.email} onChange={set("email")} />
                <span className="err">Enter a valid email address.</span>
              </div>
              <div className={`field ${invalid.site ? "invalid" : ""}`}>
                <label htmlFor="c-site">Website</label>
                <input id="c-site" type="text" placeholder="yourstore.com" value={values.site} onChange={set("site")} />
                <span className="err">Where can we find you?</span>
              </div>
              <div className="field">
                <label htmlFor="c-msg">What&apos;s on your mind?</label>
                <textarea id="c-msg" placeholder="A line or two about your email setup today…" value={values.msg} onChange={set("msg")} />
              </div>
              {/* honeypot */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="c-company">Company (leave blank)</label>
                <input id="c-company" type="text" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
              </div>
              {serverError && (
                <p className="form-error" role="alert" style={{ marginBottom: 12 }}>{serverError}</p>
              )}
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? "Sending…" : "Book a chat"}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
