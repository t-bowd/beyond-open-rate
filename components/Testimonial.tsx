import Reveal from "./Reveal";

export default function Testimonial() {
  return (
    <section className="section quote" data-screen-label="Testimonial">
      <Reveal className="wrap quote-block">
        <blockquote>
          <span className="mark">“</span>Within two months, email went from an
          afterthought to our second-biggest sales channel. They just quietly
          made it work.<span className="mark">”</span>
        </blockquote>
        <div className="quote-cite">
          <span className="cite-dot">LC</span>
          <div>
            <div className="who">Lena Carver</div>
            <div className="role">Founder, Lumen&amp;Co</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
