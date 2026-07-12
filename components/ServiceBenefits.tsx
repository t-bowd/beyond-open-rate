import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import Reveal from "./Reveal";

const benefits = [
  "A complimentary 30-minute kickoff call. We start with context, not assumptions, so the strategy we build is specific to your business from day one.",
  "No guesswork, with full management of your customer engagement platform to drive revenue and engagement.",
  "Everything your email program needs, covered under one monthly engagement. No separate quotes, no scope creep, no surprises.",
  "Every email written for you, aligned with your brand, designed to drive action beyond open rates.",
  "Testing and reporting to know exactly what's working (and what's not), so every dollar goes towards what actually converts.",
  "Peace of mind that your emails are landing in the inbox, not spam, to protect the revenue you're already generating.",
  "Proactive monitoring of your sender reputation, to identify and fix issues before they cost you money.",
  "A clean, engaged list. No dead weight dragging down your sender reputation or results.",
  "Clear monthly reporting that ties email directly to revenue. No more guessing whether it's worth it.",
  "A 60-minute dedicated monthly strategy call with an expert, so decisions are made faster and stay aligned with your business goals.",
  "Flexible support that scales with your stage — from early-stage brands and start-ups to full lifecycle ownership.",
  "Unlimited email support, to ensure your questions never go unanswered.",
];

export default function ServiceBenefits() {
  return (
    <section className="section" data-screen-label="Service benefits">
      <div className="wrap" style={{ maxWidth: 740 }}>
        <Reveal as="h2" style={{ marginBottom: 32 }}>What you get</Reveal>
        <Reveal as="ul" className="benefits-list">
          {benefits.map((b, i) => (
            <li key={i} className="benefits-item">
              <span className="benefits-check" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span>{b}</span>
            </li>
          ))}
        </Reveal>
        <Reveal style={{ marginTop: 40 }}>
          <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">
            Let's get your email earning <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
