import { supabaseAdmin } from "@/lib/supabase";
import type { DeliverabilityAudit, RawEmail, AuditResults, AuditGrade } from "./types";

const TABLE = "deliverability_audits";

export async function createAudit(
  name: string,
  email: string,
  inboundAddress: string,
  id: string,
): Promise<DeliverabilityAudit> {
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .insert({
      id,
      name,
      email,
      inbound_address: inboundAddress,
      status: "pending",
      tier: "free",
    })
    .select()
    .single();

  if (error) throw new Error(`createAudit: ${error.message}`);
  return data as DeliverabilityAudit;
}

export async function getAuditById(id: string): Promise<DeliverabilityAudit | null> {
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as DeliverabilityAudit;
}

export async function getAuditByInboundAddress(
  address: string,
): Promise<DeliverabilityAudit | null> {
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .eq("inbound_address", address)
    .single();

  if (error) return null;
  return data as DeliverabilityAudit;
}

export async function saveRawEmail(
  id: string,
  rawEmail: RawEmail,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(TABLE)
    .update({ raw_email: rawEmail, status: "processing" })
    .eq("id", id);

  if (error) throw new Error(`saveRawEmail: ${error.message}`);
}

export async function saveAuditResults(
  id: string,
  results: AuditResults,
  score: number,
  grade: AuditGrade,
  sendingDomain: string | null,
  sendingIp: string | null,
  espDetected: string | null,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(TABLE)
    .update({
      results,
      score,
      grade,
      sending_domain: sendingDomain,
      sending_ip: sendingIp,
      esp_detected: espDetected,
      status: "complete",
      completed_at: new Date().toISOString(),
      raw_email: null, // clear raw data once processed
    })
    .eq("id", id);

  if (error) throw new Error(`saveAuditResults: ${error.message}`);
}

export async function saveUpgradeDetails(
  id: string,
  listSize: string,
  sendFrequency: string,
  revenuePerEmail: string | null,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(TABLE)
    .update({ list_size: listSize, send_frequency: sendFrequency, revenue_per_email: revenuePerEmail })
    .eq("id", id);

  if (error) throw new Error(`saveUpgradeDetails: ${error.message}`);
}

export async function unlockPremium(
  id: string,
  stripePaymentIntent: string,
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(TABLE)
    .update({ tier: "premium", stripe_payment_intent: stripePaymentIntent })
    .eq("id", id);

  if (error) throw new Error(`unlockPremium: ${error.message}`);
}
