export const site = {
  name: "Beyond Open Rate",
  shortName: "BOR",
  url: "https://beyondopenrate.com.au",
  description:
    "Email marketing agency for Australian e-commerce brands. Lifecycle automation, Klaviyo management, campaigns, and deliverability — built to turn your list into predictable revenue.",
  locale: "en_AU",
  ogImage: "/opengraph-image",
  twitter: "@beyondopenrate",
  legalName: "Beyond Open Rate",
  founded: "2026",
  sameAs: [] as string[],
} as const;

export type SiteConfig = typeof site;
