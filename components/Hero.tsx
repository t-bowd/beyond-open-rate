"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState<"default" | "error">("default");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = url.trim();
    if (!v) {
      setNote("error");
      return;
    }
    // Prefill the contact form below and scroll to it
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
          Email marketing, lifecycle and automation for e-commerce and SaaS
          brands — built to turn quiet subscribers into predictable, repeat
          revenue.
        </Reveal>

        <Reveal as="form" className="audit-form" id="hero-audit" onSubmit={submit} noValidate>
          <span className="icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <input
            type="text"
            id="auditUrl"
            name="url"
            placeholder="yourstore.com"
            aria-label="Your website"
            autoComplete="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
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
              ↑ Pop your website in first and we&apos;ll have a look.
            </span>
          ) : (
            <>
              <span>✦</span>
              <span>
                Free, no-obligation chat.{" "}
                <b>You talk to the people who do the work.</b>
              </span>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
