import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await req.json();
    const { name, weight, height, age, gender, goal, activityLevel, restrictions } = body;

    const updateData: Record<string, any> = {};
    if (name && name !== "")                   updateData.name          = name;
    if (weight && weight !== "")               updateData.currentWeight = parseFloat(weight);
    if (height && height !== "")               updateData.height        = parseFloat(height);
    if (age && age !== "")                     updateData.age           = parseInt(age);
    if (gender && gender !== "")               updateData.gender        = gender;
    if (goal && goal !== "")                   updateData.goal          = goal;
    if (activityLevel && activityLevel !== "") updateData.activityLevel = activityLevel;
    if (Array.isArray(restrictions))           updateData.restrictions  = restrictions;

    const updated = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: updateData,
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name ?? name ?? null,
        avatar: supabaseUser.user_metadata?.avatar_url ?? null,
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
'@ | Set-Content -Encoding UTF8 app/api/user/update/route.ts