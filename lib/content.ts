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
  {
    q: "Which email platforms do you work in?",
    a: "We work day to day in Klaviyo, HubSpot, Customer.io and Mailchimp, and we'll happily migrate you if you're on the wrong tool. If you're not sure what you're on, the audit will tell you.",
  },
  {
    q: "Do you only work with e-commerce?",
    a: "No — e-commerce and SaaS are where we do our best work, but any business with a list and something to sell is a fit. The mechanics of good lifecycle email travel well.",
  },
  {
    q: "How are you priced?",
    a: "A flat monthly retainer based on scope — no surprise hourly bills. Most clients start with a fixed build project, then move to an ongoing retainer once the foundations are live.",
  },
  {
    q: "How long until we see results?",
    a: "Your first automated flow is usually live within two weeks, and that's typically where early revenue shows up. Campaign performance compounds from there over the following months.",
  },
  {
    q: "What do you need from us to start?",
    a: "Access to your email platform and store, your brand assets, and a half-hour kickoff call. We handle the rest and keep the back-and-forth light.",
  },
];
