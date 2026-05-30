# Beyond Open Rate

Marketing site + lead-magnet tools for the email marketing & lifecycle
automation consultancy. Built on the **Next.js 14 App Router** with
TypeScript. Deployed on Vercel; lead capture writes to Supabase.

Production: <https://beyondopenrate.com.au>

---

## Local development

```bash
yarn install
yarn dev      # http://localhost:3000
```

Production build:

```bash
yarn build
yarn start
```

You'll need `.env.local` for the lead pipeline to work — see [Environment
variables](#environment-variables) below.

---

## Project layout

```
app/
  layout.tsx              root layout: fonts, header, footer, JSON-LD
  page.tsx                home (composed sections)
  globals.css             full design system + section/post/quiz styles
  sitemap.ts              auto-generated /sitemap.xml
  robots.ts               auto-generated /robots.txt
  about/                  /about
  blog/                   /blog (index) + /blog/[slug] (MDX posts)
  contact/                /contact (form, reads ?site= from URL)
  process/                /process
  services/               /services
  thank-you/              post-submit landing (noindex)
  tools/                  /tools (hub) + /tools/email-audit (quiz)
  api/lead/route.ts       single POST endpoint for every form/tool

components/
  Header, Footer, Hero, Logos, Services, Process, Testimonial,
  Faq, Contact, Reveal, CtaBand
  quiz/EmailAudit.tsx     audit quiz client component

content/blog/             MDX posts with frontmatter

lib/
  site.ts                 single source of truth for site metadata
  jsonld.tsx              JSON-LD helpers (Org, WebSite, Service,
                          Article, FAQPage, HowTo, BreadcrumbList)
  supabase.ts             server-side Supabase admin client
  lead.ts                 captureLead() — inserts to leads table
  blog.ts                 MDX loader + frontmatter parsing
  analytics.ts            track() stub pushing to window.dataLayer
  content.ts              services/process/faq content shared across pages
  quiz/email-audit.ts     quiz questions, scoring, recommendations

public/llms.txt           short LLM crawler manifest
```

---

## SEO / AEO foundations

- **Per-route metadata** (title template, description, OG, Twitter,
  canonical) via the Next.js Metadata API.
- **JSON-LD** on every page: `Organization` + `WebSite` from layout,
  `BreadcrumbList` per route, and per-page extras: `Service` on
  /services, `FAQPage` on /, /process, blog posts, and quiz, `Article`
  on blog posts, `HowTo` on /tools/email-audit.
- **`/sitemap.xml`** auto-includes all static routes + every published
  blog post (uses `lib/blog.getAllPosts()`).
- **`/robots.txt`** points at the sitemap and allows everything.
- **`/llms.txt`** for LLM crawler discovery (about page + key URLs).
- **`/thank-you`** is `noindex` so it doesn't pollute search.

---

## Lead capture pipeline

Every form (contact form on `/` and `/contact`, the quiz on
`/tools/email-audit`) posts to `POST /api/lead`. The route:

1. Validates body with zod (email format, allowed `source`, sizes).
2. Rejects honeypot (`company` field) and rate-limits 5/min per IP.
3. Calls `captureLead()` → inserts into the Supabase `leads` table
   (RLS on; only the service role key can write).
4. Returns `{ ok: true, id }` on success, `{ ok: false, error }` on
   failure with the appropriate HTTP status.

Supabase schema:

```sql
create extension if not exists "pgcrypto";

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  name          text,
  website       text,
  message       text,
  source        text not null,
  payload       jsonb not null default '{}'::jsonb,
  user_agent    text,
  ip            text,
  created_at    timestamptz not null default now()
);

create index leads_email_idx       on public.leads (email);
create index leads_source_idx      on public.leads (source);
create index leads_created_at_idx  on public.leads (created_at desc);

alter table public.leads enable row level security;
```

`source` values currently in use:

- `contact-form` — the main contact form
- `tool:email-audit` — the audit quiz (full answers + score in `payload`)

(`hero-audit` is reserved but unused — the Hero form just navigates to
`/contact?site=…` rather than capturing directly.)

---

## Environment variables

`.env.local` (local) and Vercel project env (Production + Preview):

| Variable                      | Used by             | Where to get it                                  |
| ----------------------------- | ------------------- | ------------------------------------------------ |
| `SUPABASE_URL`                | `lib/supabase.ts`   | Supabase Dashboard → Project Settings → API      |
| `SUPABASE_SERVICE_ROLE_KEY`   | `lib/supabase.ts`   | Same page — the `service_role` key (not `anon`)  |

The service role key bypasses RLS. **Never expose it to the browser.**
It's only read in server-only code (`lib/supabase.ts`, called from
`/api/lead`).

