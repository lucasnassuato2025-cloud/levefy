import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const STRIPE_PLANS = {
  START: {
    priceId: process.env.STRIPE_PRICE_START!,
    amount: 2700,
    name: "Levefy START",
    mode: "payment" as const,
  },
  PREMIUM: {
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    amount: 1900,
    name: "Levefy PREMIUM",
    mode: "subscription" as const,
  },
};
