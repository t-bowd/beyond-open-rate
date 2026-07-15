import type { Metadata } from "next";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";
import PageHero from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, personSchema } from "@/lib/jsonld";
import { site } from "@/lib/site";
import pageData from "@/content/pages/about.json";

export const metadata: Metadata = {
  title: pageData.meta.title,
  description: pageData.meta.description,
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
  const { hero, intro, team, philosophy, workWith, wontDo } = pageData;

  return (
    <>
      <PageHero
        label="About"
        title={<>{hero.titlePre} <span className="highlight">{hero.titleHighlight}</span>{hero.titlePost}</>}
        sub={hero.sub}
      />

      <section className="section about-intro">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal>
            <p className="narrative-date">Updated: {updated}</p>
            <div className="about-intro-body">
              {intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-team-section">
        <div className="wrap">
          <div className="about-team-grid">
            {team.map((person) => (
              <Reveal key={person.name} className="about-person-card">
                <div className="about-person-photo-wrap">
                  <Image
                    src={person.photo}
                    alt={`${person.name}, ${person.role} of Beyond Open Rate`}
                    width={320}
                    height={320}
                    className="about-person-photo"
                    priority={person.name === "Tim"}
                  />
                </div>
                <p className="about-eyebrow">{person.role}</p>
                <h2>Hi, I&apos;m {person.name}.</h2>
                <p>{person.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-philosophy">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal><h2>{philosophy.heading}</h2></Reveal>
          <Reveal className="about-take">
            {philosophy.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-split">
          <Reveal className="about-split-col">
            <h2>{workWith.heading}</h2>
            {workWith.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
          <Reveal className="about-split-col about-wont">
            <h2>{wontDo.heading}</h2>
            {wontDo.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
        </div>
      </section>

      <Contact />

      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: "About", url: `${site.url}/about` }])} />
      <JsonLd data={personSchema({ name: "Tim", jobTitle: "Co-Founder", url: `${site.url}/about` })} />
    </>
  );
}
