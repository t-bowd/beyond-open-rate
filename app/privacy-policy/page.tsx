import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | Beyond Open Rate",
  description: "How Beyond Open Rate collects, uses, and protects your personal information under the Australian Privacy Act 1988.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicy() {
  const updated = "12 July 2026";

  return (
    <>
      <PageHero
        label="Privacy Policy"
        title="Privacy Policy"
        sub="How we collect, use, and protect your personal information."
      />

      <section className="section">
        <div className="wrap prose" style={{ maxWidth: 740 }}>
          <p><em>Last updated: {updated}</em></p>

          <h2>1. About us</h2>
          <p>
            Beyond Open Rate (ABN 91 693 195 836) is an Australian email marketing agency. We operate the website beyondopenrate.com.au and provide email marketing strategy, audit, and retainer services to businesses.
          </p>
          <p>
            We are committed to protecting your privacy and handling your personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
          </p>

          <h2>2. What information we collect</h2>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li><strong>Contact details</strong> , your name, email address, and phone number when you fill out a form, take our email audit, or book a strategy session.</li>
            <li><strong>Business information</strong> , details about your business, email program, and marketing goals that you share with us in the course of our work together.</li>
            <li><strong>Communications</strong> , records of emails, messages, and calls between us.</li>
            <li><strong>Usage data</strong> , information about how you use our website, including pages visited, time spent, and referring sources, collected via cookies and analytics tools (see section 5).</li>
          </ul>
          <p>We do not collect sensitive information (such as health, financial account, or government identifier information) unless you provide it voluntarily and we have a clear reason to do so.</p>

          <h2>3. How we collect your information</h2>
          <p>We collect personal information:</p>
          <ul>
            <li>directly from you when you submit a form, complete our email audit tool, or correspond with us;</li>
            <li>automatically when you visit our website through cookies and analytics tools; and</li>
            <li>from third parties where you have consented to that sharing, or where permitted by law.</li>
          </ul>

          <h2>4. Why we collect and use your information</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>respond to your enquiries and provide the services you&apos;ve requested;</li>
            <li>send you information about our services, insights, and updates (where you have consented or where otherwise permitted);</li>
            <li>improve our website and services;</li>
            <li>comply with our legal obligations; and</li>
            <li>manage our business relationship with you.</li>
          </ul>
          <p>
            You may opt out of marketing communications at any time by clicking &ldquo;unsubscribe&rdquo; in any email we send, or by contacting us at{" "}
            <a href="mailto:privacy@beyondopenrate.com.au">privacy@beyondopenrate.com.au</a>.
          </p>

          <h2>5. Cookies and tracking technologies</h2>
          <p>
            Our website uses cookies and similar tracking technologies, including analytics and advertising tools provided by third parties such as Google and Meta. These tools may collect information about your device, browser, and how you interact with our site. This data is used to measure site performance, understand audience behaviour, and, where you have consented, to deliver relevant advertising.
          </p>
          <p>
            You can control cookies through your browser settings. Disabling cookies may affect the functionality of some parts of our site.
          </p>

          <h2>6. Disclosure to third parties</h2>
          <p>
            We may share your personal information with trusted third-party service providers who assist us in operating our website and delivering our services , for example, email delivery platforms, analytics providers, and business tools. These providers are required to handle your information in accordance with applicable privacy laws and our instructions.
          </p>
          <p>
            We do not sell your personal information. We will only disclose your information to third parties outside of these arrangements where required or permitted by law, or with your consent.
          </p>

          <h3>Overseas disclosure</h3>
          <p>
            Some of our third-party service providers are based overseas (including in the United States and European Union). Where we disclose personal information to overseas recipients, we take reasonable steps to ensure those recipients handle your information in accordance with the APPs, or are subject to a similar privacy framework.
          </p>

          <h2>7. Data security</h2>
          <p>
            We take reasonable steps to protect personal information from misuse, loss, and unauthorised access, modification, or disclosure. Our website uses HTTPS encryption, and we limit access to personal information to those within our business who need it.
          </p>
          <p>
            While we take care to protect your information, no transmission over the internet is completely secure. If you believe your information has been compromised, please contact us immediately.
          </p>

          <h2>8. Data retention</h2>
          <p>
            We retain personal information for as long as necessary to fulfil the purposes for which it was collected, or as required by law. When information is no longer needed, we take reasonable steps to destroy or de-identify it.
          </p>

          <h2>9. Your rights</h2>
          <p>Under the Australian Privacy Act, you have the right to:</p>
          <ul>
            <li><strong>Access</strong> the personal information we hold about you;</li>
            <li><strong>Correct</strong> any personal information that is inaccurate, out of date, incomplete, or misleading;</li>
            <li><strong>Opt out</strong> of direct marketing at any time; and</li>
            <li><strong>Complain</strong> about how we have handled your personal information.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@beyondopenrate.com.au">privacy@beyondopenrate.com.au</a>.
            We will respond within a reasonable time (generally 30 days).
          </p>

          <h2>10. Complaints</h2>
          <p>
            If you have a privacy concern or complaint, please contact us first so we can try to resolve it directly. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at{" "}
            <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">oaic.gov.au</a>.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The current version will always be available at beyondopenrate.com.au/privacy-policy. We encourage you to review it periodically.
          </p>

          <h2>12. Contact us</h2>
          <p>
            For privacy-related enquiries, please contact us at:{" "}
            <a href="mailto:privacy@beyondopenrate.com.au">privacy@beyondopenrate.com.au</a>
          </p>
        </div>
      </section>
    </>
  );
}
