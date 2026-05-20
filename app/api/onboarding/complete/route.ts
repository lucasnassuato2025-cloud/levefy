import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { buildRestrictionsFromOnboarding, estimateProjection } from "@/lib/onboarding";

function num(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser?.email) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const currentWeight = num(body.currentWeight);
    const goalWeight = num(body.goalWeight);
    const height = num(body.height);
    const age = num(body.age);
    const restrictions = buildRestrictionsFromOnboarding(body);
    const projection = estimateProjection({ ...body, currentWeight, goalWeight, height, age });

    const baseData = {
      name: body.name || supabaseUser.user_metadata?.full_name || undefined,
      avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || undefined,
      currentWeight,
      goalWeight,
      height,
      age: age ? Math.round(age) : undefined,
      gender: body.gender || undefined,
      goal: body.goal || "emagrecimento",
      activityLevel: body.activityLevel || "moderate",
      restrictions: { push: restrictions },
      xp: { increment: body.commitment ? 80 : 50 },
      lastActiveAt: new Date(),
    } as any;

    let existing = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    if (!existing) {
      existing = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    }

    const user = existing
      ? await prisma.user.update({ where: { id: existing.id }, data: baseData })
      : await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: body.name || supabaseUser.user_metadata?.full_name || null,
            avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
            currentWeight,
            goalWeight,
            height,
            age: age ? Math.round(age) : null,
            gender: body.gender || null,
            goal: body.goal || "emagrecimento",
            activityLevel: body.activityLevel || "moderate",
            restrictions,
            xp: body.commitment ? 80 : 50,
            lastActiveAt: new Date(),
          },
        });

    await prisma.habitLog.create({
      data: {
        userId: user.id,
        type: "onboarding_complete",
        value: body.commitment ? 1 : 0,
        notes: `Quiz concluido. 30d: ${projection.thirtyDays}. 90d: ${projection.ninetyDays}`,
      },
    }).catch(() => undefined);

    if (currentWeight) {
      await prisma.progress.create({
        data: {
          userId: user.id,
          weight: currentWeight,
          notes: "Peso inicial informado no onboarding",
        },
      }).catch(() => undefined);
    }

    await prisma.achievement.create({
      data: {
        userId: user.id,
        type: "onboarding_transformacao",
        title: "Transformação iniciada",
        description: "Concluiu o quiz inicial e ativou o plano de evolução.",
        xpGained: body.commitment ? 80 : 50,
      },
    }).catch(() => undefined);

    return NextResponse.json({ success: true, user, projection });
  } catch (error: any) {
    console.error("[onboarding/complete]", error);
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
