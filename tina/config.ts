import { defineConfig } from "tinacms";

export default defineConfig({
  branch:
    process.env.GITHUB_BRANCH ??
    process.env.VERCEL_GIT_COMMIT_REF ??
    "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Blog Posts ─────────────────────────────────────────────────────
      {
        name: "blog",
        label: "Blog Posts",
        path: "content/blog",
        format: "mdx",
        ui: {
          filename: {
            slugify: (values) =>
              values.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") ?? "",
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
            ui: { component: "textarea" },
            required: true,
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Published Date",
            required: true,
          },
          {
            type: "datetime",
            name: "updatedAt",
            label: "Updated Date",
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            options: ["Tim", "Tara"],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft (hide from site)",
          },
          {
            type: "object",
            name: "faq",
            label: "FAQs",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.q ?? "FAQ" }),
            },
            fields: [
              {
                type: "string",
                name: "q",
                label: "Question",
              },
              {
                type: "string",
                name: "a",
                label: "Answer",
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },

      // ── SEO Pages ──────────────────────────────────────────────────────
      {
        name: "seoPage",
        label: "SEO Pages",
        path: "content/seo",
        format: "mdx",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title Tag",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "h1",
            label: "H1 Headline",
            required: true,
          },
          {
            type: "string",
            name: "heroSub",
            label: "Hero Subheadline",
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
            ui: { component: "textarea" },
            required: true,
          },
          {
            type: "string",
            name: "type",
            label: "Page Type",
            options: ["platform", "service", "location"],
          },
          {
            type: "string",
            name: "location",
            label: "Location",
          },
          {
            type: "string",
            name: "platform",
            label: "Platform",
          },
          {
            type: "object",
            name: "faq",
            label: "FAQs",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.q ?? "FAQ" }),
            },
            fields: [
              {
                type: "string",
                name: "q",
                label: "Question",
              },
              {
                type: "string",
                name: "a",
                label: "Answer",
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },

      // ── Site Settings (singleton) ──────────────────────────────────────
      {
        name: "siteSettings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        match: { include: "site" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Site Name",
          },
          {
            type: "string",
            name: "description",
            label: "Site Description",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "phone",
            label: "Phone Number",
          },
          {
            type: "string",
            name: "twitter",
            label: "Twitter / X Handle",
          },
          {
            type: "string",
            name: "legalName",
            label: "Legal Name",
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
              },
              {
                type: "string",
                name: "facebook",
                label: "Facebook URL",
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram URL",
              },
            ],
          },
        ],
      },

      // ── Testimonials (singleton list) ──────────────────────────────────
      {
        name: "testimonials",
        label: "Testimonials",
        path: "content/settings",
        format: "json",
        match: { include: "testimonials" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Reviews",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.name ?? "Review" }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name (first name + last initial only)",
                required: true,
              },
              {
                type: "string",
                name: "initial",
                label: "Initial (single letter for avatar)",
                required: true,
              },
              {
                type: "string",
                name: "text",
                label: "Review Text",
                ui: { component: "textarea" },
                required: true,
              },
              {
                type: "number",
                name: "rating",
                label: "Rating (1–5)",
              },
            ],
          },
        ],
      },

      // ── Homepage (singleton) ──────────────────────────────────────────
      {
        name: "homepage",
        label: "Homepage",
        path: "content/homepage",
        format: "json",
        match: { include: "homepage" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "headlinePre", label: "Headline (before highlight)" },
              { type: "string", name: "headlineHighlight", label: "Headline (highlighted phrase)" },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "CTA Button Text" },
              { type: "string", name: "noteWitty", label: "Note below form" },
            ],
          },
          {
            type: "object",
            name: "narrative",
            label: "Narrative Letter",
            fields: [
              {
                type: "string",
                name: "paragraphs",
                label: "Paragraphs",
                list: true,
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "object",
            name: "positioning",
            label: "Positioning",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "headline", label: "Headline" },
              {
                type: "string",
                name: "bodyParagraphs",
                label: "Body Paragraphs",
                list: true,
                ui: { component: "textarea" },
              },
            ],
          },
          {
            type: "object",
            name: "guarantee",
            label: "Guarantee",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "CTA Button Text" },
              { type: "string", name: "ctaHref", label: "CTA Link" },
            ],
          },
          {
            type: "object",
            name: "growFaster",
            label: "Grow Faster (Stats)",
            fields: [
              { type: "string", name: "headline", label: "Headline", ui: { component: "textarea" } },
              { type: "string", name: "subheadline", label: "Subheadline", ui: { component: "textarea" } },
              {
                type: "object",
                name: "stats",
                label: "Stats",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.prefix + item?.target + item?.suffix || "Stat",
                  }),
                },
                fields: [
                  { type: "number", name: "target", label: "Number" },
                  { type: "string", name: "prefix", label: "Prefix (e.g. $)" },
                  { type: "string", name: "suffix", label: "Suffix (e.g. %, x)" },
                  { type: "string", name: "label", label: "Description", ui: { component: "textarea" } },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "splitOffer",
            label: "Split Offer",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow" },
              {
                type: "object",
                name: "offers",
                label: "Offer Cards",
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item?.title ?? "Offer" }),
                },
                fields: [
                  { type: "string", name: "id", label: "ID (strategy or audit — do not change)" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
                  { type: "string", name: "ctaText", label: "CTA Button Text" },
                  { type: "string", name: "ctaHref", label: "CTA Link" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "finalCta",
            label: "Final CTA",
            fields: [
              { type: "string", name: "platforms", label: "Platform Badges", list: true },
              { type: "string", name: "headline", label: "Headline", ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "CTA Button Text" },
              { type: "string", name: "ctaHref", label: "CTA Link" },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "string", name: "taglineLine1", label: "Tagline line 1" },
              { type: "string", name: "taglineLine2", label: "Tagline line 2" },
            ],
          },
        ],
      },

      // ── Service Pages ─────────────────────────────────────────────────
      {
        name: "servicePages",
        label: "Service Pages",
        path: "content/pages/services",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          router: ({ document }) => `/${document._sys.filename}`,
        },
        fields: [
          {
            type: "object",
            name: "meta",
            label: "SEO",
            fields: [
              { type: "string", name: "title", label: "Page Title", isTitle: true, required: true },
              { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" }, required: true },
            ],
          },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "label", label: "Label (eyebrow)" },
              { type: "string", name: "titlePre", label: "Title (before highlight)" },
              { type: "string", name: "titleHighlight", label: "Title (highlighted phrase)" },
              { type: "string", name: "titlePost", label: "Title (after highlight)" },
              { type: "string", name: "sub", label: "Subheadline", ui: { component: "textarea" } },
            ],
          },
          {
            type: "string",
            name: "intro",
            label: "Intro Paragraphs",
            list: true,
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "benefits",
            label: "Benefits",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "items", label: "Items", list: true, ui: { component: "textarea" } },
              { type: "string", name: "ctaText", label: "CTA Button Text" },
              { type: "string", name: "ctaHref", label: "CTA Link" },
            ],
          },
          {
            type: "object",
            name: "faq",
            label: "FAQs",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.q ?? "FAQ" }) },
            fields: [
              { type: "string", name: "q", label: "Question", required: true },
              { type: "string", name: "a", label: "Answer", ui: { component: "textarea" }, required: true },
            ],
          },
        ],
      },

      // ── About Page (singleton) ─────────────────────────────────────────
      {
        name: "about",
        label: "About Page",
        path: "content/pages",
        format: "json",
        match: { include: "about" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "meta",
            label: "SEO",
            fields: [
              { type: "string", name: "title", label: "Page Title" },
              { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "titlePre", label: "Title (before highlight)" },
              { type: "string", name: "titleHighlight", label: "Title (highlighted phrase)" },
              { type: "string", name: "titlePost", label: "Title (after highlight)" },
              { type: "string", name: "sub", label: "Subheadline", ui: { component: "textarea" } },
            ],
          },
          {
            type: "string",
            name: "intro",
            label: "Intro Paragraphs",
            list: true,
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "team",
            label: "Team Members",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name ?? "Person" }) },
            fields: [
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "name", label: "Name" },
              { type: "image", name: "photo", label: "Photo" },
              { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "philosophy",
            label: "Our Take on Email",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "workWith",
            label: "Who We Work With",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "wontDo",
            label: "What We Won't Do",
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ── Landing Pages (block-based) ────────────────────────────────────
      {
        name: "landingPages",
        label: "Landing Pages",
        path: "content/landing",
        format: "json",
        ui: {
          filename: {
            slugify: (values) =>
              values.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") ?? "",
          },
          router: ({ document }) => `/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Page Title (browser tab)", isTitle: true, required: true },
          { type: "string", name: "description", label: "Meta Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "blocks",
            label: "Page Blocks",
            list: true,
            templates: [
              {
                name: "pageHero",
                label: "Page Hero",
                fields: [
                  { type: "string", name: "label", label: "Label (eyebrow)" },
                  { type: "string", name: "titlePre", label: "Title (before highlight)" },
                  { type: "string", name: "titleHighlight", label: "Title (highlighted phrase)" },
                  { type: "string", name: "titlePost", label: "Title (after highlight)" },
                  { type: "string", name: "sub", label: "Subheadline", ui: { component: "textarea" } },
                  { type: "string", name: "ctaText", label: "CTA Button Text" },
                  { type: "string", name: "ctaHref", label: "CTA Link" },
                ],
              },
              {
                name: "textSection",
                label: "Text Section",
                fields: [
                  { type: "string", name: "heading", label: "Heading (optional)" },
                  { type: "string", name: "paragraphs", label: "Paragraphs", list: true, ui: { component: "textarea" } },
                ],
              },
              {
                name: "guaranteeBand",
                label: "Guarantee Band",
                fields: [
                  { type: "string", name: "_note", label: "Note (internal only)", ui: { component: "textarea" } },
                ],
              },
              {
                name: "benefitsList",
                label: "Benefits List",
                fields: [
                  { type: "string", name: "heading", label: "Heading" },
                  { type: "string", name: "items", label: "Items", list: true, ui: { component: "textarea" } },
                  { type: "string", name: "ctaText", label: "CTA Button Text" },
                  { type: "string", name: "ctaHref", label: "CTA Link" },
                ],
              },
              {
                name: "splitOffer",
                label: "Split Offer",
                fields: [
                  { type: "string", name: "_note", label: "Note (internal only)", ui: { component: "textarea" } },
                ],
              },
              {
                name: "finalCta",
                label: "Final CTA",
                fields: [
                  { type: "string", name: "_note", label: "Note (internal only)", ui: { component: "textarea" } },
                ],
              },
              {
                name: "faqSection",
                label: "FAQ Section",
                fields: [
                  { type: "string", name: "heading", label: "Heading (optional)" },
                  {
                    type: "object",
                    name: "questions",
                    label: "Questions",
                    list: true,
                    ui: { itemProps: (item) => ({ label: item?.q ?? "FAQ" }) },
                    fields: [
                      { type: "string", name: "q", label: "Question", required: true },
                      { type: "string", name: "a", label: "Answer", ui: { component: "textarea" }, required: true },
                    ],
                  },
                ],
              },
              {
                name: "testimonials",
                label: "Testimonials",
                fields: [
                  { type: "string", name: "_note", label: "Note (internal only)", ui: { component: "textarea" } },
                ],
              },
            ],
          },
        ],
      },

      // ── Global FAQs (singleton list) ──────────────────────────────────
      {
        name: "globalFaqs",
        label: "Global FAQs",
        path: "content/settings",
        format: "json",
        match: { include: "faqs" },
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          {
            type: "object",
            name: "items",
            label: "FAQ Items",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.q ?? "FAQ" }),
            },
            fields: [
              {
                type: "string",
                name: "q",
                label: "Question",
                required: true,
              },
              {
                type: "string",
                name: "a",
                label: "Answer",
                ui: { component: "textarea" },
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
});
