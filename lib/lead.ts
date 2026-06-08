import { supabaseAdmin } from "./supabase";
import { sendLeadNotification, sendLeadConfirmation, triggerBrevoNurture } from "./email";
import { getTopIssue, type Answers } from "./quiz/email-audit";

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
    const emailJobs: Promise<void>[] = [sendLeadNotification(lead)];

    // Confirmation email only for non-audit sources (contact form, etc).
    // Audit completions get the nurture sequence instead — email 1 serves as the confirmation.
    if (lead.source !== "tool:email-audit") {
      emailJobs.push(
        sendLeadConfirmation({
          email: lead.email,
          name: lead.name,
          source: lead.source,
          auditCompleted: false,
        }),
      );
    }

    await Promise.all(emailJobs);
  } catch (err) {
    console.error("[email] send failed", err);
  }

  // Trigger Brevo nurture sequence for audit completions
  if (lead.source === "tool:email-audit") {
    try {
      const answers = (lead.payload as Record<string, unknown>)?.answers as Answers | undefined;
      const auditScore = (lead.payload as Record<string, unknown>)?.score as number | undefined;

      await triggerBrevoNurture({
        email: lead.email,
        firstName: lead.name?.split(" ")[0] ?? null,
        auditScore,
        auditTopIssue: answers ? getTopIssue(answers) : undefined,
        auditCompletedDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("[brevo nurture] trigger failed", err);
    }
  }

  return { id: data.id };
}
