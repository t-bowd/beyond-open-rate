import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Beyond Open Rate — Australian email marketing agency",
  description:
    "Australian email marketing agency. Lifecycle automation, Klaviyo, deliverability, and campaign management — for brands that want email to compound.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title={<>Email is leaving money on the table. <span className="highlight">We get it back</span>.</>}
        sub="Beyond Open Rate is a specialist email and lifecycle marketing consultancy based in Australia. We work with businesses who are ready to stop guessing, and start growing."
      />

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
            <p className="about-eyebrow">Co-Founder</p>
            <h2>Hi, I&apos;m Tim.</h2>
            <p>
              I’ve spent over 15 years working in email and CRM management. Not just sending emails, but building programs from the ground up. Front-end development, automation architecture, lifecycle strategy, platform migrations and product management across complex email programs. I’ve done the work at companies ranging from fast-growing startups to some of the largest consumer brands in the world. I’ve seen what works, and what doesn’t.
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
              Email is still the most powerful direct channel in marketing, and we think it’s only going to matter even more. But the inbox has changed. 
            </p>
            <p>
            What started as a personal, conversational space has evolved into something closer to an official record and extension of our being: bank statements, government notices, order communications, tax communications. Most of what lands there today is functional, not relational.
            </p>
            <p>
              That shift has raised the bar for brands. Email has become more like a verified channel than a broadcast one. The answer isn’t louder subject lines or more blast promotions; it’s trust. 
            </p>
            <p>
             You have to earn the right to be in someone’s inbox. And the brands who invest in doing that properly, will win it.
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
              If you're a business that sends marketing email and wants it to work harder, we're worth talking to.
            </p>
            <p>
              Our best work happens with businesses that are open to honest feedback, willing to test, and ready to act on data. If you want someone to bring genuine expertise and tell you what isn't working, we're a good fit.
            </p>
          </Reveal>

          <Reveal className="about-split-col about-wont">
            <h2>What we won&apos;t do</h2>
            <p>
              We don’t run blast campaigns. Untargeted sends to your full list, regardless of behaviour or engagement, burn list health, damage deliverability and train your subscribers to ignore you. No template fixes that.
            </p>
            <p>
            Every campaign we send is targeted, behaviour-based and aligned with your brand. It takes more thought to set up properly, but it’s worth the return.
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
      <JsonLd
        data={personSchema({
          name: "Tim",
          jobTitle: "Founder",
          url: `${site.url}/about`,
        })}
      />
    </>
  );
}
