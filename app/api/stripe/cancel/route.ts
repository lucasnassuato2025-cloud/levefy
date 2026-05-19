// app/api/stripe/cancel/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });
    if (!user?.stripeId) return NextResponse.json({ error: "Nenhuma assinatura encontrada" }, { status: 400 });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeId,
      status: "active",
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: "Nenhuma assinatura ativa encontrada" }, { status: 400 });
    }

    // Cancel at period end (user keeps access until end of billing period)
    await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
