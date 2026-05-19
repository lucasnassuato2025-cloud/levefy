import { NextResponse } from "next/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const siteUrl = "https://levefy-mu.vercel.app";

    const sessionData: any = {
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      mode: planConfig.mode,
      success_url: `${siteUrl}/dashboard?success=true`,
      cancel_url: `${siteUrl}/membership`,
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
    console.error("[stripe/checkout] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
