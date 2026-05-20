export type OnboardingGoal = "emagrecimento" | "definicao" | "massa" | "saude";
export type OnboardingActivity = "sedentary" | "light" | "moderate" | "active";
export type OnboardingDifficulty = "fome" | "ansiedade" | "tempo" | "constancia" | "doces" | "delivery";

export type OnboardingInput = {
  name?: string;
  currentWeight?: number;
  goalWeight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: OnboardingGoal | string;
  activityLevel?: OnboardingActivity | string;
  difficulty?: OnboardingDifficulty | string;
  minutesPerDay?: number;
  commitment?: boolean;
};

export function isOnboardingComplete(user: any): boolean {
  return Boolean(user?.currentWeight && user?.height && user?.age && user?.goal && user?.activityLevel);
}

export function getGoalLabel(goal?: string) {
  const labels: Record<string, string> = {
    emagrecimento: "emagrecer com consistência",
    definicao: "definir o corpo sem radicalismo",
    massa: "ganhar massa com estratégia",
    saude: "ter mais saúde e energia",
  };
  return labels[goal || ""] || "evoluir com constância";
}

export function getDifficultyLabel(difficulty?: string) {
  const labels: Record<string, string> = {
    fome: "controlar a fome",
    ansiedade: "comer melhor mesmo na ansiedade",
    tempo: "manter rotina mesmo sem tempo",
    constancia: "não desistir depois de poucos dias",
    doces: "reduzir doces sem sofrimento",
    delivery: "sair do ciclo do delivery",
  };
  return labels[difficulty || ""] || "criar consistência";
}

export function estimateProjection(input: OnboardingInput) {
  const current = Number(input.currentWeight || 0);
  const target = Number(input.goalWeight || 0);
  const activity = input.activityLevel || "moderate";
  const goal = input.goal || "emagrecimento";

  const activityFactor: Record<string, number> = {
    sedentary: 0.85,
    light: 1,
    moderate: 1.12,
    active: 1.25,
  };

  const factor = activityFactor[String(activity)] ?? 1;
  const wantsLoss = goal === "emagrecimento" || (target > 0 && current > target);
  const wantsGain = goal === "massa" || (target > current && target > 0);

  if (!current) {
    return {
      thirtyDays: "primeiros sinais de evolução",
      ninetyDays: "rotina mais leve e consistente",
      numeric30: null as number | null,
      numeric90: null as number | null,
    };
  }

  if (wantsGain) {
    const gain30 = +(0.7 * factor).toFixed(1);
    const gain90 = +(2.1 * factor).toFixed(1);
    return {
      thirtyDays: `até +${gain30}kg de massa/estrutura com plano consistente`,
      ninetyDays: `até +${gain90}kg de evolução corporal com consistência`,
      numeric30: gain30,
      numeric90: gain90,
    };
  }

  if (wantsLoss) {
    const maxLoss = target > 0 ? Math.max(0.8, current - target) : 6;
    const loss30 = +Math.min(maxLoss, 3.8 * factor).toFixed(1);
    const loss90 = +Math.min(maxLoss, 9.5 * factor).toFixed(1);
    return {
      thirtyDays: `até ${loss30}kg a menos com rotina consistente`,
      ninetyDays: `até ${loss90}kg a menos mantendo o plano`,
      numeric30: loss30,
      numeric90: loss90,
    };
  }

  return {
    thirtyDays: "mais energia, menos improviso e rotina alimentar mais clara",
    ninetyDays: "hábitos sólidos e evolução visível na rotina",
    numeric30: null as number | null,
    numeric90: null as number | null,
  };
}

export function buildEmotionalInsight(input: OnboardingInput) {
  const name = input.name?.trim() || "Você";
  const goal = getGoalLabel(String(input.goal || ""));
  const difficulty = getDifficultyLabel(String(input.difficulty || ""));
  const minutes = Number(input.minutesPerDay || 15);

  return `${name}, seu foco não precisa ser perfeição. Para ${goal}, o Levefy vai te ajudar principalmente a ${difficulty}. Comece com ${minutes} minutos por dia e mantenha a sequência viva.`;
}

export function buildRestrictionsFromOnboarding(input: OnboardingInput) {
  const restrictions: string[] = [];
  if (input.difficulty) restrictions.push(`onboarding_difficulty:${input.difficulty}`);
  if (input.minutesPerDay) restrictions.push(`onboarding_minutes:${input.minutesPerDay}`);
  if (input.commitment) restrictions.push("commitment_7_days:true");
  return restrictions;
}
