import Reveal from "./Reveal";

// PLACEHOLDERS — replace with real client quotes before launch.
// Using first name + last initial only, no company names.
type Review = { text: string; name: string; context: string; initial: string };

const REVIEWS: Review[] = [
  {
    text: "Within two months email went from an afterthought to our second-biggest sales channel. The flows they set up just quietly run.",
    name: "Sarah M.",
    context: "E-commerce brand",
    initial: "S",
  },
  {
    text: "We'd been meaning to fix our email for two years. They had our first welcome sequence live in under a week. Should have done this sooner.",
    name: "James K.",
    context: "SaaS founder",
    initial: "J",
  },
  {
    text: "Finally someone who talks about revenue, not open rates. Our monthly reporting is actually useful now.",
    name: "Priya L.",
    context: "Head of marketing",
    initial: "P",
  },
  {
    text: "The deliverability audit alone paid for the first month. We were landing in spam on half our sends and had no idea.",
    name: "Tom R.",
    context: "E-commerce founder",
    initial: "T",
  },
  {
    text: "Responsive, sharp, and they actually understand what moves the needle for a subscription business. Felt like we were their only client.",
    name: "Emma W.",
    context: "Subscription brand",
    initial: "E",
  },
];

function Stars() {
  return (
    <div className="review-stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="star" aria-hidden="true">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section" data-screen-label="Testimonials">
      <div className="wrap">
        <Reveal className="section-head">
          <h2>What clients say.</h2>
        </Reveal>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <Reveal key={r.name} className="review-card">
              <Stars />
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              <div className="review-cite">
                <span className="review-avatar" aria-hidden="true">{r.initial}</span>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-context">{r.context}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
