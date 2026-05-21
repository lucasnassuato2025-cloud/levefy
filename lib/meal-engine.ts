// lib/meal-engine.ts
// Fake AI engine — zero API cost, zero tokens, 100% local logic

export type Goal = "emagrecimento" | "hipertrofia" | "manutencao" | "low_carb" | "definicao";
export type ActivityLevel = "sedentario" | "leve" | "moderate" | "ativo" | "muito_ativo";
export type Gender = "masculino" | "feminino";
export type MealType = "cafe" | "almoco" | "jantar" | "lanche1" | "lanche2";
export type FastingProtocol = "none" | "12_12" | "14_10" | "16_8";

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  restrictions: string[];
  fastingProtocol?: FastingProtocol;
}

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
}

export interface MealSlot {
  type: MealType;
  label: string;
  time: string;
  items: MealItem[];
  totalCals: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  tip?: string;
}

export interface WeeklyPlan {
  days: DayPlan[];
  shoppingList: ShoppingItem[];
}

export interface DayPlan {
  day: string;
  meals: MealSlot[];
  totalCals: number;
  score: number;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: string;
}

type MealScheduleItem = {
  type: MealType;
  label?: string;
  time?: string;
};

// ---- MACRO ENGINE ----

export function calculateMacros(profile: UserProfile): MacroResult {
  const { weight, height, age, gender, activityLevel, goal } = profile;

  // Harris-Benedict TMB
  let tmb: number;
  if (gender === "masculino") {
    tmb = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    tmb = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }

  const activityFactors: Record<ActivityLevel, number> = {
    sedentario: 1.2,
    leve: 1.375,
    moderate: 1.55,
    ativo: 1.725,
    muito_ativo: 1.9,
  };
  const tdee = tmb * activityFactors[activityLevel];

  const adjustments: Record<Goal, number> = {
    emagrecimento: -450,
    hipertrofia: 350,
    manutencao: 0,
    low_carb: -300,
    definicao: -250,
  };

  const calories = Math.round(tdee + adjustments[goal]);

  const macroRatios: Record<Goal, { p: number; c: number; f: number }> = {
    emagrecimento: { p: 0.35, c: 0.40, f: 0.25 },
    hipertrofia:   { p: 0.30, c: 0.50, f: 0.20 },
    manutencao:    { p: 0.25, c: 0.50, f: 0.25 },
    low_carb:      { p: 0.35, c: 0.20, f: 0.45 },
    definicao:     { p: 0.40, c: 0.35, f: 0.25 },
  };

  const r = macroRatios[goal];
  return {
    calories,
    protein: Math.round((calories * r.p) / 4),
    carbs:   Math.round((calories * r.c) / 4),
    fat:     Math.round((calories * r.f) / 9),
  };
}

// ---- FOOD DATABASE ----
// Grouped by goal, each with multiple options for randomization

