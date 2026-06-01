export type Service = {
  slug: string;
  num: string;
  title: string;
  blurb: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "lifecycle-automation",
    num: "01",
    title: "Lifecycle & automation",
    blurb:
      "Welcome, abandonment, post-purchase, win-back. The always-on flows that earn revenue while you sleep.",
    description:
      "We design and build the automated email flows that quietly run your business — welcome series, browse and cart abandonment, post-purchase, win-back, and re-engagement. Built once, tested into shape, and tuned every month against revenue.",
  },
  {
    slug: "campaign-management",
    num: "02",
    title: "Campaign management",
    blurb:
      "A planned calendar of broadcasts — segmented, scheduled, and sent. We own the whole cadence, not just one-offs.",
    description:
      "A monthly campaign calendar planned around your launches, promotions, and content — segmented, scheduled and sent. We own the full cadence so your list stays warm without you thinking about it.",
  },
  {
    slug: "copy-and-design",
    num: "03",
    title: "Copy & design",
    blurb:
      "On-brand emails that read like a person and convert like a salesperson. Written and designed in-house.",
    description:
      "Every email written and designed in-house — on brand, mobile-first, accessible, and built to convert. No copy-paste templates, no AI slop, no agency outsourcing.",
  },
  {
    slug: "platform-and-crm-setup",
    num: "04",
    title: "Platform & CRM setup",
    blurb:
      "Klaviyo, HubSpot, Customer.io — migrated, integrated, and configured so your data and triggers actually fire.",
    description:
      "Implementation and migration across Klaviyo, HubSpot, Customer.io and Mailchimp. We integrate your store and product data, set up segments and triggers, and make sure the automations actually fire the way you think they do.",
  },
  {
    slug: "deliverability-and-audits",
    num: "05",
    title: "Deliverability & audits",
    blurb:
      "Authentication, list hygiene, and inbox placement — so the emails you send are the emails people see.",
    description:
      "SPF, DKIM, DMARC and BIMI set up properly. List hygiene, sunset policies, warm-up strategies. We audit your current program against best practice and inbox-placement data, then fix what's costing you reach.",
  },
  {
    slug: "reporting-that-matters",
    num: "06",
    title: "Reporting that matters",
    blurb:
      "Revenue per recipient, not vanity opens. Clear monthly reporting tied to the numbers your business runs on.",
    description:
      "Monthly reporting built around revenue per recipient, contribution to total revenue, and flow-level performance. Dashboards your CFO can read, with the context to act on.",
  },
];

export type ProcessStep = { num: string; title: string; description: string };

