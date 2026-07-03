"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import AccentStripes from "./AccentStripes";

export default function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<"default" | "error">("default");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setNote("error");
      return;
    }
    // Hand off into the strategy session flow with the email pre-filled —
    // nothing is saved as a lead until they actually complete (or at
    // least reach) that funnel.
    router.push(`/strategy-session?email=${encodeURIComponent(v)}`);
  };

  return (
    <section className="hero hero-video" data-screen-label="Hero">
      <video
        className="hero-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />
      <AccentStripes corner="tr" />

      <div className="wrap hero-inner">
        <Reveal as="h1" className="hero-shout">
          Emails that print money
        </Reveal>
        <Reveal as="p" className="hero-sub">
          Email marketing is hard to get right. We make it simpler,
          faster, and genuinely profitable.
        </Reveal>

        <Reveal as="form" className="audit-form" id="hero-audit" onSubmit={submit} noValidate>
          <span className="icon" aria-hidden="true">📧</span>
          <input
            type="email"
            id="heroEmail"
            name="email"
            placeholder="Enter your email and we'll start printing…"
            aria-label="Your email address"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (note === "error") setNote("default");
            }}
          />
          <button type="submit" className="btn btn-primary btn-arrow">
            Let&apos;s go
            <svg className="btn-arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </Reveal>

        {note === "error" ? (
          <Reveal as="p" className="audit-note">
            <span className="form-error">
              ↑ Enter your email and we&apos;ll be in touch.
            </span>
          </Reveal>
        ) : (
          <Reveal as="div" className="audit-note-split">
            <p className="audit-note-witty">No awkward sales pitch. Just a real reply.</p>
            <p className="audit-note-stars">
              <span aria-hidden="true">★★★★★</span> 5.0 stars from 100 reviews
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
