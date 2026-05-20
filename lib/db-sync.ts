// lib/db-sync.ts
// Syncs a Supabase auth user into the Prisma users table.
// Called after login/OAuth. Safe to call multiple times (upsert).

import { prisma } from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUserToDatabase(supabaseUser: SupabaseUser): Promise<void> {
  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ id: supabaseUser.id }, { email: supabaseUser.email! }] },
    });

    const avatar = supabaseUser.user_metadata?.avatar_url ?? supabaseUser.user_metadata?.picture ?? null;
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: existing.name ?? supabaseUser.user_metadata?.full_name ?? undefined,
          avatar: existing.avatar ?? avatar ?? undefined,
        },
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name ?? null,
        avatar,
      },
    });
  } catch (error) {
    // Log but don't crash — auth works even if DB sync fails
    console.error("[db-sync] Failed to sync user to database:", error);
  }
}
