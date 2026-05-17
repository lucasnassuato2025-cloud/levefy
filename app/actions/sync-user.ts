"use server";
// app/actions/sync-user.ts
// Called after email/password login to ensure user exists in Prisma DB.

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { syncUserToDatabase } from "@/lib/db-sync";

export async function syncCurrentUser(): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await syncUserToDatabase(user);
  } catch {
    // Non-critical — don't surface to user
  }
}
