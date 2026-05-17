// lib/supabase-server.ts — instância Supabase do servidor (lê cookies)

import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://zmsjxhcldrxgayszpqvq.supabase.co";

const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_3flXT4QbD5RYlLEhosBDBw_FUXOQKtp";

  if (!url || !anonKey) {
    throw new Error(
      "[Levefy] NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não configurados. " +
      "Adicione-os no .env.local (desenvolvimento) ou nas variáveis de ambiente do Render."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll chamado de um Server Component — seguro ignorar
        }
      },
    },
  });
}
