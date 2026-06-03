import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand" aria-label="Beyond Open Rate home">
            <Image src="/logo-reverse.svg" alt="" width={36} height={36} style={{ height: 36, width: "auto" }} />
            <span>Beyond&nbsp;Open&nbsp;Rate</span>
          </Link>
          <p className="footer-tagline">Grow your business with email.</p>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-heading">Services</p>
            <ul>
              <li><Link href="/services/lifecycle-automation">Lifecycle & automation</Link></li>
              <li><Link href="/services/campaign-management">Campaign management</Link></li>
              <li><Link href="/services/copy-and-design">Copy & design</Link></li>
              <li><Link href="/services/platform-and-crm-setup">Platform & CRM setup</Link></li>
              <li><Link href="/services/deliverability-and-audits">Deliverability & audits</Link></li>
              <li><Link href="/services/reporting-that-matters">Reporting</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Email marketing</p>
            <ul>
              <li><Link href="/email-marketing-audit-australia">Email audit</Link></li>
              <li><Link href="/email-automation-agency-australia">Email automation</Link></li>
              <li><Link href="/klaviyo-agency-australia">Klaviyo agency</Link></li>
              <li><Link href="/klaviyo-agency-sydney">Klaviyo — Sydney</Link></li>
              <li><Link href="/ecommerce-email-marketing-australia">E-commerce email</Link></li>
              <li><Link href="/email-deliverability-consultant-australia">Deliverability</Link></li>
              <li><Link href="/mailchimp-to-klaviyo-migration">Mailchimp → Klaviyo</Link></li>
              <li><Link href="/activecampaign-consultant-australia">ActiveCampaign</Link></li>
              <li><Link href="/email-marketing-agency-sydney">Sydney</Link></li>
              <li><Link href="/email-marketing-agency-melbourne">Melbourne</Link></li>
              <li><Link href="/email-marketing-agency-brisbane">Brisbane</Link></li>
              <li><Link href="/email-marketing-agency-perth">Perth</Link></li>
              <li><Link href="/email-marketing-agency-adelaide">Adelaide</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-col-heading">Site</p>
            <ul>
              <li><Link href="/services">Services</Link></li>
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
