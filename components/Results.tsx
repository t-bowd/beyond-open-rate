"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

// Industry authority stats — sourced from Litmus, DMA, and Klaviyo benchmark data.
// These are well-established published figures, not personal client claims.
const STATS = [
  {
    target: 36,
    decimals: 0,
    prefix: "$",
    suffix: "",
    label: "returned for every $1 invested in email marketing — the highest ROI of any digital channel",
    source: "Litmus / DMA",
  },
  {
    target: 40,
    decimals: 0,
    prefix: "",
    suffix: "%",
    label: "of total revenue driven by email at well-optimised e-commerce programs",
    source: "Klaviyo benchmarks",
  },
  {
    target: 14,
    decimals: 0,
    prefix: "",
    suffix: " days",
    label: "from kickoff to your first automated flow going live",
    source: null,
  },
];

type StatProps = {
  target: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  source: string | null;
};

function Stat({ target, decimals, prefix, suffix, label, source }: StatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(prefix + "0" + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const dur = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(prefix + (target * eased).toFixed(decimals) + suffix);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(prefix + target.toFixed(decimals) + suffix);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) { run(); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { run(); io.unobserve(en.target); }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, prefix, suffix]);

  return (
    <Reveal>
      <div className="stat-num" ref={ref}>{display}</div>
      <p className="stat-label">{label}</p>
      {source && <p className="stat-source">Source: {source}</p>}
    </Reveal>
  );
}

export default function Results() {
  return (
    <section className="section results" id="results" data-screen-label="Results">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Email is the highest-ROI channel in digital marketing.</h2>
          <p>
            Most businesses barely scratch the surface of what their list can do.
            Here&apos;s what the data says — and what we aim for.
          </p>
        </Reveal>
        <div className="stat-grid">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
