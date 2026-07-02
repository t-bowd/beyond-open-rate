import Reveal from "./Reveal";

/* PLACEHOLDER MODULE — layout only. King Kong runs a muted press-logo
   strip here ("As featured in Forbes, HuffPost..."). BOR has no press
   coverage on file yet — these are empty slots, not real logos. */
const SLOTS = 6;

export default function PressLogos() {
  return (
    <section className="press-logos" data-screen-label="Press logos">
      <div className="wrap">
        <Reveal as="p" className="press-logos-label">[As featured in — TBD]</Reveal>
        <div className="press-logos-row">
          {Array.from({ length: SLOTS }).map((_, i) => (
            <span className="press-logo-slot" key={i} aria-hidden="true" />
          ))}
        </div>
      </div>
    </section>
  );
}