export const processSteps: ProcessStep[] = [
  {
    num: "STEP 01",
    title: "Audit",
    description:
      "We tear down your current setup — flows, deliverability, segmentation — and map the gaps costing you money.",
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
      "We test, segment, and optimise month over month — reporting on revenue, not just opens and clicks.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  // ── Working with us ──────────────────────────────────────────
  {
    q: "Which email platforms do you work with?",
    a: "We work across all major email service providers (ESPs) and customer engagement platforms (CEPs) — from established enterprise tools to newer specialists. Whether you're on something widely used, something niche, or nothing yet, we'll work with what you have or advise on the right fit for your stage. Platform choice matters less than how it's set up and used.",
  },
  {
    q: "Do you only work with e-commerce brands?",
    a: "No — e-commerce and SaaS are where we do our best work, but any business with a list and something to sell is a fit. The mechanics of lifecycle email — welcome, nurture, re-engagement, win-back — travel well across industries.",
  },
  {
    q: "How are you priced?",
    a: "A flat monthly retainer based on scope — no surprise hourly bills, no per-email fees. Most clients start with a fixed-fee audit and build project, then move to a monthly retainer once the core flows and calendar are live. We don't do long contracts; it's month-to-month after the initial build.",
  },
  {
    q: "How long until we see results?",
    a: "Your first automated flow is usually live within two weeks of kickoff, and that's typically where early revenue shows up. Broadcast campaign performance compounds from there — most clients see meaningful improvement in revenue per recipient within the first quarter.",
  },
  {
    q: "What do you need from us to start?",
    a: "Access to your email platform and any connected store or CRM, your brand assets (logo, fonts, colours), and a half-hour kickoff call. We handle the strategy, copy, design and build — and we keep the back-and-forth as light as possible.",
  },
  {
    q: "Do you do the work yourselves or outsource it?",
    a: "We do the work ourselves. The people you meet in a sales call are the same people writing your emails, building your flows, and reviewing your reports. We deliberately keep client load small so that stays true.",
  },
  // ── Email marketing fundamentals ─────────────────────────────
  {
    q: "What is email lifecycle automation?",
    a: "Email lifecycle automation is a set of triggered email sequences that send automatically based on a subscriber's behaviour or status — welcome series when someone signs up, abandoned cart when they leave without buying, post-purchase to drive repeat orders, win-back when they go quiet. Unlike broadcast campaigns, lifecycle flows run continuously without ongoing input, compounding revenue over time.",
  },
  {
    q: "What email automations should every e-commerce brand have?",
    a: "At minimum: a welcome series (3–5 emails introducing the brand and making the first purchase easy), an abandoned cart sequence (1–3 emails recovering lost revenue), a post-purchase flow (reinforcing the decision and seeding repeat purchase), and a win-back sequence for lapsed buyers. These four flows alone typically account for 15–30% of total email-attributed revenue.",
  },
  {
    q: "What's the difference between email campaigns and email flows?",
    a: "Campaigns are one-off broadcasts sent to a segment at a specific time — a promotion, a new product launch, a newsletter. Flows (also called automations or sequences) are triggered by behaviour and run automatically. Both matter: campaigns keep the list warm and drive short-term revenue; flows earn revenue in the background without ongoing effort.",
  },
  {
    q: "How do you measure email marketing ROI?",
    a: "We use revenue per recipient (RPR) as the primary campaign metric — total revenue attributed to a send divided by the number of recipients. For flows, we track conversion rate per step and monthly revenue contribution. We also monitor list health metrics: engagement rate, spam complaint rate, and unsubscribe rate, because these predict future deliverability and, by extension, future revenue.",
  },
  {
    q: "Why is email deliverability important and how do you improve it?",
    a: "Deliverability determines whether your emails reach the inbox, the promotions tab, or spam. The main levers are: authentication (SPF, DKIM, DMARC set up and enforcing), list hygiene (removing bounced and chronically unengaged addresses), sending cadence and consistency, and spam complaint rate (keep it under 0.1%). A deliverability problem can silently kill an email program — revenue drops but opens look fine because the people who do see the email skew toward the engaged minority.",
  },
  {
    q: "What is a good email open rate?",
    a: "Open rate is an unreliable metric since Apple's Mail Privacy Protection (launched 2021) pre-fetches tracking pixels for a large portion of Apple Mail users, inflating reported opens. We don't use it as a primary KPI. A better question is: what's your click-to-revenue rate, and what share of total revenue does email drive? For most well-run e-commerce programs, email should account for 20–35% of total revenue.",
  },
  // ── Scope and process ─────────────────────────────────────────
  {
    q: "What does an email audit involve?",
    a: "An email audit reviews your current flows (are the right automations live, are they converting), your broadcast strategy (cadence, segmentation, relevance), your deliverability setup (authentication, list hygiene, inbox placement), your ESP configuration (data integrations, segment logic, trigger accuracy), and your reporting (are you measuring the right things). We produce a prioritised list of gaps and recommended next moves, with estimated revenue impact where we can.",
  },
  {
    q: "How do you approach email list segmentation?",
    a: "Segmentation strategy is driven by your business model and customer behaviour — there's no single right answer. Most programs start by separating engaged and disengaged subscribers to protect deliverability and improve relevance. From there, the right layers depend on your data: for e-commerce, RFM (Recency, Frequency, Monetary value) is a powerful framework for identifying high-value customers worth nurturing and lapsed buyers worth recovering. For SaaS, plan tier and product usage signals tend to be more useful. We build segmentation around what's meaningful for your specific revenue model, not what's technically available in your platform.",
  },
  {
    q: "Do you write the email copy and design the templates?",
    a: "Yes — copy and design are in-house, not outsourced. We write in the brand's voice and design mobile-first, accessible templates. We don't use AI-generated copy or off-the-shelf template libraries. Every email is built for the specific audience and objective.",
  },
  {
    q: "Can you migrate us from one ESP to another?",
    a: "Yes. We've handled migrations from Mailchimp, ActiveCampaign, and various legacy platforms into Klaviyo, HubSpot, and Customer.io. The process covers data export and mapping, list import and tag/segment recreation, flow rebuilding in the new platform, sending domain authentication setup, and a warm-up plan to protect deliverability through the transition.",
  },
];
