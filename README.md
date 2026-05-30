# Beyond Open Rate — Next.js site

A clean, single-page marketing site for the email agency, built with the
**Next.js App Router** and React. No Tweaks panel — this is the production
starting point.

## Requirements

- [Node.js](https://nodejs.org) 18.18 or newer

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To build and run the production version:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.jsx      Root layout — loads fonts (next/font) + global CSS + metadata
  page.jsx        Composes the page from section components
  globals.css     The full design system + all section styles
components/
  Header.jsx      Sticky nav + mobile menu          (client)
  Hero.jsx        Headline + "free audit" form       (client)
  Logos.jsx       Client logo strip                  (server)
  Services.jsx    Six service cards                  (server)
  Results.jsx     Orange stats band, animated counts (client)
  Process.jsx     Three-step process                 (server)
  Testimonial.jsx Pull quote                         (server)
  Faq.jsx         Accordion                          (client)
  Contact.jsx     Validated contact form             (client)
  Footer.jsx      Footer                             (server)
  Reveal.jsx      Scroll-in animation wrapper        (client)
```

Components marked **client** use `"use client"` because they have state or
browser APIs; the rest render on the server.

## Things to wire up next

- **Contact form** (`components/Contact.jsx`) currently just shows a success
  state. Look for the `// TODO: POST to your API` comment and connect it to your
  email service or a Next.js route handler (`app/api/contact/route.js`).
- **Hero audit form** dispatches a `bor:prefill` event that the contact form
  listens for — hook the same submit into your backend when ready.
- **Client logos** are text placeholders in `components/Logos.jsx`. Swap in real
  logo images (drop files in `public/` and use `next/image`).
- **Stats** in `components/Results.jsx` are illustrative — replace with real
  numbers.
- **Brand color & fonts** live as CSS custom properties at the top of
  `app/globals.css` (`--accent`, `--font-*`). Change them in one place.

## Fonts

Loaded via `next/font/google` in `app/layout.jsx` (Bricolage Grotesque for
headings, Hanken Grotesk for body, Space Mono for labels) — self-hosted at build
time, no external requests.