const FOODS_BY_GOAL: Record<string, MealItem[][]> = {
  // proteinas
  protein: [
    [{ name: "Frango grelhado", amount: "150g", calories: 247, protein: 47, carbs: 0, fat: 5, emoji: "🍗" }],
    [{ name: "Peixe tilápia", amount: "150g", calories: 195, protein: 40, carbs: 0, fat: 4, emoji: "🐟" }],
    [{ name: "Patinho moído", amount: "130g", calories: 227, protein: 33, carbs: 0, fat: 10, emoji: "🥩" }],
    [{ name: "Atum em água", amount: "120g", calories: 126, protein: 28, carbs: 0, fat: 1, emoji: "🥫" }],
    [{ name: "Ovos (2 un)", amount: "100g", calories: 155, protein: 13, carbs: 1, fat: 11, emoji: "🥚" }],
    [{ name: "Iogurte grego", amount: "200g", calories: 130, protein: 18, carbs: 7, fat: 4, emoji: "🥛" }],
    [{ name: "Tofu firme", amount: "150g", calories: 118, protein: 13, carbs: 3, fat: 7, emoji: "🫘" }],
    [{ name: "Salmão grelhado", amount: "120g", calories: 248, protein: 27, carbs: 0, fat: 15, emoji: "🐠" }],
    [{ name: "Peito de peru", amount: "140g", calories: 196, protein: 35, carbs: 3, fat: 5, emoji: "🦃" }],
  ],
  // carboidratos
  carb: [
    [{ name: "Arroz integral", amount: "120g cozido", calories: 130, protein: 3, carbs: 27, fat: 1, emoji: "🍚" }],
    [{ name: "Batata doce", amount: "150g cozida", calories: 130, protein: 2, carbs: 30, fat: 0, emoji: "🍠" }],
    [{ name: "Aveia", amount: "50g", calories: 189, protein: 6, carbs: 33, fat: 3, emoji: "🌾" }],
    [{ name: "Macarrão integral", amount: "100g cozido", calories: 157, protein: 6, carbs: 31, fat: 1, emoji: "🍝" }],
    [{ name: "Quinoa", amount: "100g cozida", calories: 120, protein: 4, carbs: 21, fat: 2, emoji: "🌿" }],
    [{ name: "Mandioca cozida", amount: "150g", calories: 191, protein: 2, carbs: 45, fat: 0, emoji: "🫚" }],
    [{ name: "Pão integral (2 fatias)", amount: "60g", calories: 156, protein: 7, carbs: 28, fat: 3, emoji: "🍞" }],
    [{ name: "Inhame cozido", amount: "150g", calories: 118, protein: 2, carbs: 28, fat: 0, emoji: "🥔" }],
  ],
  // vegetais
  veggie: [
    [{ name: "Brócolis", amount: "100g", calories: 34, protein: 3, carbs: 7, fat: 0, emoji: "🥦" }],
    [{ name: "Alface + tomate", amount: "150g", calories: 28, protein: 1, carbs: 6, fat: 0, emoji: "🥗" }],
    [{ name: "Chuchu refogado", amount: "120g", calories: 31, protein: 1, carbs: 7, fat: 0, emoji: "🫑" }],
    [{ name: "Espinafre", amount: "100g", calories: 23, protein: 3, carbs: 4, fat: 0, emoji: "🥬" }],
    [{ name: "Cenoura", amount: "100g", calories: 41, protein: 1, carbs: 10, fat: 0, emoji: "🥕" }],
    [{ name: "Couve-flor", amount: "100g", calories: 25, protein: 2, carbs: 5, fat: 0, emoji: "🌸" }],
    [{ name: "Abobrinha grelhada", amount: "130g", calories: 26, protein: 2, carbs: 5, fat: 0, emoji: "🫛" }],
  ],
  // gorduras boas
  fat_good: [
    [{ name: "Azeite extra virgem", amount: "1 colher", calories: 90, protein: 0, carbs: 0, fat: 10, emoji: "🫒" }],
    [{ name: "Abacate", amount: "80g", calories: 128, protein: 1, carbs: 7, fat: 12, emoji: "🥑" }],
    [{ name: "Castanha do Pará (2un)", amount: "20g", calories: 131, protein: 3, carbs: 2, fat: 13, emoji: "🥜" }],
    [{ name: "Amendoim", amount: "30g", calories: 171, protein: 8, carbs: 5, fat: 14, emoji: "🥜" }],
  ],
  // cafe da manha
  breakfast: [
    [
      { name: "Ovos mexidos (2un)", amount: "100g", calories: 155, protein: 13, carbs: 1, fat: 11, emoji: "🍳" },
      { name: "Pão integral (1 fatia)", amount: "30g", calories: 78, protein: 4, carbs: 14, fat: 1, emoji: "🍞" },
      { name: "Café preto", amount: "200ml", calories: 5, protein: 0, carbs: 0, fat: 0, emoji: "☕" },
    ],
    [
      { name: "Aveia com banana", amount: "180g", calories: 218, protein: 6, carbs: 42, fat: 3, emoji: "🥣" },
      { name: "Leite desnatado", amount: "200ml", calories: 70, protein: 7, carbs: 10, fat: 0, emoji: "🥛" },
    ],
    [
      { name: "Tapioca (2 unidades)", amount: "100g", calories: 178, protein: 2, carbs: 44, fat: 0, emoji: "🫓" },
      { name: "Cottage", amount: "80g", calories: 72, protein: 11, carbs: 2, fat: 2, emoji: "🧀" },
      { name: "Mamão papaia", amount: "200g", calories: 78, protein: 1, carbs: 20, fat: 0, emoji: "🍈" },
    ],
    [
      { name: "Iogurte grego", amount: "180g", calories: 117, protein: 16, carbs: 7, fat: 3, emoji: "🥛" },
      { name: "Granola low sugar", amount: "30g", calories: 114, protein: 3, carbs: 20, fat: 3, emoji: "🌾" },
      { name: "Morangos", amount: "100g", calories: 32, protein: 1, carbs: 8, fat: 0, emoji: "🍓" },
    ],
    [
      { name: "Vitamina de frutas", amount: "300ml", calories: 180, protein: 8, carbs: 30, fat: 2, emoji: "🥤" },
      { name: "Torrada integral (2un)", amount: "50g", calories: 130, protein: 5, carbs: 24, fat: 1, emoji: "🍞" },
    ],
  ],
  // lanches
  snack: [
    [
      { name: "Banana", amount: "1 média (120g)", calories: 107, protein: 1, carbs: 27, fat: 0, emoji: "🍌" },
      { name: "Pasta de amendoim", amount: "1 col (30g)", calories: 171, protein: 8, carbs: 5, fat: 14, emoji: "🥜" },
    ],
    [
      { name: "Iogurte grego", amount: "150g", calories: 97, protein: 14, carbs: 6, fat: 2, emoji: "🥛" },
      { name: "Maçã", amount: "1 média (180g)", calories: 94, protein: 0, carbs: 25, fat: 0, emoji: "🍎" },
    ],
    [
      { name: "Castanhas mix", amount: "30g", calories: 183, protein: 5, carbs: 8, fat: 15, emoji: "🥜" },
    ],
    [
      { name: "Batata doce cozida", amount: "100g", calories: 87, protein: 2, carbs: 20, fat: 0, emoji: "🍠" },
      { name: "Frango desfiado", amount: "50g", calories: 82, protein: 16, carbs: 0, fat: 2, emoji: "🍗" },
    ],
    [
      { name: "Whey protein", amount: "1 scoop (30g)", calories: 110, protein: 25, carbs: 3, fat: 1, emoji: "💪" },
      { name: "Banana", amount: "1 pequena (90g)", calories: 80, protein: 1, carbs: 20, fat: 0, emoji: "🍌" },
    ],
    [
      { name: "Queijo cottage", amount: "100g", calories: 90, protein: 14, carbs: 2, fat: 3, emoji: "🧀" },
      { name: "Cenoura palito", amount: "80g", calories: 33, protein: 1, carbs: 8, fat: 0, emoji: "🥕" },
    ],
  ],
};

