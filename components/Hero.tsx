"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<"default" | "error">("default");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setNote("error");
      return;
    }
    // Prefill the email field in the contact form below and scroll to it
    window.dispatchEvent(new CustomEvent<string>("bor:prefill", { detail: v }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("c-name")?.focus(), 600);
  };

  return (
    <section className="hero" data-screen-label="Hero">
      <div className="wrap hero-inner">
        <Reveal as="h1">
          Grow your business with <span className="accent">email</span>.
        </Reveal>
        <Reveal as="p" className="hero-sub">
          Email marketing, lifecycle and automation — built to turn your list
          into a predictable, compounding revenue channel.
        </Reveal>

        <Reveal as="form" className="audit-form" id="hero-audit" onSubmit={submit} noValidate>
          <span className="icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <input
            type="email"
            id="heroEmail"
            name="email"
            placeholder="your@email.com"
            aria-label="Your email address"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (note === "error") setNote("default");
            }}
          />
          <button type="submit" className="btn btn-primary">
            Book a chat
          </button>
        </Reveal>

        <Reveal as="p" className="audit-note">
          {note === "error" ? (
            <span className="form-error">
              ↑ Enter your email and we&apos;ll be in touch.
            </span>
          ) : (
            <>
              <span>✦</span>
              <span>
                Free, no-obligation chat.{" "}
                <b>We&apos;ll respond within one business day.</b>
              </span>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
