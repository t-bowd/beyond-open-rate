import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <span>B</span>
          </span>
          Beyond&nbsp;Open&nbsp;Rate
        </Link>
        <ul className="footer-links">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/process">Process</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} Beyond Open Rate</p>
      </div>
    </footer>
  );
}
