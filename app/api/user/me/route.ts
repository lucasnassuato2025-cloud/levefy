import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser?.email) return NextResponse.json({ user: null });

    const providerAvatar =
      supabaseUser.user_metadata?.avatar_url ??
      supabaseUser.user_metadata?.picture ??
      supabaseUser.user_metadata?.photo_url ??
      null;

    const providerName =
      supabaseUser.user_metadata?.full_name ??
      supabaseUser.user_metadata?.name ??
      null;

    const existingById = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    const existingByEmail = existingById ? null : await prisma.user.findUnique({ where: { email: supabaseUser.email } });

    if (!existingById && existingByEmail) {
      await prisma.user.update({
        where: { email: supabaseUser.email },
        data: {
          id: supabaseUser.id,
          name: existingByEmail.name ?? providerName,
          avatar: existingByEmail.avatar ?? providerAvatar,
        },
      });
    } else if (existingById && (!existingById.avatar || !existingById.name)) {
      await prisma.user.update({
        where: { id: supabaseUser.id },
        data: {
          name: existingById.name ?? providerName,
          avatar: existingById.avatar ?? providerAvatar,
        },
      });
    } else if (!existingById && !existingByEmail) {
      await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: providerName,
          avatar: providerAvatar,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      include: {
        progress: { orderBy: { loggedAt: "desc" }, take: 7 },
        waterLogs: { where: { loggedAt: { gte: startOfToday() } } },
        achievements: { orderBy: { earnedAt: "desc" }, take: 6 },
        habits: { where: { type: "daily_checkin" }, orderBy: { loggedAt: "desc" }, take: 7 },
      },
    });

    const waterToday = user?.waterLogs?.reduce((acc: number, w: { amount: number }) => acc + w.amount, 0) ?? 0;
    const checkinToday = user?.habits?.find((c: { loggedAt: Date }) => c.loggedAt >= startOfToday()) ?? null;

    return NextResponse.json({ user, waterToday, checkinToday });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message });
  }
}
