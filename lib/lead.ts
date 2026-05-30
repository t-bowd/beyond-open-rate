import { supabaseAdmin } from "./supabase";

export type LeadSource =
  | "hero-audit"
  | "contact-form"
  | `tool:${string}`;

export type CaptureLeadInput = {
  email: string;
  source: LeadSource;
  name?: string;
  website?: string;
  message?: string;
  payload?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
};

export type CaptureLeadResult = { id: string };

export async function captureLead(
  input: CaptureLeadInput,
): Promise<CaptureLeadResult> {
  const { data, error } = await supabaseAdmin()
    .from("leads")
    .insert({
      email: input.email.toLowerCase().trim(),
      name: input.name?.trim() || null,
      website: input.website?.trim() || null,
      message: input.message?.trim() || null,
      source: input.source,
      payload: input.payload ?? {},
      user_agent: input.userAgent ?? null,
      ip: input.ip ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}
