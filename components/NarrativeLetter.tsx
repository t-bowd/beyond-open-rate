import { unstable_noStore as noStore } from "next/cache";
import Reveal from "./Reveal";

/* PLACEHOLDER MODULE — layout only. King Kong runs a long, direct-address
   "Dear business builder" letter here that does most of the persuasive
   work on the page. BOR has no equivalent copy written yet — this is
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
         {/* <p>[Dear —, opening line TBD.]</p> */}
          <p>
            You already know email is supposed to be your highest-returning channel. The data says $36 back for every dollar in. So why does it feel like yours is barely covering its own weight?
          </p>
          <p>
            Here's what we see constantly: businesses sending campaigns that land in spam, automation that hasn't been touched since setup day, and a list full of people who stopped caring months ago. 
          </p>

          <p>Nobody flagged it. Nobody fixed it. And quietly, month after month, that's revenue you didn't see and can't get back.</p>

          <p>Most agencies will sell you on open rates and design. We don't. We care about one thing: whether your email program is making you money. If it isn't, we find out why, and we fix it.</p>
        </Reveal>
      </div>
    </section>
  );
}
