import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Thanks, we'll be in touch",
  description: "We received your request and will be in touch within one business day.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <PageHero
      label="Thank you"
      title={<>Got it! <span className="highlight">Thanks</span>.</>}
      sub="We'll be in touch shortly to organise your session"
      actions={
        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      }
    />
  );
}
