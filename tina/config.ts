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
