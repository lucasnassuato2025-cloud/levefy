// lib/db-sync.ts
// Syncs a Supabase auth user into the Prisma users table.
// Called after login/OAuth. Safe to call multiple times (upsert).

import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUserToDatabase(supabaseUser: SupabaseUser): Promise<void> {
  try {
    await prisma.user.upsert({
      where: { email: supabaseUser.email! },
      update: {
        name: supabaseUser.user_metadata?.full_name ?? undefined,
        avatar: supabaseUser.user_metadata?.avatar_url ?? undefined,
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name ?? null,
        avatar: supabaseUser.user_metadata?.avatar_url ?? null,
      },
    });
  } catch (error) {
    // Log but don't crash — auth works even if DB sync fails
    console.error("[db-sync] Failed to sync user to database:", error);
  }
}
