"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";

const WaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7.5 4.5 C7.5 3.1 8.6 2 10 2 C11.4 2 12.5 3.1 12.5 4.5 L12.5 12" />
    <path d="M12.5 7 C12.5 5.6 13.6 4.5 15 4.5 C16.4 4.5 17.5 5.6 17.5 7 L17.5 12" />
    <path d="M17.5 9.5 C17.5 8.1 18.6 7 20 7 C21.4 7 22.5 8.1 22.5 9.5 L22.5 14 C22.5 18.6 18.9 22 14.5 22 L13 22 C10.6 22 8.4 21 6.8 19.3 L2.3 14.5 C1.4 13.5 1.5 12 2.5 11.1 C3.4 10.3 4.8 10.3 5.7 11.2 L7.5 13" />
    <path d="M7.5 4.5 L7.5 13" />
  </svg>
);

const VIDEOS = ["/hero-bg1.mp4", "/hero-bg.mp4", "/hero-bg2.mp4"];

export default function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState<"default" | "error">("default");
  const [placeholder, setPlaceholder] = useState("Enter your email and let's talk revenue…");

  useEffect(() => {
    if (window.innerWidth < 640) setPlaceholder("Enter your email and let's talk");
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idxRef = useRef(0);

  const advance = useCallback(() => {
    idxRef.current = (idxRef.current + 1) % VIDEOS.length;
    const v = videoRef.current;
    if (!v) return;
    v.src = VIDEOS[idxRef.current];
    v.load();
    v.play().catch(() => {});
  }, []);

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
        ref={videoRef}
        src={VIDEOS[0]}
        className="hero-bg"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={advance}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="wrap hero-inner">
        <Reveal as="h1" className="hero-shout">
          Your emails <span className="highlight">owe you money</span>.
        </Reveal>
        <Reveal as="p" className="hero-sub">
          The money in your email program isn't going to find itself. We make it simpler, faster and genuinely profitable.
        </Reveal>

        <Reveal as="form" className="audit-form" id="hero-audit" onSubmit={submit} noValidate>
          <span className="icon" aria-hidden="true"><WaveIcon /></span>
          <input
            type="email"
            id="heroEmail"
            name="email"
            placeholder={placeholder}
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
            <ArrowIcon />
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
            <p className="audit-note-witty">We won't ghost you. Unlike your unengaged subscribers.</p>
            <p className="audit-note-stars">
              {/* <span aria-hidden="true">★★★★★</span> 5.0 stars from 100 reviews */}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
