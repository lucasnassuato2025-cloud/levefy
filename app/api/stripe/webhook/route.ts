import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: plan === "START" ? "start" : "premium", stripeId: session.customer ?? undefined, xp: { increment: 50 } },
        });
        await prisma.achievement.create({
          data: { userId, type: "premium", title: "Membro Premium", description: "Assinou o plano", xpGained: 50 },
        }).catch(() => {});
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;
      const user = await prisma.user.findFirst({ where: { stripeId: sub.customer } });
      if (user) await prisma.user.update({ where: { id: user.id }, data: { plan: "free" } });
    }
  } catch (err) { console.error("webhook error:", err); }
  return NextResponse.json({ received: true });
}
