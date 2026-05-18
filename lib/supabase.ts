// lib/supabase.ts
// Cliente Supabase para uso no browser (componentes com "use client")

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!client) {
    client = createBrowserClient(url, anonKey);
  }

  return client;
}
