import { site } from "./site";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    // ProfessionalService is a LocalBusiness subtype — helps AI engines and
    // Google answer "best email agency in Australia"-style queries by
    // signalling a real service business with a defined service area,
    // not just a generic publisher/organization.
    "@type": ["Organization", "ProfessionalService"],
    name: site.legalName,
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/icon.png`,
    description: site.description,
    foundingDate: site.founded,
    areaServed: { "@type": "Country", name: "Australia" },
    priceRange: "$$",
    sameAs: site.sameAs,
  };
}

export function personSchema(args: {
  name: string;
  jobTitle: string;
  url?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: args.name,
    jobTitle: args.jobTitle,
    worksFor: { "@type": "Organization", name: site.legalName, url: site.url },
    ...(args.url ? { url: args.url } : {}),
    ...(args.sameAs?.length ? { sameAs: args.sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  slug?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: args.areaServed ?? "Australia",
    ...(args.slug ? { url: `${site.url}/services/${args.slug}` } : {}),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(args: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: args.url,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt ?? args.publishedAt,
    author:
      args.author === "Tim Bowman"
        ? { "@type": "Person", name: "Tim Bowman", jobTitle: "Founder", url: `${site.url}/about` }
        : { "@type": "Organization", name: args.author ?? site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.png` },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
