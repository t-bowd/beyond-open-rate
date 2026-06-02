"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  label: string;       // human-readable label for GTM (e.g. "audit_cta", "contact_cta")
  location?: string;   // e.g. "hero", "mid_page", "footer"
  children: React.ReactNode;
};

/**
 * Drop-in replacement for <Link> on CTA buttons.
 * Fires a `cta_click` dataLayer event before navigating.
 */
export default function CtaLink({ href, className, label, location = "hero", children }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("cta_click", { label, location, destination: href })}
    >
      {children}
    </Link>
  );
}
