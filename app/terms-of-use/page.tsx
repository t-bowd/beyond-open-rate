import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Website Terms of Use | Beyond Marketing",
  description: "The terms that govern your use of the Beyond Marketing website.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUse() {
  const updated = "22 October 2026";

  return (
    <>
      <PageHero
        label="Terms of Use"
        title="Website Terms of Use"
        sub="The terms that apply when you use our website."
      />

      <section className="section">
        <div className="wrap prose" style={{ maxWidth: 740 }}>
          <p><em>Last updated: {updated}</em></p>

          <h2>1. About these Terms</h2>
          <p>
            These Terms of Use govern your access to and use of beyondmarketing.com.au (the &ldquo;<strong>Site</strong>&rdquo;), operated by Solstice Endeavours Pty Limited t/as Beyond Marketing Australia (ABN 91 693 195 836) (&ldquo;<strong>Beyond Marketing</strong>&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
          </p>
          <p>
            These Terms apply to your use of the Site itself. They do not govern the provision of our services. If you engage us, that engagement is governed by our Master Services Agreement and the applicable Schedule, signed separately.
          </p>

          <h2>2. Who we are and what the Site is for</h2>
          <p>
            The Site provides information about Beyond Marketing&rsquo;s services, including our audit tool, strategy session bookings, and general content and resources. It is not itself a service delivery platform. Engaging our services requires a separate signed agreement.
          </p>

          <h2>3. Acceptable use</h2>
          <p>When using the Site, you must not:</p>
          <ul>
            <li>use the Site for any unlawful purpose, or in a way that infringes the rights of any other person;</li>
            <li>attempt to gain unauthorised access to the Site, our systems, or any account or data held on them;</li>
            <li>upload, transmit, or introduce any virus, malware, or other harmful code;</li>
            <li>scrape, harvest, or use automated tools to extract content or data from the Site, other than standard search engine indexing; or</li>
            <li>submit false, misleading, or fraudulent information through any form, tool, or booking function on the Site.</li>
          </ul>
          <p>We may restrict or block access to the Site for anyone we reasonably believe is in breach of this clause.</p>

          <h2>4. Tools, audits and bookings</h2>
          <p>
            Where the Site offers a free tool (such as our email audit tool), a booking function (such as a strategy session), or similar interactive feature, that feature is provided for general informational purposes based on the information you provide. Outputs from these tools are not a substitute for a full paid engagement, and we do not warrant their completeness or accuracy for your specific circumstances.
          </p>

          <h2>5. No guarantee arises from the Site</h2>
          <p>
            The Site may refer to results we&apos;ve achieved for other clients, case studies, testimonials, and our performance guarantee (&ldquo;beat your benchmarks in 90 days or we&apos;ll work for free&rdquo;). These references are general marketing information only. They do not constitute an offer capable of acceptance, and no guarantee, warranty, or binding commitment arises from your use of the Site. Any guarantee we offer only applies where it is expressly set out in a signed Schedule under our Master Services Agreement, and is subject to the conditions and exclusions in that Schedule.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            Unless otherwise indicated, all content on the Site, including text, graphics, logos, and design, is owned by or licensed to Beyond Marketing and protected by Australian copyright and trade mark law. You may view and download content for your own personal, non-commercial reference. You must not reproduce, distribute, modify, or commercially exploit any content from the Site without our prior written consent.
          </p>

          <h2>7. Third-party links and platforms</h2>
          <p>
            The Site may contain links to third-party websites and reference third-party platforms we partner with or work across. We don&apos;t control these third parties and are not responsible for their content, availability, or practices. Links are provided for convenience and don&apos;t imply endorsement, except where we&apos;ve disclosed a genuine partnership (for example, our Klaviyo Partner status).
          </p>

          <h2>8. Privacy</h2>
          <p>
            Our collection and handling of personal information through the Site is set out in our <Link href="/privacy-policy">Privacy Policy</Link>, which forms part of these Terms.
          </p>

          <h2>9. Disclaimers</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul>
            <li>the Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, including as to accuracy, completeness, or fitness for a particular purpose;</li>
            <li>we don&apos;t warrant that the Site will be uninterrupted, secure, or error-free; and</li>
            <li>general content on the Site (including blog posts and resources) is provided for general information only and isn&apos;t personalised advice for your business.</li>
          </ul>
          <p>
            Nothing in these Terms excludes, restricts, or modifies any consumer guarantee under the Australian Consumer Law that cannot lawfully be excluded.
          </p>

          <h2>10. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Beyond Marketing is not liable for any loss or damage arising from your use of, or inability to use, the Site, including any Consequential Loss (such as loss of profit, revenue, or data), except where that liability cannot be excluded by law.
          </p>

          <h2>11. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The current version will always be available at beyondmarketing.com.au/terms-of-use. Continued use of the Site after an update means you accept the revised Terms.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These Terms are governed by the laws of New South Wales, Australia, and you submit to the non-exclusive jurisdiction of its courts.
          </p>

          <h2>13. Contact us</h2>
          <p>
            Questions about these Terms can be directed to{" "}
            <a href="mailto:hello@beyondmarketing.com.au">hello@beyondmarketing.com.au</a>.
          </p>
        </div>
      </section>
    </>
  );
}
