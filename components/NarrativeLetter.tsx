import { unstable_noStore as noStore } from "next/cache";
import Reveal from "./Reveal";
import homepageData from "@/content/homepage/homepage.json";

const { narrative } = homepageData;

/* PLACEHOLDER MODULE, layout only. King Kong runs a long, direct-address
   "Dear business builder" letter here that does most of the persuasive
   work on the page. BOR has no equivalent copy written yet, this is
   scaffolding for that narrative, not a real draft. */

function ordinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

// Rounds down to the start of the current 3-day window so the date only
// ticks over every 3 days instead of every render.
function getUpdatedDate() {
  const MS_PER_DAY = 86_400_000;
  const now = Date.now();
  const bucketStart = Math.floor(now / (MS_PER_DAY * 3)) * (MS_PER_DAY * 3);
  const d = new Date(bucketStart);
  const month = d.toLocaleString("en-AU", { month: "long" });
  return `${ordinal(d.getDate())} of ${month} ${d.getFullYear()}`;
}

export default function NarrativeLetter() {
  noStore();
  const updated = getUpdatedDate();
  return (
    <section className="section narrative-letter" data-screen-label="Narrative letter">
      <div className="wrap narrative-inner">
        <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
        <Reveal as="div" className="narrative-body">
          {narrative.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
