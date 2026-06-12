import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import AuditLanding from "@/components/deliverability/AuditLanding";
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
          <Reveal as="h1">
            Is your email actually{" "}
            <span className="accent">reaching the inbox?</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Send us one of your real campaign emails. We run 13 checks across
            your authentication setup, blacklist status, sending infrastructure,
            and content signals — then score your deliverability and tell you
            exactly what&apos;s failing.
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section da-hiw-section">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <Reveal as="h2" className="da-section-label">How it works</Reveal>
          <div className="da-hiw-steps">
            <div className="da-hiw-step-v2">
              <div className="da-hiw-icon">✉</div>
              <div className="da-hiw-body">
                <strong>Enter your details</strong>
                <p>We generate a unique inbound address just for you. It stays active for 30 days.</p>
              </div>
            </div>
            <div className="da-hiw-step-v2">
              <div className="da-hiw-icon">⟶</div>
              <div className="da-hiw-body">
                <strong>Forward a real campaign email</strong>
                <p>Send any email from your ESP to the address we give you — exactly as you&apos;d send to a subscriber.</p>
              </div>
            </div>
            <div className="da-hiw-step-v2">
              <div className="da-hiw-icon">◎</div>
              <div className="da-hiw-body">
                <strong>Get your score instantly</strong>
                <p>Your report appears automatically. No waiting, no account, no spam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we check */}
      <section className="section da-checks-preview">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <Reveal as="h2" className="da-section-label">What we check</Reveal>
          <div className="da-check-categories">
            <div className="da-check-cat">
              <span className="da-check-cat-icon">🔐</span>
              <h3>Authentication</h3>
              <ul>
                <li>SPF — pass / fail / softfail</li>
                <li>DKIM — signature + signing domain</li>
                <li>DMARC — none / quarantine / reject</li>
              </ul>
            </div>
            <div className="da-check-cat">
              <span className="da-check-cat-icon">🖥</span>
              <h3>Infrastructure</h3>
              <ul>
                <li>Blacklist check (10 DNSBLs)</li>
                <li>Shared vs dedicated IP</li>
                <li>Sending platform identified</li>
                <li>TLS encryption in transit</li>
                <li>Reverse DNS (PTR) record</li>
              </ul>
            </div>
            <div className="da-check-cat">
              <span className="da-check-cat-icon">📝</span>
              <h3>Content signals</h3>
              <ul>
                <li>Reply-to / Return-Path alignment</li>
                <li>Subject line spam triggers</li>
                <li>Plain text version present</li>
                <li>List-Unsubscribe header</li>
                <li>One-click unsubscribe</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tier selector + form */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal as="h2" className="da-section-label">What you get</Reveal>
          <AuditLanding />
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
