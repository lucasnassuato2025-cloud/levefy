// lib/db-sync.ts
// Syncs a Supabase auth user into the Prisma users table.
// Safe to call multiple times.

import { prisma } from "@/lib/prisma";
import type { User as PrismaUser } from "@prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUserToDatabase(
  supabaseUser: SupabaseUser
): Promise<PrismaUser | null> {
  const email = supabaseUser.email?.trim().toLowerCase();
  if (!email) return null;

  const name =
    supabaseUser.user_metadata?.full_name ??
    supabaseUser.user_metadata?.name ??
    null;
  const avatar =
    supabaseUser.user_metadata?.avatar_url ??
    supabaseUser.user_metadata?.picture ??
    null;

  try {
    let user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: supabaseUser.id,
        email,
        name,
        avatar,
      },
    });

    if (user.id !== supabaseUser.id) {
      const existingBySupabaseId = await prisma.user.findUnique({
        where: { id: supabaseUser.id },
      });

      if (!existingBySupabaseId) {
        user = await prisma.user.update({
          where: { email },
          data: { id: supabaseUser.id },
        });
      }
    }

    const profileUpdates: { name?: string; avatar?: string } = {};
    if (!user.name && name) profileUpdates.name = name;
    if (!user.avatar && avatar) profileUpdates.avatar = avatar;

    if (Object.keys(profileUpdates).length > 0) {
      user = await prisma.user.update({
        where: { email },
        data: profileUpdates,
      });
    }

    return user;
  } catch (error) {
    console.error("[db-sync] Failed to sync user to database:", error);
    return prisma.user.findUnique({ where: { email } }).catch(() => null);
  }
}
