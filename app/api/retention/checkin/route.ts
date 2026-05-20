import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

const ACTIONS = ["water", "meal", "movement", "mood"] as const;
type Action = (typeof ACTIONS)[number];

const XP_BY_ACTION: Record<Action, number> = {
  water: 15,
  meal: 25,
  movement: 20,
  mood: 10,
};

const LABEL_BY_ACTION: Record<Action, string> = {
  water: "Hidratação registrada",
  meal: "Alimentação no caminho",
  movement: "Movimento do dia",
  mood: "Humor registrado",
};

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfTomorrow() {
  const today = startOfToday();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}

function wasYesterday(date?: Date | null) {
  if (!date) return false;
  const today = startOfToday();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  return date >= yesterday && date < today;
}

function wasToday(date?: Date | null) {
  if (!date) return false;
  return date >= startOfToday() && date < startOfTomorrow();
}

function normalizeActions(input: unknown): Action[] {
  if (!Array.isArray(input)) return [];
  return Array.from(new Set(input.filter((item): item is Action => ACTIONS.includes(item as Action))));
}

async function getSessionUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser?.email) return null;

  let user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
  if (!user) user = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name ?? null,
        avatar: supabaseUser.user_metadata?.avatar_url ?? supabaseUser.user_metadata?.picture ?? null,
      },
    });
  }
  return user;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const logs = await prisma.habitLog.findMany({
      where: {
        userId: user.id,
        type: { in: ACTIONS.map(action => `daily_${action}`) },
        loggedAt: { gte: today, lt: tomorrow },
      },
      orderBy: { loggedAt: "desc" },
    });

    const completed = logs
      .map((log: { type: string }) => log.type.replace("daily_", ""))
      .filter((type: string): type is Action => ACTIONS.includes(type as Action));

    const completedUnique = Array.from(new Set(completed));
    const progress = Math.round((completedUnique.length / ACTIONS.length) * 100);
    const streakAlive = wasToday(user.lastActiveAt) || wasYesterday(user.lastActiveAt);
    const streakRisk = !wasToday(user.lastActiveAt) && (user.streakDays ?? 0) > 0;

    return NextResponse.json({
      success: true,
      completed: completedUnique,
      progress,
      xp: user.xp ?? 0,
      streakDays: user.streakDays ?? 0,
      streakAlive,
      streakRisk,
      message: buildMessage(user.name, user.streakDays ?? 0, progress, streakRisk),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const requestedActions = normalizeActions(body.actions);
    if (requestedActions.length === 0) {
      return NextResponse.json({ error: "Selecione pelo menos uma ação" }, { status: 400 });
    }

    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    const existingLogs = await prisma.habitLog.findMany({
      where: {
        userId: user.id,
        type: { in: requestedActions.map(action => `daily_${action}`) },
        loggedAt: { gte: today, lt: tomorrow },
      },
    });

    const alreadyDone = new Set(existingLogs.map((log: { type: string }) => log.type.replace("daily_", "")));
    const newActions = requestedActions.filter(action => !alreadyDone.has(action));

    if (newActions.length === 0) {
      return NextResponse.json({ success: true, alreadyDone: true, xpGained: 0, message: "Check-in de hoje já registrado." });
    }

    await prisma.habitLog.createMany({
      data: newActions.map(action => ({
        userId: user.id,
        type: `daily_${action}`,
        value: 1,
        notes: LABEL_BY_ACTION[action],
      })),
    });

    const xpGained = newActions.reduce((sum, action) => sum + XP_BY_ACTION[action], 0);
    const fullDayBonus = newActions.length === ACTIONS.length ? 30 : 0;
    const totalXp = xpGained + fullDayBonus;

    const shouldMoveStreak = !wasToday(user.lastActiveAt);
    const nextStreak = shouldMoveStreak
      ? (wasYesterday(user.lastActiveAt) ? (user.streakDays ?? 0) + 1 : 1)
      : (user.streakDays ?? 0);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: totalXp },
        streakDays: nextStreak,
        lastActiveAt: new Date(),
      },
    });

    const achievements = [
      { streak: 3, type: "streak_3", title: "Ritmo ativado", description: "3 dias de consistência no Levefy.", xp: 30 },
      { streak: 7, type: "streak_7", title: "Semana em chamas", description: "7 dias mantendo sua sequência viva.", xp: 100 },
      { streak: 14, type: "streak_14", title: "Consistência real", description: "14 dias de transformação em andamento.", xp: 160 },
      { streak: 30, type: "streak_30", title: "Modo transformação", description: "30 dias cuidando de você.", xp: 300 },
    ];

    const milestone = achievements.find(item => item.streak === nextStreak);
    if (milestone) {
      const exists = await prisma.achievement.findFirst({ where: { userId: user.id, type: milestone.type } });
      if (!exists) {
        await prisma.achievement.create({
          data: {
            userId: user.id,
            type: milestone.type,
            title: milestone.title,
            description: milestone.description,
            xpGained: milestone.xp,
          },
        });
        await prisma.user.update({ where: { id: user.id }, data: { xp: { increment: milestone.xp } } });
      }
    }

    return NextResponse.json({
      success: true,
      completed: requestedActions,
      newActions,
      xpGained: totalXp,
      streakDays: updated.streakDays,
      message: fullDayBonus > 0
        ? "Check-in completo! Seu cérebro adora consistência — e seu corpo também."
        : "Boa. Você protegeu sua sequência de hoje.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}

function buildMessage(name: string | null, streak: number, progress: number, streakRisk: boolean) {
  const firstName = name?.split(" ")?.[0] || "Você";
  if (streakRisk) return `${firstName}, sua sequência ainda pode ser salva hoje. Faça um check-in rápido.`;
  if (progress >= 100) return `${firstName}, check-in completo. Hoje você venceu a parte mais difícil: aparecer.`;
  if (streak >= 7) return `${firstName}, ${streak} dias seguidos. Não quebra essa sequência agora.`;
  if (progress > 0) return `${firstName}, você já começou hoje. Termine o check-in para ganhar bônus de XP.`;
  return `${firstName}, faça seu check-in de 30 segundos e mantenha sua transformação viva.`;
}
