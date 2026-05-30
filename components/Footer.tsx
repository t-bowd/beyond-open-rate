import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">
            <span>B</span>
          </span>
          Beyond&nbsp;Open&nbsp;Rate
        </a>
        <ul className="footer-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <p className="footer-copy">© 2026 Beyond Open Rate</p>
      </div>
    </footer>
  );
}
