import Link from "next/link";
import Reveal from "./Reveal";

/* Real content — links to the existing free email audit tool.
   This is the "download something free" fork King Kong offers
   alongside "book a call", using what BOR already has built. */
export default function LeadMagnet() {
  return (
    <section className="section lead-magnet" data-screen-label="Lead magnet">
      <div className="wrap lead-magnet-inner">
        <Reveal className="lead-magnet-copy">
          <p className="eyebrow">Free tool</p>
          <h2>Not ready to talk yet? Score your email program first.</h2>
          <p>
            Ten questions on your automations, deliverability, and
            segmentation — takes about three minutes. You get a score out
            of 75 and a prioritised list of what to fix first, sent
            straight to your inbox.
          </p>
        </Reveal>
        <Reveal className="lead-magnet-cta">
          <Link href="/tools/email-audit" className="btn btn-primary btn-lg">
            Take the free audit
          </Link>
          <p className="lead-magnet-note">No credit card. No sales call. Just your score.</p>
        </Reveal>
      </div>
    </section>
  );
}
