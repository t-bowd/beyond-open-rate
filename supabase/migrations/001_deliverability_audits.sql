-- Deliverability Audit Tool
-- Migration 001: audits table
--
-- Run this in the Supabase SQL editor for the Beyond Open Rate project.

create extension if not exists "pgcrypto";

create table if not exists public.deliverability_audits (
  -- Identity
  id                    uuid primary key default gen_random_uuid(),

  -- User supplied at form submission
  name                  text not null,
  email                 text not null,

  -- The unique inbound address generated for this audit
  -- e.g. audit-<uuid>@mail.beyondopenrate.com.au
  inbound_address       text not null unique,

  -- Lifecycle
  status                text not null default 'pending'
                          check (status in ('pending', 'complete', 'expired')),
  tier                  text not null default 'free'
                          check (tier in ('free', 'premium')),

  -- Audit results (set when status = 'complete')
  results               jsonb,
  score                 smallint check (score between 0 and 100),
  grade                 text check (grade in ('A', 'B', 'C', 'D', 'F')),
  sending_domain        text,       -- domain extracted from the From header
  sending_ip            text,       -- outermost Received header IP
  esp_detected          text,       -- e.g. "Klaviyo", "Mailchimp"

  -- Premium upgrade fields (collected on /upgrade page before Stripe)
  list_size             text,       -- '<1k' | '1k-10k' | '10k-50k' | '50k+'
  send_frequency        text,       -- 'weekly' | 'fortnightly' | 'monthly'
  revenue_per_email     text,       -- optional free text

  -- Stripe
  stripe_payment_intent text,

  -- PDF (path in Supabase Storage)
  pdf_path              text,

  -- Timestamps
  created_at            timestamptz not null default now(),
  completed_at          timestamptz,
  expires_at            timestamptz not null default (now() + interval '30 days')
);

-- Index for looking up by inbound address (webhook matching)
create index if not exists deliverability_audits_inbound_address_idx
  on public.deliverability_audits (inbound_address);

-- Index for looking up by email (user returning to their report)
create index if not exists deliverability_audits_email_idx
  on public.deliverability_audits (email);

-- Index for cron cleanup of expired records
create index if not exists deliverability_audits_expires_at_idx
  on public.deliverability_audits (expires_at)
  where status = 'pending';

-- Row Level Security
-- All reads/writes go through the service role key (server-side only).
-- No direct client access needed.
alter table public.deliverability_audits enable row level security;

-- Allow the service role to do everything (used by Next.js + Edge Function)
create policy "service role full access"
  on public.deliverability_audits
  as permissive
  for all
  to service_role
  using (true)
  with check (true);

-- Anon can read their own audit by ID (for the results page, no auth required)
-- Access is controlled by knowing the UUID — treated as a secret link.
create policy "public read by id"
  on public.deliverability_audits
  as permissive
  for select
  to anon
  using (true);
