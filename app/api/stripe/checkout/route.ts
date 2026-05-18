import { NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { plan, successUrl, cancelUrl } = await req.json();
    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planConfig) return NextResponse.json({ error: "Plano inválido" }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Usa NEXT_PUBLIC_SITE_URL (correto) em vez de NEXTAUTH_URL (inexistente)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://levefy.onrender.com";

    const sessionData: any = {
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      mode: planConfig.mode,
      success_url: successUrl ?? `${siteUrl}/dashboard?success=true`,
      cancel_url: cancelUrl ?? `${siteUrl}/membership`,
      customer_email: user?.email ?? undefined,
      metadata: { userId: user?.id ?? "", plan },
      locale: "pt-BR",
    };

    if (planConfig.mode === "payment") {
      sessionData.payment_method_types = ["card", "pix"];
      sessionData.payment_intent_data = {
        payment_method_options: { pix: { expires_after_seconds: 1800 } },
      };
    } else {
      sessionData.payment_method_types = ["card"];
    }

    const session = await stripe.checkout.sessions.create(sessionData);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
