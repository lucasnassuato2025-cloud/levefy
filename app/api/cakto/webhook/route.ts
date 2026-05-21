import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CaktoWebhookPayload = {
  secret?: string;
  event?: string;
  data?: {
    id?: string;
    refId?: string;
    status?: string;
    amount?: number;
    customer?: {
      email?: string;
      name?: string;
    };
    offer?: {
      id?: string;
      name?: string;
    };
    product?: {
      id?: string;
      name?: string;
      short_id?: string;
      type?: string;
    };
  };
};

const APPROVED_EVENTS = new Set([
  "purchase_approved",
  "subscription_created",
  "subscription_renewed",
]);

const REVOKE_EVENTS = new Set([
  "refund",
  "chargeback",
  "subscription_canceled",
  "subscription_renewal_refused",
]);

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || "";
}

function matchesConfiguredProduct(payload: CaktoWebhookPayload) {
  const allowedProductId = process.env.CAKTO_START_PRODUCT_ID?.trim();
  const allowedOfferId = process.env.CAKTO_START_OFFER_ID?.trim();

  if (allowedProductId && payload.data?.product?.id !== allowedProductId) {
    return false;
  }

  if (allowedOfferId && payload.data?.offer?.id !== allowedOfferId) {
    return false;
  }

  return true;
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CAKTO_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    console.error("[cakto/webhook] CAKTO_WEBHOOK_SECRET nao configurado.");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let payload: CaktoWebhookPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.secret || !safeCompare(payload.secret, webhookSecret)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!payload.event || !payload.data) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!matchesConfiguredProduct(payload)) {
    return NextResponse.json({ received: true, ignored: "product_or_offer_mismatch" });
  }

  const email = normalizeEmail(payload.data.customer?.email);
  if (!email) {
    return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.warn(`[cakto/webhook] Compra sem usuario correspondente: ${email}`);
    return NextResponse.json({ received: true, activated: false, reason: "user_not_found" });
  }

  if (APPROVED_EVENTS.has(payload.event) && payload.data.status === "paid") {
    const orderId = payload.data.id || payload.data.refId || email;
    const achievementType = `cakto_start_${orderId}`;
    const existingAchievement = await prisma.achievement.findFirst({
      where: { userId: user.id, type: achievementType },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: user.plan === "premium" ? "premium" : "start",
        lastActiveAt: new Date(),
        ...(existingAchievement ? {} : { xp: { increment: 50 } }),
      },
    });

    if (!existingAchievement) {
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: achievementType,
          title: "Plano START liberado",
          description: "Compra aprovada pela Cakto",
          xpGained: 50,
        },
      });
    }

    return NextResponse.json({ received: true, activated: true, plan: "start" });
  }

  if (REVOKE_EVENTS.has(payload.event) && user.plan === "start") {
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: "free" },
    });

    return NextResponse.json({ received: true, revoked: true });
  }

  return NextResponse.json({ received: true, ignored: payload.event });
}
