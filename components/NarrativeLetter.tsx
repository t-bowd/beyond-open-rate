import Reveal from "./Reveal";

/* PLACEHOLDER MODULE — layout only. King Kong runs a long, direct-address
   "Dear business builder" letter here that does most of the persuasive
   work on the page. BOR has no equivalent copy written yet — this is
   scaffolding for that narrative, not a real draft. */
export default function NarrativeLetter() {
  return (
    <section className="section narrative-letter" data-screen-label="Narrative letter">
      <div className="wrap narrative-inner">
        <Reveal as="p" className="narrative-date">[Updated: DATE TBD]</Reveal>
        <Reveal as="div" className="narrative-body">
          <p>[Dear —, opening line TBD.]</p>
          <p>
            [PLACEHOLDER — this is where a longer, direct-address narrative
            would go: the problem the reader is facing, why it&apos;s
            harder than it should be, and how BOR sees it differently.
            Not written yet — layout only.]
          </p>
          <p>
            [PLACEHOLDER — second paragraph continuing the narrative
            toward the offer below.]
          </p>
        </Reveal>
      </div>
    </section>
  );
}
