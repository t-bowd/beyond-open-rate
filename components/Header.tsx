"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/#faq", label: "FAQ" },
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
        <Link href="/" className="brand" aria-label="Beyond Open Rate home">
          <span className="brand-mark">
            <span>B</span>
          </span>
          Beyond&nbsp;Open&nbsp;Rate
        </Link>
        <nav>
          <ul className={`nav-links ${open ? "open" : ""}`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <Link href="/contact" className="btn btn-ghost">
            Talk to us
          </Link>
          <Link href="/contact" className="btn btn-primary">
            Get a free audit
          </Link>
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
