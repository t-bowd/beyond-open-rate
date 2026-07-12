export type Service = {
  slug: string;
  href?: string;
  num: string;
  title: string;
  blurb: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "lifecycle-automation",
    href: "/retainer",
    num: "01",
    title: "Email retainer",
    blurb:
      "Full lifecycle email management under one monthly engagement, flows, campaigns, copy, design, deliverability, and reporting.",
    description:
      "Everything your email program needs, managed as an extension of your team. One monthly engagement covers flows, campaigns, copy, design, deliverability, and reporting. No separate quotes, no scope creep.",
  },
  {
    slug: "campaign-management",
    href: "/audit",
    num: "02",
    title: "Email audit",
    blurb:
      "Find out exactly what your email program is worth, and what it's costing you. A complete diagnostic with a prioritised action plan.",
    description:
      "A complete diagnostic of your email and lifecycle setup, flows, deliverability, list health, copy, design, and tech stack, delivered with a prioritised action plan and walkthrough session.",
  },
  {
    slug: "copy-and-design",
    href: "/foundations",
    num: "03",
    title: "Email foundations",
    blurb:
      "The flows your email program needs to start converting, retaining, and recovering customers, scoped to your business and built to run without you.",
    description:
      "We build the email foundations that turn first-time buyers into repeat customers. Welcome series, abandoned cart, post-purchase, win-back, scoped to your business, written in your voice, and handed over with a 30-day monitoring period.",
  },
  {
    slug: "platform-and-crm-setup",
    href: "/strategy",
    num: "04",
    title: "Email strategy",
    blurb:
      "Stop guessing what to build. A working session that maps your lifecycle, identifies the highest-impact opportunities, and leaves you with a plan you can act on.",
    description:
      "A forward-focused strategy session that gives you a clear email plan built for your business, not a template. Walk away knowing exactly what to build, in what order, and what it's worth.",
  },

];

export type ProcessStep = { num: string; title: string; description: string };

export const processSteps: ProcessStep[] = [
  {
    num: "STEP 01",
    title: "Audit",
    description:
      "We tear down your current setup, flows, deliverability, segmentation, and map the gaps costing you money.",
  },
  {
    num: "STEP 02",
    title: "Build",
    description:
      "We stand up the core automations and a campaign calendar, write the copy, and design every template.",
  },
  {
    num: "STEP 03",
    title: "Scale",
    description:
      "We test, segment, and optimise month over month, reporting on revenue, not just opens and clicks.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  // ── Working with us ──────────────────────────────────────────
  {
    q: "Which email platforms do you work with?",
    a: "We work across all major email service providers (ESPs) and customer engagement platforms (CEPs), from established enterprise tools to newer specialists. Whether you're on something widely used, something niche, or nothing yet, we'll work with what you have or advise on the right fit for your stage. Platform choice matters less than how it's set up and used.",
  },
  {
    q: "Do you only work with e-commerce brands?",
    a: "No. We've worked with brands across e-commerce, SaaS, B2B and professional services. If you've got a list and something to sell, we can work together. The mechanics of lifecycle email travel well across industries, and we know how to apply these to work for your business.",
  },
  {
    q: "How are you priced?",
    a: "A flat fee based on scope, recurring monthly for retainer clients. No surprise hourly bills or per-email fees.\n\nMost clients start with a fixed-fee audit and then move to a monthly retainer or build project. We don't do long contracts; it's month-to-month after the initial commitment.",
  },
  {
    q: "How long until we see results?",
    a: "Your first automated flow is usually live within two weeks of kickoff, and that's typically where early revenue shows up. Broadcast campaign performance compounds from there. Our clients see meaningful improvement in revenue per recipient within 60-90 days.",
  },
  {
    q: "What do you need from us to start?",
    a: "Generally, access to your email platform and any connected store or CRM, as well as your brand assets and a half-hour kickoff call. We handle strategy, copy, design and build, aiming to keep back-and-forth as light as possible.",
  },
 
  // ── Email marketing fundamentals ─────────────────────────────
  {
    q: "What is email lifecycle automation?",
    a: "Email lifecycle automation is a set of triggered email sequences that send automatically based on a subscriber's behaviour or status, welcome series when someone signs up, abandoned cart when they leave without buying, post-purchase to drive repeat orders, win-back when they go quiet. Unlike broadcast campaigns, lifecycle flows run continuously without ongoing input, compounding revenue over time.",
  },
 
  {
    q: "What's the difference between email campaigns and email flows?",
    a: "Campaigns are one-off broadcasts sent to a segment at a specific time, a promotion, a new product launch, a newsletter. Flows (also called automations or sequences) are triggered by behaviour and run automatically. Both matter: campaigns keep the list warm and drive short-term revenue; flows earn revenue in the background without ongoing effort.",
  },
  {
    q: "How do you measure email marketing ROI?",
    a: "We use revenue per recipient (RPR) as the primary campaign metric, total revenue attributed to a send divided by the number of recipients. For flows, we track conversion rate per step and monthly revenue contribution. We also monitor list health metrics: engagement rate, spam complaint rate, and unsubscribe rate, because these predict future deliverability and, by extension, future revenue.",
  },

  {
    q: "What is a good email open rate?",
    a: "Open rate is an unreliable metric since Apple's Mail Privacy Protection (launched 2021) pre-fetches tracking pixels for a large portion of Apple Mail users, inflating reported opens. We don't use it as a primary KPI. A better question is: what's your click-to-revenue rate, and what share of total revenue does email drive? For most well-run e-commerce programs, email should account for 20–35% of total revenue.",
  },
  // ── Scope and process ─────────────────────────────────────────
  {
    q: "What does an email audit involve?",
    a: "An email audit reviews every element of your existing email setup: current automations, campaigns, deliverability, tech stack, ESP configuration and reporting. You can read more about our [email audit service here](/email-marketing-audit-australia).",
  },
  {
    q: "How do you approach email list segmentation?",
    a: "Segmentation strategy is driven by your business model and customer behaviour; there's no single right answer. Whether you're e-commerce, SaaS or services, we apply our expertise to build segmentation around what's meaningful for your specific business model. ",
  },
  {
    q: "Do you write the email copy and design the templates?",
    a: "Yes. Copy and design are in-house services provided complimentary to all of our clients. We write in your brand's voice and create mobile-first, accessible templates. Every email is built for your specific audience and objective.",
  },
  {
    q: "Can you migrate us from one ESP to another?",
    a: "Yes. We've handled migrations from Mailchimp, ActiveCampaign and various legacy platforms into Klaviyo, HubSpot, Customer.io and Braze. The process covers every aspect and a warm-up plan to protect deliverability through the transition. If you're thinking about migrating, get in touch with us to discuss an approach.",
  },
];
