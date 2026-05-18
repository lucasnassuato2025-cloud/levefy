// lib/gamification.ts — XP, levels, achievements

export const XP_ACTIONS = {
  LOGIN:          10,
  MEAL_GENERATED: 25,
  WATER_LOGGED:   5,
  HABIT_LOGGED:   10,
  WEIGHT_LOGGED:  15,
  STREAK_7:       100,
  STREAK_21:      300,
  CHALLENGE_DAY:  20,
} as const;

export const LEVELS = [
  { level: 1,  xpMin: 0,    title: "Iniciante",    emoji: "🌱" },
  { level: 2,  xpMin: 100,  title: "Aprendiz",     emoji: "🌿" },
  { level: 3,  xpMin: 300,  title: "Dedicado",     emoji: "🍀" },
  { level: 4,  xpMin: 600,  title: "Consistente",  emoji: "💪" },
  { level: 5,  xpMin: 1000, title: "Focado",       emoji: "🎯" },
  { level: 6,  xpMin: 1500, title: "Disciplinado", emoji: "⚡" },
  { level: 7,  xpMin: 2200, title: "Especialista", emoji: "🏆" },
  { level: 8,  xpMin: 3000, title: "Mestre",       emoji: "👑" },
] as const;

export function getLevelFromXP(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.xpMin) ?? LEVELS[0];
}

export function getNextLevel(xp: number) {
  const currentLevel = getLevelFromXP(xp);
  return LEVELS.find(l => l.level === currentLevel.level + 1) ?? null;
}

export function getXPProgress(xp: number): number {
  const current = getLevelFromXP(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.xpMin - current.xpMin;
  const progress = xp - current.xpMin;
  return Math.round((progress / range) * 100);
}

export const MEDALS = [
  { id: "streak_7",      title: "Semana Perfeita",    desc: "7 dias seguidos",        emoji: "🔥", xp: 100 },
  { id: "streak_21",     title: "21 Dias Guerreiro",  desc: "Completou o desafio",    emoji: "🏆", xp: 300 },
  { id: "first_plan",    title: "Primeiro Passo",     desc: "Gerou primeiro plano",   emoji: "🌱", xp: 25  },
  { id: "water_week",    title: "Hidratado",          desc: "Água 7 dias seguidos",   emoji: "💧", xp: 75  },
  { id: "weight_lost_2", title: "Perdeu 2kg",         desc: "Resultado real",         emoji: "⚡", xp: 150 },
  { id: "premium",       title: "Membro Premium",     desc: "Assinou o plano",        emoji: "👑", xp: 50  },
] as const;
