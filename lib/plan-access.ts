export type LevefyPlan = "free" | "start" | "premium";

export const PLAN_LIMITS = {
  free: {
    mealAiGenerationsPerWeek: 1,
    recipesPerWeek: 5,
    dailyCheckIn: true,
    shoppingList: "simples",
    progressCharts: "basico",
    label: "Grátis",
  },
  start: {
    mealAiGenerationsPerWeek: 5,
    recipesPerWeek: 20,
    dailyCheckIn: true,
    shoppingList: "semanal",
    progressCharts: "intermediario",
    label: "START",
  },
  premium: {
    mealAiGenerationsPerWeek: "ilimitado",
    recipesPerWeek: "ilimitado",
    dailyCheckIn: true,
    shoppingList: "automatica",
    progressCharts: "avancado",
    label: "PREMIUM",
  },
} as const;

export const FREE_VALUE_STACK = [
  "1 plano IA por semana para criar o primeiro resultado rápido",
  "check-in diário com XP e streak para criar hábito",
  "dashboard essencial de peso, hidratação e progresso",
  "5 receitas saudáveis liberadas por semana",
];

export const PREMIUM_VALUE_STACK = [
  "Meal AI ilimitado com ajustes diários",
  "substituição inteligente de refeições",
  "lista de compras automática",
  "projeção de evolução em 30 e 90 dias",
  "receitas premium ilimitadas",
  "gráficos avançados e insights de progresso",
];

export function normalizePlan(plan?: string | null): LevefyPlan {
  if (plan === "premium" || plan === "start") return plan;
  return "free";
}

export function isPaidPlan(plan?: string | null) {
  return normalizePlan(plan) !== "free";
}
