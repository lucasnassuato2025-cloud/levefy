// app/auth/callback/route.ts
// Handles the redirect from Supabase after Google OAuth or password reset

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const siteUrl = "https://levefy-mu.vercel.app";

  if (code) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase-server");
      const { syncUserToDatabase } = await import("@/lib/db-sync");

      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await syncUserToDatabase(user);

        return NextResponse.redirect(`${siteUrl}${next}`);
      }
    } catch (err) {
      console.error("[auth/callback] Error:", err);
    }
  }

  return NextResponse.redirect(`${siteUrl}/login?error=auth_failed`);
}
