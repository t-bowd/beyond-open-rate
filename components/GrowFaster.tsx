"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

// Real, sourced, outcome-level stats — not internal/vanity metrics
// (no open rate, no BOR-only numbers) and no jargon metric names.
const STATS = [
  {
    target: 36,
    prefix: "$",
    suffix: "",
    label: "Returned for every $1 spent on email, the highest ROI of any marketing channel.",
  },
  {
    target: 40,
    prefix: "",
    suffix: "%",
    label: "Of total revenue at well-run e-commerce brands comes from email alone.",
  },
  {
    target: 320,
    prefix: "",
    suffix: "%",
    label: "More revenue from automated flows than one-off broadcast sends.",
  },
  {
    target: 72,
    prefix: "",
    suffix: "hrs",
    label: "From kickoff to your first automated flow live and earning.",
  },
];

type StatProps = {
  target: number;
  prefix: string;
  suffix: string;
  label: string;
};

function StatCard({ target, prefix, suffix, label }: StatProps) {
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
        setDisplay(prefix + Math.round(target * eased) + suffix);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(prefix + target + suffix);
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
  }, [target, prefix, suffix]);

  return (
    <Reveal className="grow-stat-card">
      <div className="grow-stat-num" ref={ref}>{display}</div>
      <p className="grow-stat-label">{label}</p>
    </Reveal>
  );
}

export default function GrowFaster() {
  return (
    <section className="section grow-faster" data-screen-label="Grow faster">
      <div className="wrap grow-faster-inner">
        <Reveal as="h2" className="display-huge">
          Grow faster, without the guesswork
        </Reveal>
        <Reveal as="p" className="grow-faster-sub">
          Most brands treat email like an afterthought and leave real money
          on the table. Done properly, it&apos;s the highest-return channel
          you have, here&apos;s what the data says.
        </Reveal>
      </div>
      <div className="wrap grow-stat-grid">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
