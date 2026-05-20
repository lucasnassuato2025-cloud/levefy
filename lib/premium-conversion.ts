import type { LevefyPlan } from "@/lib/plan-access";

export function isPremiumPlan(plan?: string | null) {
  return plan === "premium";
}

export function isStartOrPremium(plan?: string | null) {
  return plan === "start" || plan === "premium";
}

export function getProjectedWeight(currentWeight?: number | null, goalWeight?: number | null, days = 30) {
  if (!currentWeight) return null;
  const safeDays = Math.max(1, days);
  const defaultWeeklyLoss = currentWeight > 85 ? 0.65 : 0.45;
  const desiredDirection = goalWeight && goalWeight < currentWeight ? -1 : goalWeight && goalWeight > currentWeight ? 1 : -1;
  const weeklyChange = defaultWeeklyLoss * desiredDirection;
  const projected = currentWeight + (weeklyChange * safeDays) / 7;

  if (goalWeight) {
    if (desiredDirection < 0) return Math.max(goalWeight, Number(projected.toFixed(1)));
    return Math.min(goalWeight, Number(projected.toFixed(1)));
  }

  return Number(projected.toFixed(1));
}

export function getTransformationPercent(currentWeight?: number | null, goalWeight?: number | null, projectedWeight?: number | null) {
  if (!currentWeight || !goalWeight || !projectedWeight || currentWeight === goalWeight) return null;
  const total = Math.abs(currentWeight - goalWeight);
  const done = Math.abs(currentWeight - projectedWeight);
  return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
}

export function getEmotionalPremiumMessage(params: {
  name?: string | null;
  plan?: LevefyPlan | string | null;
  streak?: number | null;
  xp?: number | null;
  currentWeight?: number | null;
  goalWeight?: number | null;
}) {
  const firstName = params.name?.split(" ")[0] || "Você";
  const streak = params.streak ?? 0;
  const projected30 = getProjectedWeight(params.currentWeight, params.goalWeight, 30);

  if (params.plan === "premium") {
    if (projected30 && params.currentWeight) {
      const delta = Math.abs(params.currentWeight - projected30).toFixed(1).replace(".0", "");
      return `${firstName}, sua rota premium está ativa. Mantendo esse ritmo, sua próxima janela de 30 dias pode representar cerca de ${delta}kg de evolução.`;
    }
    return `${firstName}, sua rotina premium está ativa. O próximo passo é manter consistência diária para acelerar sua transformação.`;
  }

  if (streak >= 3) {
    return `${firstName}, você já criou uma sequência. Agora o Premium pode transformar esse hábito em uma rota personalizada de evolução.`;
  }

  return `${firstName}, o Free cria o primeiro hábito. O Premium mostra o caminho completo e ajusta sua evolução todos os dias.`;
}

export const PREMIUM_LOCKED_TEASERS = [
  {
    title: "Projeção de 90 dias",
    description: "Veja sua rota estimada até o resultado e saiba onde ajustar antes de travar.",
    tag: "Mais desejado",
  },
  {
    title: "Ajuste diário da IA",
    description: "Receba mudanças inteligentes no plano conforme seu check-in, humor e progresso.",
    tag: "IA Premium",
  },
  {
    title: "Mapa de evolução corporal",
    description: "Transforme peso, streak e hábitos em uma leitura simples de progresso real.",
    tag: "Resultado",
  },
] as const;
