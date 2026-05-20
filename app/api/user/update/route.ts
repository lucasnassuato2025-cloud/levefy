// app/api/user/update/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const { name, weight, height, age, gender, goal, activityLevel, restrictions } = body;

    await prisma.user.update({
      where: { id: supabaseUser.id },
      data: {
        name: name || undefined,
        currentWeight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        goal: goal || undefined,
        activityLevel: activityLevel || undefined,
        ...(Array.isArray(restrictions) ? { restrictions } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
