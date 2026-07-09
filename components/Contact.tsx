import Link from "next/link";
import Reveal from "./Reveal";
import ArrowIcon from "./ArrowIcon";

export default function Contact() {
  return (
    <section className="section cta" id="contact" data-screen-label="Contact">
      <div className="wrap">
        <Reveal className="cta-card cta-card-simple">
          <h2>Let&apos;s have a chat.</h2>
          <p>
            Tell us a bit about your business and where email is at. Free,
            no-obligation — you&apos;ll talk to the people who actually do
            the work, and we&apos;ll respond within one business day.
          </p>
          <ul className="cta-list">
            <li><span className="tick">✓</span> Free, no-obligation session</li>
            <li><span className="tick">✓</span> You talk to the people who do the work</li>
            <li><span className="tick">✓</span> We&apos;ll respond within one business day</li>
          </ul>
          <Link href="/strategy-session" className="btn btn-primary btn-lg btn-arrow">
            Book your free session <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
