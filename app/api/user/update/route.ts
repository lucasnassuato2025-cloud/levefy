import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await req.json();
    const { name, weight, goalWeight, height, age, gender, goal, activityLevel, restrictions, avatar } = body;

    const updateData: Record<string, any> = {};
    if (name && name !== "")                   updateData.name          = name;
    if (weight && weight !== "")               updateData.currentWeight = parseFloat(weight);
    if (goalWeight && goalWeight !== "")       updateData.goalWeight    = parseFloat(goalWeight);
    if (height && height !== "")               updateData.height        = parseFloat(height);
    if (age && age !== "")                     updateData.age           = parseInt(age);
    if (gender && gender !== "")               updateData.gender        = gender;
    if (goal && goal !== "")                   updateData.goal          = goal;
    if (activityLevel && activityLevel !== "") updateData.activityLevel = activityLevel;
    if (Array.isArray(restrictions))           updateData.restrictions  = restrictions;
    if (avatar && avatar !== "")               updateData.avatar        = avatar;

    let existing = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    if (!existing && supabaseUser.email) {
      existing = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    }

    const updated = existing
      ? await prisma.user.update({ where: { id: existing.id }, data: updateData })
      : await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.full_name ?? name ?? null,
            avatar: supabaseUser.user_metadata?.avatar_url ?? supabaseUser.user_metadata?.picture ?? null,
            ...updateData,
          },
        });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}