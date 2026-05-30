import Link from "next/link";
import Reveal from "./Reveal";

export default function CtaBand() {
  return (
    <section className="section cta" data-screen-label="CTA">
      <div className="wrap">
        <Reveal className="cta-card">
          <div className="cta-copy">
            <h2>Let&apos;s see what your list can really do.</h2>
            <p>
              Tell us where you&apos;re at. We&apos;ll come back within one
              business day with a free teardown and where we&apos;d start.
            </p>
            <ul className="cta-list">
              <li>
                <span className="tick">✓</span> A free 20-minute audit of your
                current program
              </li>
              <li>
                <span className="tick">✓</span> No long contracts — month to month
              </li>
              <li>
                <span className="tick">✓</span> Talk to the people who&apos;ll do
                the work
              </li>
            </ul>
          </div>
          <div className="cta-action">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Request my free audit
            </Link>
            <p className="audit-note" style={{ marginTop: 16 }}>
              <span>✦</span>
              <span>
                Free 20-minute teardown of your current email program.{" "}
                <b>No pitch, no obligation.</b>
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
