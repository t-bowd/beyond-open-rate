import { unstable_noStore as noStore } from "next/cache";
import Reveal from "./Reveal";

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

export default function ServiceIntro() {
  noStore();
  const updated = getUpdatedDate();
  return (
    <section className="section narrative-letter" data-screen-label="Service intro">
      <div className="wrap narrative-inner">
        <Reveal as="p" className="narrative-date">Updated: {updated}</Reveal>
        <Reveal as="div" className="narrative-body">
          <p>Your email list is one of the most valuable assets in your business. It's also one of the most neglected. Campaigns only go out when someone has time. Flows are set and forgotten. Nobody's really sure what's driving revenue and what's just noise.</p>
          <p>That's a capacity and expertise problem, and it's quietly costing you money.</p>
          <p>We take full ownership of email and CRM management, working as an extension of your team with an all-inclusive service. No separate quotes, no surprise fees. You stay focused on your business, while we make sure email is working for it.</p>
        </Reveal>
      </div>
    </section>
  );
}
