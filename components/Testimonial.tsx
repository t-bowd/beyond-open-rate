import Reveal from "./Reveal";
import testimonialData from "../content/settings/testimonials.json";

type Review = { text: string; name: string; initial: string; rating?: number };

const REVIEWS: Review[] = testimonialData.items;

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
