import Stripe from "stripe";

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

// Inicialização lazy — evita erro durante o build quando a variável ainda não existe
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY não configurada.");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    });
  }
  return _stripe;
}

// Mantém compatibilidade com imports existentes que usam `stripe` diretamente
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});