See `.env.example` for the local file template.

---

## Deploying to Vercel

First-time setup:

1. Push the repo to GitHub (if you haven't already).
2. <https://vercel.com/new> → import the repo. Vercel auto-detects
   Next.js — no build overrides needed.
3. Before the first deploy, add the env vars (Project → Settings →
   Environment Variables) for **Production** _and_ **Preview**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. The first build produces a `*.vercel.app` URL — test the
   form end-to-end against it.

Custom domain:

1. Project → Settings → Domains → add `beyondopenrate.com.au` and
   `www.beyondopenrate.com.au`.
2. Vercel will show DNS records to add at your registrar. Typically:
   - Apex: `A` record to `76.76.21.21`
   - `www`: `CNAME` to `cname.vercel-dns.com`
3. Wait for SSL provisioning (a few minutes).
4. Decide which is canonical (`apex` recommended) and have Vercel
   redirect the other.

Post-deploy:

- **Google Search Console** — add the property, verify via DNS TXT,
  submit `https://beyondopenrate.com.au/sitemap.xml`.
- **Bing Webmaster Tools** — same, import from Search Console.
- **GTM/GA4** — already set up per other Beyond Open Rate notes. Add
  the GTM container snippet to `app/layout.tsx` when ready (analytics
  events already fire to `window.dataLayer`).
- **Check `/robots.txt`, `/sitemap.xml`, `/llms.txt`** all serve from
  the production domain.

Adding a new env var later requires a redeploy (Vercel rebuilds on the
next push, or trigger one from the dashboard).

---

## Writing a blog post

Drop a `.mdx` file in `content/blog/`. Frontmatter:

```yaml
---
title: "Post title"
description: "1-2 sentence summary, used for OG + meta description."
publishedAt: "2026-05-30"
updatedAt: "2026-05-30"      # optional
author: "Beyond Open Rate"   # optional
tags: ["lifecycle", "metrics"]
faq:                          # optional — emits FAQPage schema
  - q: "Question"
    a: "Answer"
draft: true                  # optional — skips from index + sitemap
---
```

Then write Markdown / MDX. The post is added to `/blog`, gets its own
URL at `/blog/<slug>`, appears in the sitemap, and emits `Article` +
`BreadcrumbList` (+ `FAQPage` if you provided faqs) JSON-LD.

---

## Adding a tool

1. Add the data + scoring in `lib/quiz/<tool-slug>.ts` (or any
   structure you like for non-quiz tools).
2. Build the UI as a client component in `components/<tool>/...`.
3. Create `app/tools/<tool-slug>/page.tsx` — the landing page wraps
   the tool, emits `HowTo` + `FAQPage` + `BreadcrumbList` JSON-LD.
4. List the tool on `app/tools/page.tsx`.
5. Add `/tools/<tool-slug>` to `app/sitemap.ts` `staticRoutes`.
6. Use `source: 'tool:<tool-slug>'` when calling `/api/lead`.

---

## Fonts

Loaded via `next/font/google` in `app/layout.tsx`:

- **Bricolage Grotesque** — headings (`--font-display`)
- **Hanken Grotesk** — body (`--font-body`)
- **Space Mono** — labels, meta (`--font-mono`)

All self-hosted at build time, no external requests at runtime.

## Theme

Brand color and tokens live as CSS custom properties at the top of
`app/globals.css` (`--accent`, `--ink`, `--bg`, `--font-*`). Change in
one place; propagates everywhere.
