import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { syncUserToDatabase } from "@/lib/db-sync";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha sao obrigatorios." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Credenciais invalidas." },
        { status: 401 }
      );
    }

    const user = await syncUserToDatabase(data.user);

    if (!user) {
      return NextResponse.json(
        { error: "Login realizado, mas nao foi possivel sincronizar o usuario." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Erro interno ao entrar." },
      { status: 500 }
    );
  }
}
