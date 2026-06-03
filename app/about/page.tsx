import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import { JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Beyond Open Rate — Australian email marketing agency",
  description:
    "Australian email marketing agency. 15 years across lifecycle automation, Klaviyo, deliverability, and platform migrations — we treat email as the revenue channel it is.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="hero" data-screen-label="About">
        <div className="wrap hero-inner">
          <Reveal as="h1">
            Fifteen years in email.{" "}
            <span className="accent">Still obsessed with getting it right.</span>
          </Reveal>
          <Reveal as="p" className="hero-sub">
            Beyond Open Rate is a small, senior email marketing consultancy
            based in Australia. We work with businesses of every size who are
            ready to treat email as the revenue channel it actually is.
          </Reveal>
        </div>
      </section>

      {/* ── Founder ────────────────────────────────────── */}
      <section className="section about-founder-section">
        <div className="wrap about-founder">
          <Reveal className="about-photo-wrap">
            <Image
              src="/tim.jpg"
              alt="Tim, founder of Beyond Open Rate"
              width={480}
              height={560}
              className="about-photo-img"
              priority
            />
          </Reveal>

          <Reveal className="about-founder-copy">
            <p className="about-eyebrow">Founder</p>
            <h2>Hi, I&apos;m Tim.</h2>
            <p>
              I&apos;ve spent 15 years working in email — not just sending it,
              but building it from the ground up. Front-end development,
              automation architecture, lifecycle strategy, platform migrations,
              product management across complex email programs. I&apos;ve done
              the work at companies ranging from fast-growing startups to some
              of the largest consumer brands in the world.
            </p>
            <p>
              Beyond Open Rate started during a deliberate career break in 2020.
              The idea was simple: take that experience and apply it for
              businesses that don&apos;t have a dedicated team to do it — or
              who have a team and need someone to lead from the front.
            </p>
            <p>
              We&apos;re a small, senior team. You deal directly with the people
              doing the work — not an account manager who passes things
              downstream.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Our take on email ──────────────────────────── */}
      <section className="section about-philosophy">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <h2>Our take on email</h2>
          </Reveal>

          <Reveal className="about-take">
            <p>
              Email is still the most powerful direct channel in marketing —
              and we think it&apos;s about to matter even more. But the inbox
              has changed fundamentally. What started as a personal,
              conversational space has evolved into something closer to an
              official record: bank statements, government notices, order
              confirmations, tax communications. Most of what lands in your
              inbox today is functional, not relational.
            </p>
            <p>
              That shift has real implications for brands. As email becomes
              more &ldquo;official&rdquo; — more like a verified channel than a
              broadcast one — the bar for standing out gets higher. And the
              answer isn&apos;t louder subject lines. It&apos;s trust.
            </p>
            <p>
              Authentication is where that trust starts. SPF, DKIM, and DMARC
              are table stakes; Google and Yahoo made DMARC enforcement
              mandatory for bulk senders in 2024. But BIMI — Brand Indicators
              for Message Identification — goes a step further: it puts your
              verified brand logo directly in the inbox avatar position before
              the email is even opened. It&apos;s a small thing that signals
              something big: this sender has earned the right to be here.
            </p>
            <p>
              The brands that invest in these signals will win the inbox. The
              ones that don&apos;t will increasingly find themselves filtered
              out — or worse, trusted less. We think this is one of the most
              underappreciated shifts in email marketing right now, and we
              build every program with it in mind.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Who we work with ───────────────────────────── */}
      <section className="section">
        <div className="wrap about-split">
          <Reveal className="about-split-col">
            <h2>Who we work with</h2>
            <p>
              Everyone from early-stage startups getting their first automation
              live, to enterprise brands managing lists in the millions. Size
              matters less to us than mindset.
            </p>
            <p>
              Our best work happens with clients who are open to trying new
              things — curious, willing to test, and ready to move on data
              rather than instinct. If you want a partner who&apos;ll push
              back when something isn&apos;t working and bring genuine
              expertise to the table, we&apos;re probably a good fit.
            </p>
          </Reveal>

          <Reveal className="about-split-col about-wont">
            <h2>What we won&apos;t do</h2>
            <p>
              We won&apos;t run blast campaigns — untargeted sends to your
              whole list that ignore behaviour, engagement, or where each
              subscriber is in their relationship with your brand. That
              approach burns list health, damages deliverability, and trains
              your subscribers to ignore you.
            </p>
            <p>
              Every campaign we send is targeted and behaviour-based. It takes
              more thought to set up properly. It&apos;s worth it.
            </p>
          </Reveal>
        </div>
      </section>

      <Contact />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "About", url: `${site.url}/about` },
        ])}
      />
    </>
  );
}
