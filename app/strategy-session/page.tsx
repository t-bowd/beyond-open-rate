import type { Metadata } from "next";
import { Suspense } from "react";
import StrategySession from "@/components/quiz/StrategySession";

export const metadata: Metadata = {
  title: "Free 30-minute email growth session",
  description:
    "Book a free, no-obligation 30-minute strategy session. Tell us about your business and we'll map out how to turn your email list into a reliable revenue channel.",
  alternates: { canonical: "/strategy-session" },
};

export default function StrategySessionPage() {
  return (
    <section className="section strategy-session-section" data-screen-label="Strategy session">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <Suspense fallback={null}>
          <StrategySession />
        </Suspense>
      </div>
    </section>
  );
}
