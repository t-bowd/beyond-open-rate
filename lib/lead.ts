import { supabaseAdmin } from "./supabase";
import { sendLeadNotification, sendLeadConfirmation } from "./email";

export type LeadSource =
  | "hero-audit"
  | "contact-form"
  | `tool:${string}`;

export type CaptureLeadInput = {
  email: string;
  source: LeadSource;
  name?: string;
  phone?: string;
  website?: string;
  company?: string;
  company_size?: string;
  message?: string;
  payload?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
};

export type CaptureLeadResult = { id: string };

export async function requestFullAudit(id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("leads")
    .update({ full_audit_requested: true })
    .eq("id", id);

  if (error) throw error;
}

export async function captureLead(
  input: CaptureLeadInput,
): Promise<CaptureLeadResult> {
  const { data, error } = await supabaseAdmin()
    .from("leads")
    .insert({
      email: input.email.toLowerCase().trim(),
      name: input.name?.trim() || null,
      phone: input.phone?.trim() || null,
      website: input.website?.trim() || null,
      company: input.company?.trim() || null,
      company_size: input.company_size?.trim() || null,
      message: input.message?.trim() || null,
      source: input.source,
      payload: input.payload ?? {},
      user_agent: input.userAgent ?? null,
      ip: input.ip ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;

  const lead = {
    id: data.id,
    email: input.email.toLowerCase().trim(),
    name: input.name?.trim() || null,
    phone: input.phone?.trim() || null,
    website: input.website?.trim() || null,
    company: input.company?.trim() || null,
    company_size: input.company_size?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source,
    payload: input.payload ?? {},
  };

  // Await emails — Vercel kills un-awaited promises when the function returns
  try {
    await Promise.all([
      sendLeadNotification(lead),
      sendLeadConfirmation({
        email: lead.email,
        name: lead.name,
        source: lead.source,
        auditCompleted: lead.source === "tool:email-audit",
      }),
    ]);
  } catch (err) {
    console.error("[email] send failed", err);
  }

  return { id: data.id };
}
