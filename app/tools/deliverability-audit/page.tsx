import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import AuditForm from "@/components/deliverability/AuditForm";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Free email deliverability audit — find out if you're landing in the inbox",
  description:
    "Send us one of your real campaign emails. We check your authentication, blacklist status, sending infrastructure, and content signals — and score your deliverability in seconds.",
  alternates: { canonical: "/tools/deliverability-audit" },
};

export default function DeliverabilityAuditPage() {
  return (
    <>
      <section className="hero" data-screen-label="Deliverability audit">
        <div className="wrap hero-inner">
          <Reveal as="p" className="eyebrow">
            Free tool
          </Reveal>
          <Reveal as="h1">
            Is your email actually{" "}
            <span className="accent">reaching the inbox?</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Send us one of your real campaign emails. We run 13 checks across
            your authentication setup, blacklist status, sending infrastructure,
            and content signals — then score your deliverability and show you
            exactly what&apos;s failing.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <div className="da-how-it-works">
            <div className="da-hiw-step">
              <span className="da-hiw-num">1</span>
              <p>Enter your name and email — we generate a unique inbound address for you</p>
            </div>
            <div className="da-hiw-step">
              <span className="da-hiw-num">2</span>
              <p>Send one of your real campaign emails to that address from your ESP</p>
            </div>
            <div className="da-hiw-step">
              <span className="da-hiw-num">3</span>
              <p>Your scored report appears automatically — no waiting, no account</p>
            </div>
          </div>

          <AuditForm />
        </div>
      </section>

      <section className="section da-checks-preview">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <h2>What we check</h2>
          <div className="da-check-categories">
            <div>
              <h3>Authentication</h3>
              <ul>
                <li>SPF record — pass / fail / softfail</li>
                <li>DKIM signature — pass / fail + signing domain</li>
                <li>DMARC policy — none / quarantine / reject + alignment</li>
              </ul>
            </div>
            <div>
              <h3>Infrastructure</h3>
              <ul>
                <li>Blacklist check — 50+ DNSBLs including Spamhaus, Barracuda, SORBS</li>
                <li>Shared vs dedicated IP detection</li>
                <li>Sending platform identification</li>
                <li>TLS encryption in transit</li>
                <li>Reverse DNS (PTR) record</li>
              </ul>
            </div>
            <div>
              <h3>Content signals</h3>
              <ul>
                <li>Reply-to / Return-Path alignment</li>
                <li>Subject line spam trigger scan</li>
                <li>Plain text version present</li>
                <li>List-Unsubscribe header (required by Gmail/Yahoo)</li>
                <li>One-click unsubscribe (Gmail/Yahoo 2024 requirement)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <h2>Free vs full report</h2>
          <div className="da-tier-compare">
            <div className="da-tier-col">
              <p className="da-tier-label">Free</p>
              <ul>
                <li>Overall score (0–100) and grade</li>
                <li>Pass / fail for each of the 13 checks</li>
                <li>Sending platform detected</li>
                <li>Issue count summary</li>
              </ul>
            </div>
            <div className="da-tier-col da-tier-col--premium">
              <p className="da-tier-label">Full report <span className="da-tier-price">$9</span></p>
              <ul>
                <li>Everything in free</li>
                <li>Plain-English explanation of each issue</li>
                <li>Specific remediation steps for every failure</li>
                <li>Revenue impact estimate based on your list size</li>
                <li>Industry benchmarks per issue</li>
                <li>Re-test link — same address active for 30 days</li>
                <li>PDF report to share with your developer or agency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Tools", url: `${site.url}/tools` },
          { name: "Deliverability audit", url: `${site.url}/tools/deliverability-audit` },
        ])}
      />
    </>
  );
}
