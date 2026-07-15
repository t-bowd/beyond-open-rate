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
    title: "Monthly retainer",
    blurb:
      "Full lifecycle email management under one monthly engagement, flows, campaigns, copy, design, deliverability, and reporting.",
    description:
      "Your email program needs more than someone pressing send. We manage the full thing: strategy, copy, flows, testing, deliverability, reporting. Every decision tied back to revenue. Built to run without you managing it.",
  },
    {
    slug: "copy-and-design",
    href: "/foundations",
    num: "03",
    title: "Email foundations & projects",
    blurb:
      "The flows your email program needs to start converting, retaining, and recovering customers, scoped to your business and built to run without you.",
    description:
      "Every day without the right foundation or flows is lost revenue you're not getting back. We scope, build and hand over a program that works, so you stop losing the customers you already paid to acquire.",
  },
  {
    slug: "campaign-management",
    href: "/audit",
    num: "02",
    title: "Email audit",
    blurb:
      "Find out exactly what your email program is worth, and what it's costing you. A complete diagnostic with a prioritised action plan.",
    description:
      "If you don't know where your email program really stands, then you're making decisions in the dark. We go through everything: flows, campaigns, list health, deliverability, copy. We tell you what it's costing you and what fixing it is worth.",
  },

  {
    slug: "platform-and-crm-setup",
    href: "/strategy",
    num: "04",
    title: "Strategy session",
    blurb:
      "Stop guessing what to build. A working session that maps your lifecycle, identifies the highest-impact opportunities, and leaves you with a plan you can act on.",
    description:
      "Not sure what to build next? What to fix first? Whether what you have is worth keeping? Spend a working session with us defining a clear plan, an action list, and an estimate of what better email is worth to your business. No pitch, just direction.",
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

import faqData from "../content/settings/faqs.json";
export const faqs: Faq[] = faqData.items;
