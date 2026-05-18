import { NextResponse } from "next/server";
import { generateDailyPlan, generateWeeklyPlan, generateHabitSuggestions } from "@/lib/meal-engine";
import type { UserProfile } from "@/lib/meal-engine";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      weight, height, age, gender = "feminino",
      activityLevel = "moderate", goal = "emagrecimento",
      restrictions = [], mode = "daily"
    } = body;

    if (!weight || !height || !age) {
      return NextResponse.json({ success: false, error: "Campos obrigatórios: weight, height, age" }, { status: 400 });
    }

    const profile: UserProfile = {
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      activityLevel,
      goal,
      restrictions,
    };

    // Save to DB if user is authenticated (non-blocking)
    const saveToDB = async () => {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (dbUser) {
            const plan = mode === "weekly" ? generateWeeklyPlan(profile) : generateDailyPlan(profile);
            await prisma.mealHistory.create({
              data: {
                userId: user.id,
                planJson: plan as any,
                calories: "macros" in plan ? plan.macros?.calories : undefined,
              },
            });
            // Award XP
            await prisma.user.update({
              where: { id: user.id },
              data: { xp: { increment: 25 }, lastActiveAt: new Date() },
            });
          }
        }
      } catch { /* non-critical */ }
    };

    saveToDB();

    if (mode === "weekly") {
      const plan = generateWeeklyPlan(profile);
      const habits = generateHabitSuggestions(profile);
      return NextResponse.json({ success: true, mode: "weekly", plan, habits });
    }

    const { meals, macros, score } = generateDailyPlan(profile);
    const habits = generateHabitSuggestions(profile);

    return NextResponse.json({
      success: true,
      mode: "daily",
      macros,
      meals,
      score,
      habits,
    });

  } catch (error: any) {
    console.error("meal-ai error:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
