"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const STATS = [
  { target: 2.4, decimals: 1, suffix: "×", label: "average lift in revenue from email within the first quarter" },
  { target: 32, decimals: 0, suffix: "%", label: "of total revenue driven by email & automation flows" },
  { target: 14, decimals: 0, suffix: " days", label: "from kickoff to your first automated flow going live" },
];

type StatProps = {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
};

function Stat({ target, decimals, suffix, label }: StatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const dur = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay((target * eased).toFixed(decimals) + suffix);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(target.toFixed(decimals) + suffix);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run();
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, decimals, suffix]);

  return (
    <Reveal>
      <div className="stat-num" ref={ref}>
        {display}
      </div>
      <p className="stat-label">{label}</p>
    </Reveal>
  );
}

export default function Results() {
  return (
    <section className="section results" id="results" data-screen-label="Results">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>Email should be a revenue line, not a chore.</h2>
          <p>What a well-run program tends to look like a few months in.</p>
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
