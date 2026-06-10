-- Migration 002: add raw_email storage column
-- The inbound webhook saves the parsed email here so the Edge Function
-- can pick it up without needing it passed directly.
alter table public.deliverability_audits
  add column if not exists raw_email jsonb;
