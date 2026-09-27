"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const EMAIL_LINKS = [
  { href: "/about",         label: "About" },
  { href: "/retainer",      label: "Retainer" },
  { href: "/audit",         label: "Audit" },
  { href: "/projects",      label: "Projects" },
  { href: "/strategy",      label: "Strategy" },
];

const DIGITAL_LINKS = [
  { href: "/paid-social",    label: "Paid Social" },
  { href: "/organic-social", label: "Organic Social" },
  { href: "/seo",            label: "SEO" },
  { href: "/landing-pages",  label: "Landing Pages" },
];

export default function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [emailOpen, setEmailOpen]     = useState(false);
  const [digitalOpen, setDigitalOpen] = useState(false);
  const pathname = usePathname();

  const emailRef   = useRef<HTMLLIElement>(null);
  const digitalRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setEmailOpen(false);
    setDigitalOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emailRef.current && !emailRef.current.contains(e.target as Node)) setEmailOpen(false);
      if (digitalRef.current && !digitalRef.current.contains(e.target as Node)) setDigitalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLightTop = pathname.startsWith("/blog/");
  const light = scrolled || drawerOpen || isLightTop;
  const isFlow = pathname === "/strategy-session";

  if (isFlow) {
    return (
      <header className="site-header flow">
        <div className="wrap nav nav-flow">
          <Link href="/" className="brand" aria-label="Beyond Marketing home">
            <Image src="/logo.svg" alt="" width={28} height={28} priority style={{ height: 28, width: "auto" }} />
            <span className="brand-name">Beyond&nbsp;<span className="brand-accent">Marketing</span></span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`site-header ${light ? "scrolled" : ""}`}>
        <div className="wrap nav">
          <a href={`tel:${site.phone}`} className="nav-phone">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="nav-phone-number">{site.phone}</span>
          </a>

          <Link href="/" className="brand" aria-label="Beyond Marketing home">
            <Image src={light ? "/logo.svg" : "/logo-reverse.svg"} alt="" width={28} height={28} priority style={{ height: 28, width: "auto" }} />
            <span className="brand-name">Beyond&nbsp;<span className="brand-accent">Marketing</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Main navigation">
            <ul className="nav-desktop-list">
              <li ref={emailRef} className={`nav-desktop-item has-dropdown ${emailOpen ? "open" : ""}`}>
                <button
                  className="nav-desktop-trigger"
                  aria-expanded={emailOpen}
                  onClick={() => { setEmailOpen((v) => !v); setDigitalOpen(false); }}
                >
                  Email &amp; Lifecycle
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="nav-chevron">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </button>
                <ul className="nav-dropdown">
                  <li><Link href="/email-lifecycle">Email &amp; Lifecycle</Link></li>
                  {EMAIL_LINKS.map((item) => (
                    <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
                  ))}
                </ul>
              </li>

              <li ref={digitalRef} className={`nav-desktop-item has-dropdown ${digitalOpen ? "open" : ""}`}>
                <button
                  className="nav-desktop-trigger"
                  aria-expanded={digitalOpen}
                  onClick={() => { setDigitalOpen((v) => !v); setEmailOpen(false); }}
                >
                  Digital Marketing
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="nav-chevron">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </button>
                <ul className="nav-dropdown">
                  {DIGITAL_LINKS.map((item) => (
                    <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
                  ))}
                </ul>
              </li>

              <li className="nav-desktop-item">
                <Link href="/blog" className="nav-desktop-link">Blog</Link>
              </li>
            </ul>
          </nav>

          <button
            className={`nav-toggle ${drawerOpen ? "open" : ""}`}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span className="nav-toggle-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <nav
        className={`nav-drawer ${drawerOpen ? "open" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!drawerOpen}
      >
        <ul className="nav-drawer-links">
          <li className="nav-drawer-group">
            <button
              className="nav-drawer-group-toggle"
              aria-expanded={emailOpen}
              onClick={() => setEmailOpen((v) => !v)}
            >
              Email &amp; Lifecycle
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`nav-chevron ${emailOpen ? "open" : ""}`}>
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {emailOpen && (
              <ul className="nav-drawer-sub">
                <li><Link href="/email-lifecycle" onClick={() => setDrawerOpen(false)}>Email &amp; Lifecycle</Link></li>
                {EMAIL_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setDrawerOpen(false)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="nav-drawer-group">
            <button
              className="nav-drawer-group-toggle"
              aria-expanded={digitalOpen}
              onClick={() => setDigitalOpen((v) => !v)}
            >
              Digital Marketing
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`nav-chevron ${digitalOpen ? "open" : ""}`}>
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {digitalOpen && (
              <ul className="nav-drawer-sub">
                {DIGITAL_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setDrawerOpen(false)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <Link href="/blog" onClick={() => setDrawerOpen(false)}>Blog</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
