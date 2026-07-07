export type PillOption = { value: string; label: string; full?: boolean };

export const platformOptions: PillOption[] = [
  { value: "klaviyo", label: "Klaviyo" },
  { value: "mailchimp", label: "Mailchimp" },
  { value: "shopify-email", label: "Shopify Email" },
  { value: "omnisend", label: "Omnisend" },
  { value: "hubspot", label: "HubSpot" },
  { value: "activecampaign", label: "ActiveCampaign" },
  { value: "other", label: "Something else" },
  { value: "none", label: "Nothing yet" },
];

export const budgetOptions: PillOption[] = [
  { value: "<2k", label: "Under $2k" },
  { value: "2k-5k", label: "$2k – $5k" },
  { value: "5k-10k", label: "$5k – $10k" },
  { value: "10k-20k", label: "$10k – $20k" },
  { value: "20k-50k", label: "$20k – $50k" },
  { value: "50k+", label: "$50k+" },
];

export const timelineOptions: PillOption[] = [
  { value: "immediately", label: "Immediately" },
  { value: "2-weeks", label: "In the next 2 weeks" },
  { value: "2-4-weeks", label: "2–4 weeks" },
  { value: "4-6-weeks", label: "4–6 weeks" },
  { value: "6-weeks+", label: "6 weeks+" },
  { value: "exploring", label: "Just exploring for now", full: true },
];

export function formatRevenue(n: number): string {
  if (n >= 200000) return "$200k+";
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}
