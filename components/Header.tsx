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

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap nav">
          <Link href="/" className="brand" aria-label="Beyond Open Rate home">
            <Image src="/logo.svg" alt="" width={36} height={36} priority style={{ height: 36, width: "auto" }} />
            <span className="brand-name">Beyond&nbsp;Open&nbsp;Rate</span>
          </Link>
          <div className="nav-cta">
            <Link href="/#contact" className="btn btn-ghost nav-cta-talk">Talk to us</Link>
            <Link href="/tools/email-audit" className="btn btn-primary">Get a free audit</Link>
            <button
              className={`nav-toggle ${open ? "open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav-toggle-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="nav-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

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
          <Link href="/#contact" className="btn btn-ghost" onClick={() => setOpen(false)}>
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
