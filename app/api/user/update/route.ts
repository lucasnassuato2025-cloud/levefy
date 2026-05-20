// app/api/user/update/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, weight, height, age, gender, goal, activityLevel, restrictions } = body;

    // Garante que o usuário existe antes de atualizar
    const exists = await prisma.user.findUnique({ where: { id: supabaseUser.id }, select: { id: true } });
    if (!exists) {
      return NextResponse.json({ error: "Usuário não encontrado no banco de dados" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id: supabaseUser.id },
      data: {
        ...(name           !== undefined && name !== ""    ? { name }                            : {}),
        ...(weight         !== undefined && weight !== ""  ? { currentWeight: parseFloat(weight) } : {}),
        ...(height         !== undefined && height !== ""  ? { height: parseFloat(height) }       : {}),
        ...(age            !== undefined && age !== ""     ? { age: parseInt(age) }               : {}),
        ...(gender         !== undefined && gender !== ""  ? { gender }                           : {}),
        ...(goal           !== undefined && goal !== ""    ? { goal }                             : {}),
        ...(activityLevel  !== undefined && activityLevel !== "" ? { activityLevel }              : {}),
        ...(Array.isArray(restrictions)                    ? { restrictions }                     : {}),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("[user/update] error:", error);
    return NextResponse.json({ error: error.message ?? "Erro interno" }, { status: 500 });
  }
}
