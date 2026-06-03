import "./globals.css";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/jsonld";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Email marketing agency, Australia`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Email marketing agency, Australia`,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Email marketing agency, Australia`,
    description: site.description,
    site: site.twitter,
  },
  robots: { index: true, follow: true },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#E26F6F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${hanken.variable} ${spaceMono.variable}`}
    >
      <body>
        <Header />
        <main id="top">{children}</main>
        <Footer />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
