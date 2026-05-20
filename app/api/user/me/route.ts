import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ user: null });

    let existing = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    if (!existing && supabaseUser.email) {
      existing = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    }

    const avatarFromProvider = supabaseUser.user_metadata?.avatar_url ?? supabaseUser.user_metadata?.picture ?? null;
    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: existing.name ?? supabaseUser.user_metadata?.full_name ?? undefined,
            avatar: existing.avatar ?? avatarFromProvider ?? undefined,
          },
          include: {
            progress: { orderBy: { loggedAt: "desc" }, take: 7 },
            waterLogs: { where: { loggedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } },
          },
        })
      : await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.full_name ?? null,
            avatar: avatarFromProvider,
          },
          include: {
            progress: { orderBy: { loggedAt: "desc" }, take: 7 },
            waterLogs: { where: { loggedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } },
          },
        });

    const waterToday = user.waterLogs?.reduce((acc: number, w: { amount: number }) => acc + w.amount, 0) ?? 0;
    return NextResponse.json({ user, waterToday });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message });
  }
}