// ---- SUBSTITUTIONS ----
export const SUBSTITUTIONS: Record<string, string[]> = {
  "Arroz integral": ["Batata doce", "Quinoa", "Macarrão integral"],
  "Frango grelhado": ["Peixe tilápia", "Patinho moído", "Tofu firme"],
  "Batata doce": ["Arroz integral", "Mandioca cozida", "Inhame cozido"],
  "Leite desnatado": ["Leite vegetal", "Bebida de aveia", "Iogurte diluído"],
  "Aveia": ["Granola low sugar", "Quinoa flakes", "Tapioca"],
  "Ovo": ["Tofu mexido", "Cottage", "Iogurte grego"],
};

// ---- SEEDED RANDOM ----
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pickRandom<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

// ---- MEAL SLOT BUILDER ----
function buildMealSlot(
  type: MealType,
  macros: MacroResult,
  goal: Goal,
  seed: number,
  schedule?: Pick<MealScheduleItem, "label" | "time">
): MealSlot {
  const labels: Record<MealType, { label: string; time: string }> = {
    cafe:    { label: "Café da manhã",  time: "7:00" },
    lanche1: { label: "Lanche da manhã", time: "10:00" },
    almoco:  { label: "Almoço",          time: "13:00" },
    lanche2: { label: "Lanche da tarde", time: "16:00" },
    jantar:  { label: "Jantar",          time: "19:30" },
  };

  const tips: string[] = [
    "💧 Beba um copo de água antes de comer",
    "🕐 Mastigue devagar — 20 min para sentir saciedade",
    "🥗 Comece pelos vegetais para controlar a porção",
    "🚶 Uma caminhada leve após a refeição ajuda na digestão",
    "🌙 Jantar leve melhora a qualidade do sono",
  ];

  let items: MealItem[] = [];

  if (type === "cafe") {
    items = pickRandom(FOODS_BY_GOAL.breakfast, seed);
  } else if (type === "lanche1" || type === "lanche2") {
    items = pickRandom(FOODS_BY_GOAL.snack, seed + 5);
  } else {
    // almoco / jantar — build from components
    const protein = pickRandom(FOODS_BY_GOAL.protein, seed)[0];
    const carb = (goal === "low_carb")
      ? pickRandom([FOODS_BY_GOAL.carb[1], FOODS_BY_GOAL.carb[5]], seed + 1)[0] // batata doce ou mandioca
      : pickRandom(FOODS_BY_GOAL.carb, seed + 2)[0];
    const veggie = pickRandom(FOODS_BY_GOAL.veggie, seed + 3)[0];

    items = goal === "low_carb"
      ? [protein, veggie, pickRandom(FOODS_BY_GOAL.fat_good, seed + 4)[0]]
      : [protein, carb, veggie];
  }

  const totalCals    = items.reduce((a, x) => a + x.calories, 0);
  const totalProtein = items.reduce((a, x) => a + x.protein, 0);
  const totalCarbs   = items.reduce((a, x) => a + x.carbs, 0);
  const totalFat     = items.reduce((a, x) => a + x.fat, 0);

  return {
    type,
    label: schedule?.label ?? labels[type].label,
    time: schedule?.time ?? labels[type].time,
    items,
    totalCals,
    totalProtein,
    totalCarbs,
    totalFat,
    tip: Math.random() > 0.6 ? pickRandom(tips, seed + 10) : undefined,
  };
}

