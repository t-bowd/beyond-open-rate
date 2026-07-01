import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

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

          <div className="footer-social">
            <a href={site.social.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="Beyond Open Rate on LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
              </svg>
            </a>
            <a href={site.social.facebook} target="_blank" rel="me noopener noreferrer" aria-label="Beyond Open Rate on Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21.5v-8.4h2.82l.42-3.27h-3.24V7.75c0-.95.26-1.6 1.63-1.6h1.74V3.24C16.56 3.16 15.62 3 14.51 3c-2.31 0-3.89 1.41-3.89 4v2.23H8.24v3.27h2.38v8.4h2.88z"/>
              </svg>
            </a>
            <a href={site.social.instagram} target="_blank" rel="me noopener noreferrer" aria-label="Beyond Open Rate on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2zm0 5.94a2.34 2.34 0 1 1 0-4.68 2.34 2.34 0 0 1 0 4.68zm4.59-6.08a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0zM20.7 7.6c-.07-1.42-.39-2.68-1.42-3.71-1.03-1.03-2.29-1.35-3.71-1.42C14.13 2.4 9.87 2.4 8.43 2.47 7.01 2.54 5.75 2.86 4.72 3.89 3.69 4.92 3.37 6.18 3.3 7.6 3.23 9.04 3.23 13.3 3.3 14.74c.07 1.42.39 2.68 1.42 3.71 1.03 1.03 2.29 1.35 3.71 1.42 1.44.07 5.7.07 7.14 0 1.42-.07 2.68-.39 3.71-1.42 1.03-1.03 1.35-2.29 1.42-3.71.07-1.44.07-5.7 0-7.14zm-1.86 8.68a2.87 2.87 0 0 1-1.62 1.62c-1.12.44-3.78.34-5.02.34s-3.9.1-5.02-.34a2.87 2.87 0 0 1-1.62-1.62c-.44-1.12-.34-3.78-.34-5.02s-.1-3.9.34-5.02A2.87 2.87 0 0 1 6.98 4.6c1.12-.44 3.78-.34 5.02-.34s3.9-.1 5.02.34a2.87 2.87 0 0 1 1.62 1.62c.44 1.12.34 3.78.34 5.02s.1 3.9-.34 5.02z"/>
              </svg>
            </a>
          </div>
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
