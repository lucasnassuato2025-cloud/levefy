// app/api/challenge/complete/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
    if (lastActive && lastActive >= today) {
      return NextResponse.json({ error: "Dia já concluído hoje!", streakDays: user.streakDays });
    }

    const newStreak = Math.min((user.streakDays ?? 0) + 1, 21);
    const xpGain = 20;

    // Update user streak and XP
    const updated = await prisma.user.update({
      where: { id: supabaseUser.id },
      data: {
        streakDays: newStreak,
        xp: { increment: xpGain },
        lastActiveAt: new Date(),
      },
    });

    // Log habit
    await prisma.habitLog.create({
      data: {
        userId: supabaseUser.id,
        type: "challenge_day",
        value: newStreak,
        notes: `Dia ${newStreak} do desafio 21 dias concluído`,
      },
    });

    // Milestone achievements
    const milestones: Record<number, { type: string; title: string; xp: number }> = {
      1:  { type: "primeiro_passo", title: "Primeiro Passo", xp: 25 },
      7:  { type: "semana_perfeita", title: "Semana Perfeita", xp: 100 },
      14: { type: "consistencia", title: "14 Dias Guerreiro", xp: 200 },
      21: { type: "21_dias", title: "21 Dias Guerreiro", xp: 300 },
    };

    if (milestones[newStreak]) {
      const m = milestones[newStreak];
      await prisma.achievement.create({
        data: {
          userId: supabaseUser.id,
          type: m.type,
          title: m.title,
          description: `Completou o marco do dia ${newStreak}`,
          xpGained: m.xp,
        },
      }).catch(() => {});
      await prisma.user.update({
        where: { id: supabaseUser.id },
        data: { xp: { increment: m.xp } },
      });
    }

    return NextResponse.json({ success: true, streakDays: updated.streakDays, xp: updated.xp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
