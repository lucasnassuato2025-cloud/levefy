import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { syncUserToDatabase } from "@/lib/db-sync";

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

    const user = await syncUserToDatabase(supabaseUser);
    if (!user) return NextResponse.json({ error: "Erro ao sincronizar usuario" }, { status: 500 });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
