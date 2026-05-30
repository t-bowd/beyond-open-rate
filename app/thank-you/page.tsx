import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Thanks — we'll be in touch",
  description: "We received your request and will be in touch within one business day.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <section className="hero" data-screen-label="Thank you">
      <div className="wrap hero-inner">
        <Reveal as="h1">
          Got it — <span className="accent">thanks</span>.
        </Reveal>
        <Reveal as="p" className="hero-sub">
          We&apos;ll be in touch within one business day with your free
          teardown and where we&apos;d start.
        </Reveal>
        <Reveal as="p" className="audit-note" style={{ marginTop: 28 }}>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
