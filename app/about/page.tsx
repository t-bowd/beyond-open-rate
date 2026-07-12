import type { Metadata } from "next";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Beyond Open Rate , Australian email marketing agency",
  description:
    "Australian email marketing agency. Lifecycle automation, Klaviyo, deliverability, and campaign management , for brands that want email to compound.",
  alternates: { canonical: "/about" },
};

function ordinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

function getUpdatedDate() {
  const MS_PER_DAY = 86_400_000;
  const now = Date.now();
  const bucketStart = Math.floor(now / (MS_PER_DAY * 3)) * (MS_PER_DAY * 3);
  const d = new Date(bucketStart);
  const month = d.toLocaleString("en-AU", { month: "long" });
  return `${ordinal(d.getDate())} of ${month} ${d.getFullYear()}`;
}

export default function AboutPage() {
  noStore();
  const updated = getUpdatedDate();

  return (
    <>
      <PageHero
        label="About"
        title={<>Email is leaving money on the table. <span className="highlight">We get it back</span>.</>}
        sub="Beyond Open Rate is a specialist email and lifecycle marketing consultancy based in Australia. We work with businesses who are ready to stop guessing, and start growing."
      />

      {/* ── About intro ────────────────────────────────── */}
      <section className="section about-intro">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <p className="narrative-date">Updated: {updated}</p>
            <div className="about-intro-body">
              <p>
                Most businesses know email and CRM should be working harder. They just don't have the time, the expertise, or the bandwidth to make it happen.
              </p>
              <p>
                That's what Beyond Open Rate was built for. Since 2020, we've worked with businesses that don't have a dedicated team, and enterprises that do but need someone to lead from the front. What they have in common is straightforward: they're ready to treat email as the revenue channel it actually is.
              </p>
              <p>
                Regardless of business size, the goal is always the same: less money left on the table.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────── */}
      <section className="section about-team-section">
        <div className="wrap">
          <div className="about-team-grid">

            <Reveal className="about-person-card">
              <div className="about-person-photo-wrap">
                <Image
                  src="/tim.jpg"
                  alt="Tim, co-founder of Beyond Open Rate"
                  width={320}
                  height={320}
                  className="about-person-photo"
                  priority
                />
              </div>
              <p className="about-eyebrow">Co-Founder</p>
              <h2>Hi, I&apos;m Tim.</h2>
              <p>
                I've spent over 15 years working in email and CRM management. Not just sending emails, but building programs from the ground up. Front-end development, automation architecture, lifecycle strategy, platform migrations and product management across complex email programs. I've done the work at companies ranging from fast-growing startups to some of the largest consumer brands in the world. I've seen what works, and what doesn't.
              </p>
            </Reveal>

            <Reveal className="about-person-card">
              <div className="about-person-photo-wrap">
                <Image
                  src="/tara.jpg"
                  alt="Tara, co-founder of Beyond Open Rate"
                  width={320}
                  height={320}
                  className="about-person-photo"
                />
              </div>
              <p className="about-eyebrow">Co-Founder</p>
              <h2>Hi, I&apos;m Tara.</h2>
              <p>
                I’ve worked across creative, marketing and senior leadership roles in professional services, health, education, hospitality and entertainment. I’m a data-driven thinker and creative problem solver, who’s hard to impress with surface-level metrics. At Beyond Open Rate, I bring that lens to everything we do, with solutions that are built to last and tie back to revenue. I care about whether the work is actually moving the needle.
              </p>
            </Reveal>

          </div>
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
              Email is still the most powerful direct channel in marketing, and we think it's only going to matter even more. But the inbox has changed.
            </p>
            <p>
              What started as a personal, conversational space has evolved into something closer to an official record and extension of our being: bank statements, government notices, order communications, tax communications. Most of what lands there today is functional, not relational.
            </p>
            <p>
              That shift has raised the bar for brands. Email has become more like a verified channel than a broadcast one. The answer isn't louder subject lines or more blast promotions; it's trust.
            </p>
            <p>
              You have to earn the right to be in someone's inbox. And the brands who invest in doing that properly, will win it.
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
              We don't run blast campaigns. Untargeted sends to your full list, regardless of behaviour or engagement, burn list health, damage deliverability and train your subscribers to ignore you. No template fixes that.
            </p>
            <p>
              Every campaign we send is targeted, behaviour-based and aligned with your brand. It takes more thought to set up properly, but it's worth the return.
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
          jobTitle: "Co-Founder",
          url: `${site.url}/about`,
        })}
      />
    </>
  );
}
