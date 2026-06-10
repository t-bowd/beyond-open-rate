export type ChoiceOption = {
  value: string;
  label: string;
  score?: number;
};

export type Question =
  | {
      id: string;
      kind: "single";
      prompt: string;
      help?: string;
      options: ChoiceOption[];
    }
  | {
      id: string;
      kind: "multi";
      prompt: string;
      help?: string;
      options: ChoiceOption[];
    }
  | {
      id: string;
      kind: "text";
      prompt: string;
      help?: string;
      placeholder?: string;
    };

export const questions: Question[] = [
  {
    id: "industry",
    kind: "single",
    prompt: "What kind of business are you?",
    options: [
      { value: "ecommerce", label: "E-commerce" },
      { value: "saas", label: "SaaS" },
      { value: "services", label: "Services / B2B" },
      { value: "media", label: "Media / publishing" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "list_size",
    kind: "single",
    prompt: "Roughly how big is your email list?",
    options: [
      { value: "<1k", label: "Under 1,000" },
      { value: "1k-10k", label: "1,000 – 10,000" },
      { value: "10k-50k", label: "10,000 – 50,000" },
      { value: "50k+", label: "Over 50,000" },
    ],
  },
  {
    id: "platform",
    kind: "single",
    prompt: "Which ESP / email platform are you on?",
    options: [
      { value: "klaviyo", label: "Klaviyo" },
      { value: "mailchimp", label: "Mailchimp" },
      { value: "hubspot", label: "HubSpot" },
      { value: "customerio", label: "Customer.io" },
      { value: "activecampaign", label: "ActiveCampaign" },
      { value: "other", label: "Something else" },
      { value: "none", label: "Nothing yet" },
    ],
  },
  {
    id: "flows",
    kind: "multi",
    prompt: "Which automated flows do you have live today?",
    help: "Tick everything that's actually running, not just planned.",
    options: [
      { value: "welcome", label: "Welcome series", score: 10 },
      { value: "abandoned_cart", label: "Abandoned cart", score: 10 },
      { value: "abandoned_browse", label: "Abandoned browse", score: 5 },
      { value: "post_purchase", label: "Post-purchase", score: 10 },
      { value: "winback", label: "Win-back / re-engagement", score: 5 },
      { value: "none", label: "None of these", score: 0 },
    ],
  },
  {
    id: "cadence",
    kind: "single",
    prompt: "How often do you send broadcast campaigns?",
    options: [
      { value: "weekly", label: "About weekly", score: 10 },
      { value: "fortnightly", label: "Every couple of weeks", score: 7 },
      { value: "monthly", label: "Roughly monthly", score: 5 },
      { value: "sporadic", label: "Whenever we get around to it", score: 2 },
      { value: "never", label: "Almost never", score: 0 },
    ],
  },
  {
    id: "segmentation",
    kind: "single",
    prompt: "Do you segment broadcasts by audience?",
    options: [
      { value: "always", label: "Always — every send is segmented", score: 10 },
      { value: "sometimes", label: "Sometimes, for bigger sends", score: 5 },
      { value: "never", label: "We send to the whole list", score: 0 },
    ],
  },
  {
    id: "deliverability",
    kind: "single",
    prompt: "When did you last check deliverability?",
    help: "Inbox placement, spam complaints, sender reputation.",
    options: [
      { value: "month", label: "In the last month", score: 10 },
      { value: "quarter", label: "In the last quarter", score: 5 },
      { value: "year", label: "In the last year", score: 2 },
      { value: "never", label: "Never", score: 0 },
      { value: "unknown", label: "Not sure what that means", score: 0 },
    ],
  },
  {
    id: "auth",
    kind: "single",
    prompt: "Are SPF, DKIM, and DMARC set up on your sending domain?",
    help: "Email authentication records — if you don't know, that's a valid answer.",
    options: [
      { value: "all", label: "All three, and DMARC is enforcing", score: 15 },
      { value: "some", label: "Some of them", score: 5 },
      { value: "none", label: "None as far as I know", score: 0 },
      { value: "unknown", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "revenue_share",
    kind: "single",
    prompt: "Roughly what share of total revenue does email drive?",
    options: [
      { value: "unknown", label: "Honestly, no idea", score: 0 },
      { value: "lt10", label: "Under 10%", score: 2 },
      { value: "10-20", label: "10 – 20%", score: 5 },
      { value: "20-30", label: "20 – 30%", score: 8 },
      { value: "30+", label: "Over 30%", score: 10 },
    ],
  },
  {
    id: "biggest_pain",
    kind: "text",
    prompt: "What's the one thing you'd most like to improve?",
    placeholder: "e.g. 'Our welcome flow converts but we have nothing after that'",
  },
];

export type Answers = Record<string, string | string[]>;

/**
 * Returns a single plain-English string describing the biggest revenue-blocking
 * gap in this set of answers. Used as the Brevo contact attribute `audit_top_issue`
 * which is personalised into the nurture sequence emails.
 *
 * Ordered by estimated revenue impact — authentication first because without it
 * emails may never arrive, making everything else moot.
 */
export function getTopIssue(answers: Answers): string {
  const flows = Array.isArray(answers.flows) ? answers.flows : [];

  if (answers.auth === "none")
    return "Email authentication not set up — messages are landing in spam";

  if (!flows.includes("welcome"))
    return "No welcome series — losing revenue from every new subscriber";

  if (!flows.includes("abandoned_cart") && answers.industry === "ecommerce")
    return "Abandoned cart flow not running — leaving 10–20% of email revenue on the table";

  if (!flows.includes("post_purchase"))
    return "No post-purchase sequence — one-time buyers staying one-time buyers";

  if (answers.deliverability === "never" || answers.deliverability === "unknown")
    return "Deliverability never checked — inbox placement is unknown";

  if (answers.auth === "some" || answers.auth === "unknown")
    return "Email authentication incomplete — sender reputation at risk";

  if (answers.segmentation === "never")
    return "Sending to the whole list without segmentation — hurting deliverability and revenue per send";

  if (answers.cadence === "sporadic" || answers.cadence === "never")
    return "No consistent send cadence — list is going cold between campaigns";

  if (answers.revenue_share === "unknown")
    return "Email revenue not being tracked — no way to know what's actually working";

  if (!flows.includes("winback"))
    return "No win-back sequence — lapsed customers are walking out the door";

  return "Optimisation gaps in segmentation depth and reporting";
}

export type Tier = "foundations" | "improving" | "advanced";

export type Recommendation = {
  title: string;
  body: string;
  list?: string[];
};

export type ScoreResult = {
  score: number;
  maxScore: number;
  tier: Tier;
  tierLabel: string;
  tierBlurb: string;
  recommendations: Recommendation[];
};

const MAX_SCORE = 75;

export function maxScore(): number {
  return MAX_SCORE;
}

export function scoreAnswers(answers: Answers): ScoreResult {
  let score = 0;

  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;
    if (q.kind === "single") {
      const opt = q.options.find((o) => o.value === a);
      score += opt?.score ?? 0;
    } else if (q.kind === "multi") {
      const values = Array.isArray(a) ? a : [a];
      for (const v of values) {
        const opt = q.options.find((o) => o.value === v);
        score += opt?.score ?? 0;
      }
    }
  }

  const tier: Tier =
    score < 25 ? "foundations" : score < 50 ? "improving" : "advanced";

  const tierLabel = {
    foundations: "Foundational gaps",
    improving: "Solid base, big upside",
    advanced: "Mature program",
  }[tier];

  const tierBlurb = {
    foundations:
      "Urgent: Your email strategy is killing your revenue. Unlock powerful results with small changes.",
    improving:
      "You're leaving money on the table. Dial up results and reduce revenue leaks.",
    advanced:
      "You're serious about email. Unlock more revenue and scale up results with tested strategies in segmentation depth and reporting discipline.",
  }[tier];

  const recommendations = buildRecommendations(answers, tier);

  return { score, maxScore: MAX_SCORE, tier, tierLabel, tierBlurb, recommendations };
}

function buildRecommendations(answers: Answers, tier: Tier): Recommendation[] {
  const recs: Recommendation[] = [];
  const flows = Array.isArray(answers.flows) ? answers.flows : [];

  if (!flows.includes("welcome")) {
    recs.push({
      title: "Get them while they're hot: Build a welcome series",
      body: "A 3–5 email welcome flow is the single highest ROI thing most programs are missing. It earns revenue from new subscribers while they're still hot.",
    });
  }
  if (!flows.includes("abandoned_cart") && answers.industry === "ecommerce") {
    recs.push({
      title: "How to close revenue leaks: Turn on abandoned cart",
      body: "For e-commerce, abandoned cart typically accounts for 10–20% of email revenue on its own. If it's off, you're basically throwing money away.",
    });
  }
  if (!flows.includes("post_purchase")) {
    recs.push({
      title: "How to generate repeat sales with no extra effort: Add a post-purchase flow",
      body: "Post-purchase emails drive repeat orders, reduce support tickets and work in the background to improve LTV. Serious compounding value with little effort and low costs.",
    });
  }
  if (answers.auth === "none" || answers.auth === "unknown") {
    recs.push({
      title: "What you should never do: Send without authentication",
      body: "If your emails don't make it to the inbox, then your efforts (and revenue) go down the drain. Without authentication, your emails increasingly get binned by Gmail and Apple. This is a one-time setup with permanent deliverability upside.",
    });
  } else if (answers.auth === "some") {
    recs.push({
      title: "You've been doing authentication wrong (and it really does matter)",
      body: "If your emails don't make it to the inbox, your efforts go down the drain. Finish your email authentication. Partial setup leaves you exposed to spoofing and deliverability hits. Get all 3 records in place and move DMARC to enforcing.",
    });
  }
  if (answers.segmentation === "never") {
    recs.push({
      title: "You send to the whole list, right? Wrong!",
      body: "Even simple engagement-based segmentation (last 30/60/90 days) lifts revenue share per recipient and protects your sender reputation. It's a win-win.",
    });
  }
  if (answers.revenue_share === "unknown") {
    recs.push({
      title: "How to eliminate performance uncertainty",
      body: "If you don't know what email contributes to your revenue, you can't defend performance. Wire up revenue-per-recipient and monthly contribution-to-total reports, to measure email's share of revenue.",
    });
  }
  if (answers.cadence === "sporadic" || answers.cadence === "never") {
    recs.push({
      title: "Say goodbye to reactive campaign blasts",
      body: "Commit to a campaign cadence — a predictable monthly calendar. Even just two well-segmented sends outperforms reactive 'whenever' sends. List warmth compounds and you stay on the front foot.",
    });
  }

  if (recs.length === 0) {
    if (tier === "advanced") {
      recs.push({
        title: "3 ways to squeeze more out of your emails",
        body: "Push into testing and reporting depth.",
        list: [
          "Subject line and content tests at flow level",
          "Send-time optimisation tests",
          "A monthly cohort view of repeat-purchase rate by acquisition source",
        ],
      });
    } else {
      recs.push({
        title: "How to eliminate vanity metrics",
        body: "Tighten your reporting. Make sure your monthly view leads with RPR, contribution-to-revenue, and flow-level performance. Not opens.",
      });
    }
  }

  return recs.slice(0, 5);
}
