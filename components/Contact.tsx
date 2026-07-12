import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";

export default function Contact() {
  return (
    <section className="section cta" id="contact" data-screen-label="Contact">
      <div className="wrap">
        <Reveal className="cta-card cta-card-simple">
          <h2>Claim your free 30-minute strategy session.</h2>
          <p>
            Worth $500 , yours at no cost. In 30 minutes we&apos;ll identify
            exactly where your email program is leaving money on the table and
            give you the strategies to fix it. No obligation, no pitch.
            Sessions are limited, so don&apos;t sit on it.
          </p>
          <ul className="cta-list">
            <li><span className="tick">✓</span> 30 minutes, valued at $500 , 100% free</li>
            <li><span className="tick">✓</span> We find where your email is losing you money</li>
            <li><span className="tick">✓</span> Walk away with strategies to act on immediately</li>
          </ul>
          <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">
            Claim your free strategy session <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
