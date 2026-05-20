import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

function getProviderAvatar(metadata: any) {
  return metadata?.avatar_url ?? metadata?.picture ?? metadata?.photoURL ?? null;
}

function cleanNumber(value: unknown, type: "float" | "int") {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = type === "int" ? parseInt(String(value), 10) : parseFloat(String(value));
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
    const { name, weight, height, age, gender, goal, activityLevel, restrictions, avatar } = body;

    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = String(name).trim() || null;

    const parsedWeight = cleanNumber(weight, "float");
    const parsedHeight = cleanNumber(height, "float");
    const parsedAge = cleanNumber(age, "int");

    if (parsedWeight !== undefined) updateData.currentWeight = parsedWeight;
    if (parsedHeight !== undefined) updateData.height = parsedHeight;
    if (parsedAge !== undefined) updateData.age = parsedAge;
    if (gender !== undefined && gender !== "") updateData.gender = gender;
    if (goal !== undefined && goal !== "") updateData.goal = goal;
    if (activityLevel !== undefined && activityLevel !== "") updateData.activityLevel = activityLevel;
    if (Array.isArray(restrictions)) updateData.restrictions = restrictions;
    if (avatar !== undefined && avatar !== "") updateData.avatar = avatar;

    const providerName = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? null;
    const providerAvatar = getProviderAvatar(supabaseUser.user_metadata);

    const existingByEmail = await prisma.user.findUnique({ where: { email: supabaseUser.email } });
    const existingById = existingByEmail ? null : await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    const existingUser = existingByEmail ?? existingById;

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...updateData,
            name: updateData.name ?? existingUser.name ?? providerName,
            avatar: updateData.avatar ?? existingUser.avatar ?? providerAvatar,
          },
        })
      : await prisma.user.create({
          data: {
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: updateData.name ?? providerName,
            avatar: updateData.avatar ?? providerAvatar,
            ...updateData,
          },
        });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("[api/user/update]", error);
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