// ---- NUTRITIONAL SCORE ----
export function calculateScore(plan: MealSlot[], macros: MacroResult): number {
  const totalCals    = plan.reduce((a, m) => a + m.totalCals, 0);
  const totalProtein = plan.reduce((a, m) => a + m.totalProtein, 0);
  const totalCarbs   = plan.reduce((a, m) => a + m.totalCarbs, 0);

  let score = 70;

  // Calorie accuracy ±10%
  const calDiff = Math.abs(totalCals - macros.calories) / macros.calories;
  if (calDiff < 0.05) score += 15;
  else if (calDiff < 0.1) score += 10;
  else if (calDiff < 0.2) score += 5;

  // Protein adequacy
  const proteinRatio = totalProtein / macros.protein;
  if (proteinRatio >= 0.9) score += 10;
  else if (proteinRatio >= 0.7) score += 5;

  // Variety (count unique items)
  const items = plan.flatMap(m => m.items.map(i => i.name));
  const unique = new Set(items).size;
  if (unique >= 12) score += 5;

  return Math.min(100, score);
}

function getMealSchedule(profile: UserProfile): MealScheduleItem[] {
  switch (profile.fastingProtocol) {
    case "16_8":
      return [
        { type: "almoco", label: "Quebra do jejum", time: "12:00" },
        { type: "lanche2", label: "Lanche da janela", time: "16:00" },
        { type: "jantar", label: "Última refeição", time: "19:30" },
      ];
    case "14_10":
      return [
        { type: "cafe", label: "Quebra do jejum", time: "10:00" },
        { type: "almoco", time: "13:30" },
        { type: "lanche2", label: "Lanche da janela", time: "16:30" },
        { type: "jantar", label: "Última refeição", time: "19:30" },
      ];
    case "12_12":
      return [
        { type: "cafe", label: "Primeira refeição", time: "8:00" },
        { type: "almoco", time: "12:30" },
        { type: "lanche2", label: "Lanche da janela", time: "16:30" },
        { type: "jantar", label: "Última refeição", time: "20:00" },
      ];
    default:
      return [
        { type: "cafe" },
        { type: "lanche1" },
        { type: "almoco" },
        { type: "lanche2" },
        { type: "jantar" },
      ];
  }
}

