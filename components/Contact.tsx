"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "./Reveal";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState({ name: "", email: "", site: "", msg: "" });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const site = searchParams.get("site");
    if (site) setValues((v) => ({ ...v, site }));
  }, [searchParams]);

  const set =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setInvalid((iv) => ({ ...iv, [key]: false }));
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      name: !values.name.trim(),
      email: !emailRe.test(values.email.trim()),
      site: !values.site.trim(),
    };
    setInvalid(next);
    if (!next.name && !next.email && !next.site) {
      // TODO: POST to /api/lead (Step 3)
      setSent(true);
    }
  };

  return (
    <Reveal className="cta-card">
      <div className="cta-copy">
        <h2>Let&apos;s see what your list can really do.</h2>
        <p>
          Tell us where you&apos;re at. We&apos;ll come back within one
          business day with a free teardown and where we&apos;d start.
        </p>
        <ul className="cta-list">
          <li>
            <span className="tick">✓</span> A free 20-minute audit of your
            current program
          </li>
          <li>
            <span className="tick">✓</span> No long contracts — month to month
          </li>
          <li>
            <span className="tick">✓</span> Talk to the people who&apos;ll do
            the work
          </li>
        </ul>
      </div>
      <div>
        {sent ? (
          <div className="form-ok">
            <h3>Got it — thanks, {values.name.split(" ")[0]}.</h3>
            <p>
              We&apos;ll be in touch within one business day with your free
              teardown.
            </p>
          </div>
        ) : (
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
            <button type="submit" className="btn btn-primary btn-lg">
              Request my free audit
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
