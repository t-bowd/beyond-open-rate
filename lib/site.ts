export const site = {
  name: "Beyond Open Rate",
  shortName: "BOR",
  url: "https://www.beyondopenrate.com.au",
  description:
    "Email marketing agency for Australian e-commerce brands. Lifecycle automation, Klaviyo management, campaigns, and deliverability — built to turn your list into predictable revenue.",
  locale: "en_AU",
  ogImage: "/opengraph-image",
  twitter: "@beyondopenrate",
  legalName: "Beyond Open Rate",
  founded: "2026",
  sameAs: [
    "https://www.linkedin.com/company/beyond-openrate/",
    "https://share.google/CDL1xsjQbqoCbIO2M",
  ] as string[],
} as const;

export type SiteConfig = typeof site;
