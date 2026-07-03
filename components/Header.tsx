"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Header goes solid-white + dark content whenever the menu is open,
  // regardless of scroll position — same as the scrolled state.
  const light = scrolled || open;

  // Focused-flow pages (e.g. the strategy session funnel) get a stripped
  // header — logo only, always dark, no phone/burger/drawer — since the
  // page background is white, not the dark hero video.
  const isFlow = pathname === "/strategy-session";

  if (isFlow) {
    return (
      <header className="site-header flow">
        <div className="wrap nav nav-flow">
          <Link href="/" className="brand" aria-label="Beyond Open Rate home">
            <Image src="/logo.svg" alt="" width={28} height={28} priority style={{ height: 28, width: "auto" }} />
            <span className="brand-name">Beyond&nbsp;Open&nbsp;Rate</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`site-header ${light ? "scrolled" : ""}`}>
        <div className="wrap nav">
          <a href="tel:1300444444" className="nav-phone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="nav-phone-number">1300 444 444</span>
          </a>

          <Link href="/" className="brand" aria-label="Beyond Open Rate home">
            <Image src={light ? "/logo.svg" : "/logo-reverse.svg"} alt="" width={28} height={28} priority style={{ height: 28, width: "auto" }} />
            <span className="brand-name">Beyond&nbsp;Open&nbsp;Rate</span>
          </Link>

          <button
            className={`nav-toggle ${open ? "open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav
        className={`nav-drawer ${open ? "open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!open}
      >
        <ul className="nav-drawer-links">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-drawer-cta">
          <Link href="/strategy-session" className="btn btn-ghost" onClick={() => setOpen(false)}>
            Talk to us
          </Link>
          <Link href="/tools/email-audit" className="btn btn-primary" onClick={() => setOpen(false)}>
            Get a free audit
          </Link>
        </div>
      </nav>
    </>
  );
}