// ---- GENERATE DAILY PLAN ----
export function generateDailyPlan(profile: UserProfile, dateSeed?: number): { meals: MealSlot[]; macros: MacroResult; score: number } {
  const macros = calculateMacros(profile);
  const seed = dateSeed ?? Date.now();
  const schedule = getMealSchedule(profile);

  const meals = schedule.map((item, i) => buildMealSlot(
    item.type,
    macros,
    profile.goal,
    seed + i * 100,
    item
  ));
  const score = calculateScore(meals, macros);

  return { meals, macros, score };
}

// ---- GENERATE WEEKLY PLAN ----
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export function generateWeeklyPlan(profile: UserProfile): WeeklyPlan {
  const baseSeed = Date.now();

  const days: DayPlan[] = DAYS.map((day, i) => {
    const { meals, macros, score } = generateDailyPlan(profile, baseSeed + i * 1000);
    return {
      day,
      meals,
      totalCals: meals.reduce((a, m) => a + m.totalCals, 0),
      score,
    };
  });

  // Generate shopping list from all unique items
  const itemMap = new Map<string, ShoppingItem>();
  days.forEach(day => {
    day.meals.forEach(meal => {
      meal.items.forEach(item => {
        if (!itemMap.has(item.name)) {
          itemMap.set(item.name, {
            name: item.name,
            amount: item.amount,
            category: categorizeFood(item),
          });
        }
      });
    });
  });

  return { days, shoppingList: Array.from(itemMap.values()) };
}

function categorizeFood(item: MealItem): string {
  if (["🍗", "🐟", "🥩", "🥫", "🥚", "🐠", "🦃", "🫘"].includes(item.emoji)) return "Proteínas";
  if (["🍚", "🍠", "🌾", "🍝", "🌿", "🍞", "🫚", "🥔"].includes(item.emoji)) return "Carboidratos";
  if (["🥦", "🥗", "🫑", "🥬", "🥕", "🌸", "🫛"].includes(item.emoji)) return "Hortifrúti";
  if (["🥛", "🧀", "🥛"].includes(item.emoji)) return "Laticínios";
  if (["🥑", "🥜", "🫒"].includes(item.emoji)) return "Gorduras boas";
  if (["🍌", "🍎", "🍓", "🍈", "🫐"].includes(item.emoji)) return "Frutas";
  return "Outros";
}

// ---- HABITS SUGGESTIONS ----
export function generateHabitSuggestions(profile: UserProfile): string[] {
  const base = [
    `🥤 Meta de água: ${Math.round(profile.weight * 0.035 * 10) / 10}L/dia`,
    "⏰ Coma a cada 3-4 horas para manter o metabolismo ativo",
    "🌙 Último lanche: 2h antes de dormir",
    "🛌 7-9h de sono para otimizar hormônios",
    "🚶 30 min de movimento diário — mesmo caminhada leve",
  ];

  const goalSpecific: Record<Goal, string[]> = {
    emagrecimento: [
      "🍽️ Use pratos menores — engana o cérebro",
      "🥗 Prato: 50% vegetais, 25% proteína, 25% carb",
    ],
    hipertrofia: [
      "💪 Proteína pós-treino em até 30 minutos",
      "🍌 Carboidrato simples pré-treino para energia",
    ],
    manutencao: [
      "📊 Pesagem semanal sempre no mesmo horário",
      "🔄 Varie as refeições para evitar monotonia",
    ],
    low_carb: [
      "🥥 Gorduras boas = energia sustentada",
      "🧂 Reponha eletrólitos (sódio, magnésio)",
    ],
    definicao: [
      "⚡ Treino em jejum pode acelerar resultados",
      "💧 Hidratação extra para definição muscular",
    ],
  };

  return [...base, ...(goalSpecific[profile.goal] || [])];
}
