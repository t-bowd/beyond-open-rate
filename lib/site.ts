import siteJson from "../content/settings/site.json";

export const site: {
  name: string;
  shortName: string;
  url: string;
  description: string;
  phone: string;
  locale: string;
  ogImage: string;
  twitter: string;
  legalName: string;
  founded: string;
  sameAs: string[];
  social: { linkedin: string; facebook: string; instagram: string };
} = siteJson;

export type SiteConfig = typeof site;
