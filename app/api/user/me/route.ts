import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { syncUserToDatabase } from "@/lib/db-sync";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ user: null });

    const syncedUser = await syncUserToDatabase(supabaseUser);
    if (!syncedUser) {
      return NextResponse.json(
        { user: null, error: "Erro ao sincronizar usuario" },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: syncedUser.id },
      include: {
        progress: { orderBy: { loggedAt: "desc" }, take: 7 },
        waterLogs: { where: { loggedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, error: "Usuario nao encontrado" },
        { status: 404 }
      );
    }

    const waterToday = user.waterLogs?.reduce((acc: number, w: { amount: number }) => acc + w.amount, 0) ?? 0;
    return NextResponse.json({ user, waterToday });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message });
  }
}
