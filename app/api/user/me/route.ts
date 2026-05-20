import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

function getProviderAvatar(metadata: any) {
  return metadata?.avatar_url ?? metadata?.picture ?? metadata?.photoURL ?? null;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser?.email) return NextResponse.json({ user: null });

    const providerName = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null;
    const providerAvatar = getProviderAvatar(supabaseUser.user_metadata);

    const existingByEmail = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    const existingById = existingByEmail ? null : await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    const existingUser = existingByEmail ?? existingById;

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: existingUser.name ?? providerName,
            avatar: existingUser.avatar ?? providerAvatar,
            lastActiveAt: new Date(),
          },
          include: {
            progress: { orderBy: { loggedAt: "desc" }, take: 7 },
            waterLogs: {
              where: { loggedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } },
            },
          },
        })
      : await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: providerName,
            avatar: providerAvatar,
            lastActiveAt: new Date(),
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
    console.error("[api/user/me]", error);
    return NextResponse.json({ user: null, error: error.message });
  }
}
