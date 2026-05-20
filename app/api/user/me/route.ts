import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ user: null });

    const user = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {},
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name ?? null,
        avatar: supabaseUser.user_metadata?.avatar_url ?? null,
      },
      include: {
        progress: { orderBy: { loggedAt: "desc" }, take: 7 },
        waterLogs: {
          where: { loggedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } },
        },
      },
    });

    const waterToday = user.waterLogs?.reduce((acc, w) => acc + w.amount, 0) ?? 0;
    return NextResponse.json({ user, waterToday });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message });
  }
}
'@ | Set-Content -Encoding UTF8 app/api/user/me/route.tsss