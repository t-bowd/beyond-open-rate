import Reveal from "./Reveal";

const SERVICES = [
  { n: "01", h: "Lifecycle & automation", p: "Welcome, abandonment, post-purchase, win-back. The always-on flows that earn revenue while you sleep." },
  { n: "02", h: "Campaign management", p: "A planned calendar of broadcasts — segmented, scheduled, and sent. We own the whole cadence, not just one-offs." },
  { n: "03", h: "Copy & design", p: "On-brand emails that read like a person and convert like a salesperson. Written and designed in-house." },
  { n: "04", h: "Platform & CRM setup", p: "Klaviyo, HubSpot, Customer.io — migrated, integrated, and configured so your data and triggers actually fire." },
  { n: "05", h: "Deliverability & audits", p: "Authentication, list hygiene, and inbox placement — so the emails you send are the emails people see." },
  { n: "06", h: "Reporting that matters", p: "Revenue per recipient, not vanity opens. Clear monthly reporting tied to the numbers your business runs on." },
];

export default function Services() {
  return (
    <section className="section" id="services" data-screen-label="Services">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>One team for the whole email program.</h2>
          <p>
            Strategy, copy, design, and the automation behind it — built and run
            end to end, so email stops being the channel you keep meaning to fix.
          </p>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Reveal as="article" className="svc-card" key={s.n}>
              <div className="svc-num">{s.n}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
