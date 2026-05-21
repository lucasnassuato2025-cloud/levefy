import { NextResponse } from "next/server";
import { generateDailyPlan, generateWeeklyPlan, generateHabitSuggestions } from "@/lib/meal-engine";
import type { FastingProtocol, UserProfile } from "@/lib/meal-engine";
import { PLAN_LIMITS, normalizePlan } from "@/lib/plan-access";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { syncUserToDatabase } from "@/lib/db-sync";
import { prisma } from "@/lib/prisma";

const FASTING_PROTOCOLS = new Set<FastingProtocol>(["none", "12_12", "14_10", "16_8"]);

function startOfRollingWeek() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

function getLimit(plan: ReturnType<typeof normalizePlan>) {
  const limit = PLAN_LIMITS[plan].mealAiGenerationsPerWeek;
  return limit === "ilimitado" ? null : limit;
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ success: false, error: "Faça login para gerar seu plano." }, { status: 401 });
    }

    const dbUser = await syncUserToDatabase(supabaseUser);
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Não foi possível sincronizar seu usuário." }, { status: 500 });
    }

    const body = await req.json();
    const {
      weight, height, age, gender = "feminino",
      activityLevel = "moderate", goal = "emagrecimento",
      restrictions = [], mode = "daily"
    } = body;

    if (!weight || !height || !age) {
      return NextResponse.json({ success: false, error: "Campos obrigatórios: peso, altura e idade." }, { status: 400 });
    }

    const plan = normalizePlan(dbUser.plan);
    const limit = getLimit(plan);
    const usedThisWeek = await prisma.mealHistory.count({
      where: {
        userId: dbUser.id,
        createdAt: { gte: startOfRollingWeek() },
      },
    });

    if (limit !== null && usedThisWeek >= limit) {
      return NextResponse.json({
        success: false,
        code: "MEAL_AI_LIMIT_REACHED",
        error: `Seu plano ${PLAN_LIMITS[plan].label} libera ${limit} gerações por semana.`,
        usage: { used: usedThisWeek, limit, plan },
      }, { status: 429 });
    }

    const requestedFasting = FASTING_PROTOCOLS.has(body.fastingProtocol)
      ? body.fastingProtocol as FastingProtocol
      : "none";
    const isPaid = plan === "start" || plan === "premium";

    if (requestedFasting !== "none" && !isPaid) {
      return NextResponse.json({
        success: false,
        code: "FASTING_REQUIRES_PAID_PLAN",
        error: "Jejum intermitente está disponível nos planos START e PREMIUM.",
        usage: { used: usedThisWeek, limit, plan },
      }, { status: 403 });
    }

    const profile: UserProfile = {
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      activityLevel,
      goal,
      restrictions,
      fastingProtocol: requestedFasting,
    };

    if (mode === "weekly") {
      const weeklyPlan = generateWeeklyPlan(profile);
      const habits = generateHabitSuggestions(profile);
      await prisma.mealHistory.create({
        data: {
          userId: dbUser.id,
          planJson: weeklyPlan as any,
          calories: weeklyPlan.days[0]?.totalCals,
        },
      });
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { xp: { increment: 25 }, lastActiveAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        mode: "weekly",
        plan: weeklyPlan,
        habits,
        fastingProtocol: requestedFasting,
        usage: { used: usedThisWeek + 1, limit, plan },
      });
    }

    const dailyPlan = generateDailyPlan(profile);
    const habits = generateHabitSuggestions(profile);

    await prisma.mealHistory.create({
      data: {
        userId: dbUser.id,
        planJson: dailyPlan as any,
        calories: dailyPlan.macros.calories,
      },
    });
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { xp: { increment: 25 }, lastActiveAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      mode: "daily",
      fastingProtocol: requestedFasting,
      macros: dailyPlan.macros,
      meals: dailyPlan.meals,
      score: dailyPlan.score,
      habits,
      usage: { used: usedThisWeek + 1, limit, plan },
    });

  } catch (error: any) {
    console.error("meal-ai error:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
