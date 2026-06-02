import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <span>B</span>
            </span>
            Beyond&nbsp;Open&nbsp;Rate
          </Link>
          <p className="footer-tagline">Grow your business with email.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-heading">Services</p>
            <ul>
              <li><Link href="/email-marketing-audit-australia">Email audit</Link></li>
              <li><Link href="/klaviyo-agency-australia">Klaviyo agency</Link></li>
              <li><Link href="/ecommerce-email-marketing-australia">E-commerce email</Link></li>
              <li><Link href="/email-marketing-agency-sydney">Sydney</Link></li>
              <li><Link href="/email-marketing-agency-melbourne">Melbourne</Link></li>
              <li><Link href="/email-marketing-agency-brisbane">Brisbane</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-heading">Site</p>
            <ul>
              <li><Link href="/tools">Tools</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} Beyond Open Rate</p>
      </div>
    </footer>
  );
}
