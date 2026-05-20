import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfYesterday() {
  const d = startOfToday();
  d.setDate(d.getDate() - 1);
  return d;
}

function calculateLevel(xp: number) {
  if (xp >= 3000) return 8;
  if (xp >= 2200) return 7;
  if (xp >= 1500) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
}

function getXp(body: any) {
  let xp = 10;
  if (body.water) xp += 15;
  if (body.workout) xp += 20;
  if (body.diet) xp += 25;
  if (body.mood) xp += 5;
  return xp;
}

function parseCheckin(log: any) {
  if (!log) return null;
  try {
    const data = JSON.parse(log.notes ?? "{}");
    return {
      id: log.id,
      date: log.loggedAt,
      water: Boolean(data.water),
      workout: Boolean(data.workout),
      diet: Boolean(data.diet),
      mood: data.mood ?? null,
      xpEarned: Number(data.xpEarned ?? log.value ?? 0),
      createdAt: log.loggedAt,
    };
  } catch {
    return {
      id: log.id,
      date: log.loggedAt,
      water: false,
      workout: false,
      diet: false,
      mood: null,
      xpEarned: Number(log.value ?? 0),
      createdAt: log.loggedAt,
    };
  }
}

async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser?.email) return null;

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
  if (existingById) {
    if ((!existingById.avatar && providerAvatar) || (!existingById.name && providerName)) {
      return prisma.user.update({
        where: { id: existingById.id },
        data: {
          avatar: existingById.avatar ?? providerAvatar,
          name: existingById.name ?? providerName,
        },
      });
    }
    return existingById;
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
  if (existingByEmail) {
    return prisma.user.update({
      where: { email: supabaseUser.email },
      data: {
        id: supabaseUser.id,
        name: existingByEmail.name ?? providerName,
        avatar: existingByEmail.avatar ?? providerAvatar,
      },
    });
  }

  return prisma.user.create({
    data: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: providerName,
      avatar: providerAvatar,
    },
  });
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const today = startOfToday();
    const todayLog = await prisma.habitLog.findFirst({
      where: { userId: user.id, type: "daily_checkin", loggedAt: { gte: today } },
      orderBy: { loggedAt: "desc" },
    });

    const achievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: "desc" },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      checkin: parseCheckin(todayLog),
      achievements,
      user,
      completedToday: Boolean(todayLog),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const today = startOfToday();
    const yesterday = startOfYesterday();

    const already = await prisma.habitLog.findFirst({
      where: { userId: user.id, type: "daily_checkin", loggedAt: { gte: today } },
      orderBy: { loggedAt: "desc" },
    });

    if (already) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        checkin: parseCheckin(already),
        message: "Check-in de hoje já foi registrado.",
      });
    }

    const lastCheckin = await prisma.habitLog.findFirst({
      where: { userId: user.id, type: "daily_checkin" },
      orderBy: { loggedAt: "desc" },
    });

    const lastDate = lastCheckin ? new Date(lastCheckin.loggedAt) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const keptStreak = lastDate && lastDate.getTime() === yesterday.getTime();
    const newStreak = keptStreak ? (user.streakDays ?? 0) + 1 : 1;
    const streakBonus = newStreak > 0 && newStreak % 7 === 0 ? 50 : 0;
    const xpEarned = getXp(body) + streakBonus;
    const nextXp = (user.xp ?? 0) + xpEarned;

    const notes = JSON.stringify({
      water: Boolean(body.water),
      workout: Boolean(body.workout),
      diet: Boolean(body.diet),
      mood: typeof body.mood === "string" ? body.mood : null,
      xpEarned,
      streakBonus,
    });

    const [log, updatedUser] = await prisma.$transaction([
      prisma.habitLog.create({
        data: {
          userId: user.id,
          type: "daily_checkin",
          value: xpEarned,
          notes,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: nextXp,
          level: calculateLevel(nextXp),
          streakDays: newStreak,
          lastActiveAt: new Date(),
        },
      }),
    ]);

    const achievementPayloads: Array<{ type: string; title: string; description: string; xpGained: number }> = [];
    if (newStreak === 1) achievementPayloads.push({ type: "first_checkin", title: "Primeiro Check-in", description: "Você começou sua sequência diária.", xpGained: 10 });
    if (newStreak === 7) achievementPayloads.push({ type: "streak_7", title: "Semana Perfeita", description: "7 dias seguidos cuidando de você.", xpGained: 50 });
    if (newStreak === 14) achievementPayloads.push({ type: "streak_14", title: "Consistência Forte", description: "14 dias de disciplina acumulada.", xpGained: 100 });
    if (newStreak === 21) achievementPayloads.push({ type: "streak_21", title: "Transformação Iniciada", description: "21 dias de hábito construído.", xpGained: 150 });

    for (const item of achievementPayloads) {
      await prisma.achievement.create({ data: { userId: user.id, ...item } }).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      checkin: parseCheckin(log),
      user: updatedUser,
      xpEarned,
      streakBonus,
      newStreak,
      achievements: achievementPayloads,
      message: newStreak > 1 ? `Sequência mantida: ${newStreak} dias!` : "Primeiro passo de hoje concluído!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
