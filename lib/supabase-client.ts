import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const clients = new Map<string, SupabaseClient>();

/**
 * Client-side Supabase client — uses the anon key (safe to expose).
 * Used only for Realtime subscriptions in browser components.
 *
 * The URL is passed in from a server component (reads SUPABASE_URL server-side)
 * so we only need NEXT_PUBLIC_SUPABASE_ANON_KEY as a public env var.
 */
export function supabaseClient(url: string): SupabaseClient {
  if (clients.has(url)) return clients.get(url)!;

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
  }

  const client = createClient(url, key);
  clients.set(url, client);
  return client;
}
