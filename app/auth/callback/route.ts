// app/auth/callback/route.ts
// Handles the redirect from Supabase after Google OAuth or password reset

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase-server");
      const { syncUserToDatabase } = await import("@/lib/db-sync");

      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Sync the authenticated user into Prisma DB
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await syncUserToDatabase(user);

        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (err) {
      console.error("[auth/callback] Error:", err);
    }
  }

  // Something went wrong — redirect to login with error param
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
