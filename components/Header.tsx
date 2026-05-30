"use client";

import { useEffect, useState } from "react";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav">
        <a href="#top" className="brand" aria-label="Beyond Open Rate home">
          <span className="brand-mark">
            <span>B</span>
          </span>
          Beyond&nbsp;Open&nbsp;Rate
        </a>
        <nav>
          <ul className={`nav-links ${open ? "open" : ""}`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-ghost">
            Talk to us
          </a>
          <a href="#hero-audit" className="btn btn-primary">
            Get a free audit
          </a>
          <button
            className="nav-toggle"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
