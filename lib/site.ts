export const site = {
  name: "Beyond Open Rate",
  shortName: "BOR",
  url: "https://beyondopenrate.com.au",
  description:
    "Email marketing, lifecycle and automation for e-commerce and SaaS brands — built to turn quiet subscribers into predictable, repeat revenue.",
  locale: "en_AU",
  ogImage: "/opengraph-image",
  twitter: "@beyondopenrate",
  legalName: "Beyond Open Rate",
  founded: "2026",
  sameAs: [] as string[],
} as const;

export type SiteConfig = typeof site;
