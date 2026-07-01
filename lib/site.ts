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
    "https://www.facebook.com/people/Beyond-Open-Rate/61590700829635/",
    "https://www.instagram.com/beyondopenrate",
  ] as string[],
  social: {
    linkedin: "https://www.linkedin.com/company/beyond-openrate/",
    facebook: "https://www.facebook.com/people/Beyond-Open-Rate/61590700829635/",
    instagram: "https://www.instagram.com/beyondopenrate",
  },
} as const;

export type SiteConfig = typeof site;
