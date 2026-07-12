import Reveal from "./Reveal";

// PLACEHOLDERS , replace with real client quotes before launch.
// Using first name + last initial only, no company names.
type Review = { text: string; name: string; initial: string; rating?: number };

const REVIEWS: Review[] = [
  {
    text: "Within two months email went from an afterthought to our second-biggest sales channel. The flows they set up just quietly run.",
    name: "Sarah M.",
    initial: "S",
  },
  {
    text: "We'd been meaning to fix our email for two years. They had our first welcome sequence live in under a week. Should have done this sooner.",
    name: "James K.",
    initial: "J",
  },
  {
    text: "Finally someone who talks about revenue, not open rates. Our monthly reporting is actually useful now.",
    name: "Priya L.",
    initial: "P",
  },
  {
    text: "The deliverability audit alone paid for the first month. We were landing in spam on half our sends and had no idea.",
    name: "Tom R.",
    initial: "T",
  },
  {
    text: "Responsive, sharp, and they actually understand what moves the needle for a subscription business. Felt like we were their only client.",
    name: "Emma W.",
    initial: "E",
  },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`star ${i < rating ? "" : "star-empty"}`} aria-hidden="true">★</span>
      ))}
    </div>
  );
}

function ReviewHead({ initial, name }: { initial: string; name: string }) {
  return (
    <div className="review-head">
      <span className="review-avatar" aria-hidden="true">{initial}</span>
      <span className="review-name">{name}</span>
      <span className="review-verified" aria-label="Verified reviewer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </div>
  );
}

export default function Testimonials() {
  const [featured, ...rest] = REVIEWS;

  return (
    <section className="section testimonial-wall" data-screen-label="Testimonials">
      <div className="wrap">
        <Reveal as="h2" className="display-huge testimonial-heading">What our customers say</Reveal>

        <Reveal className="testimonial-featured">
          <Stars rating={featured.rating} />
          <p className="testimonial-featured-text">&ldquo;{featured.text}&rdquo;</p>
          <ReviewHead initial={featured.initial} name={featured.name} />
        </Reveal>

        <div className="review-grid">
          {rest.map((r) => (
            <Reveal key={r.name} className="review-card">
              <ReviewHead initial={r.initial} name={r.name} />
              <Stars rating={r.rating} />
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
