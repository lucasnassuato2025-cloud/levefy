import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const RECIPES = [
  { title: "Bowl de frango com quinoa", description: "Proteico e saboroso", calories: 420, protein: 45, carbs: 35, fat: 10, category: "almoco", tags: ["proteico","fit"], ingredients: [{"name":"Frango grelhado","amount":"150g"},{"name":"Quinoa cozida","amount":"100g"},{"name":"Espinafre","amount":"50g"}], prepTime: 20, difficulty: "fácil", goalType: ["emagrecimento","manutencao"], isPremium: false },
  { title: "Omelete de espinafre e cottage", description: "Café da manhã poderoso", calories: 280, protein: 28, carbs: 5, fat: 16, category: "cafe", tags: ["low_carb","proteico"], ingredients: [{"name":"Ovos","amount":"3 unidades"},{"name":"Espinafre","amount":"50g"},{"name":"Cottage","amount":"50g"}], prepTime: 10, difficulty: "fácil", goalType: ["emagrecimento","low_carb"], isPremium: false },
  { title: "Batata doce com atum", description: "Lanche simples e nutritivo", calories: 350, protein: 32, carbs: 40, fat: 4, category: "lanche", tags: ["simples"], ingredients: [{"name":"Batata doce assada","amount":"200g"},{"name":"Atum em água","amount":"120g"}], prepTime: 30, difficulty: "fácil", goalType: ["emagrecimento","hipertrofia"], isPremium: false },
  { title: "Panqueca de aveia e banana", description: "Deliciosa e saudável", calories: 310, protein: 12, carbs: 52, fat: 6, category: "cafe", tags: ["doce","fit"], ingredients: [{"name":"Aveia","amount":"80g"},{"name":"Banana","amount":"1 média"},{"name":"Ovos","amount":"2 unidades"}], prepTime: 15, difficulty: "fácil", goalType: ["manutencao"], isPremium: false },
  { title: "Marmita de frango com legumes", description: "Completa para o almoço", calories: 480, protein: 50, carbs: 40, fat: 10, category: "almoco", tags: ["completo","marmita"], ingredients: [{"name":"Frango","amount":"200g"},{"name":"Arroz integral","amount":"100g"},{"name":"Legumes variados","amount":"150g"}], prepTime: 35, difficulty: "médio", goalType: ["hipertrofia","manutencao"], isPremium: true },
  { title: "Salada César fit", description: "Leve e saborosa", calories: 390, protein: 38, carbs: 20, fat: 18, category: "almoco", tags: ["salada","fit"], ingredients: [{"name":"Alface romana","amount":"100g"},{"name":"Frango grelhado","amount":"120g"},{"name":"Grão-de-bico","amount":"50g"}], prepTime: 15, difficulty: "fácil", goalType: ["emagrecimento"], isPremium: true },
  { title: "Carne moída com abobrinha", description: "Low carb saboroso", calories: 440, protein: 40, carbs: 12, fat: 25, category: "jantar", tags: ["low_carb"], ingredients: [{"name":"Patinho moído","amount":"150g"},{"name":"Abobrinha","amount":"200g"},{"name":"Azeite","amount":"1 colher"}], prepTime: 25, difficulty: "médio", goalType: ["low_carb","definicao"], isPremium: true },
  { title: "Smoothie proteico de morango", description: "Pré ou pós treino", calories: 240, protein: 28, carbs: 22, fat: 3, category: "lanche", tags: ["shake","pre-treino"], ingredients: [{"name":"Morango","amount":"150g"},{"name":"Whey protein","amount":"30g"},{"name":"Iogurte grego","amount":"100g"}], prepTime: 5, difficulty: "fácil", goalType: ["hipertrofia"], isPremium: true },
  { title: "Tapioca com cottage e tomate", description: "Café da manhã rápido", calories: 290, protein: 18, carbs: 42, fat: 5, category: "cafe", tags: ["simples","rápido"], ingredients: [{"name":"Goma de tapioca","amount":"60g"},{"name":"Cottage","amount":"80g"},{"name":"Tomate","amount":"50g"}], prepTime: 10, difficulty: "fácil", goalType: ["emagrecimento","manutencao"], isPremium: false },
  { title: "Arroz integral com feijão e frango", description: "Combinação clássica e nutritiva", calories: 520, protein: 42, carbs: 58, fat: 8, category: "almoco", tags: ["clássico","completo"], ingredients: [{"name":"Arroz integral","amount":"100g"},{"name":"Feijão cozido","amount":"100g"},{"name":"Frango","amount":"120g"}], prepTime: 30, difficulty: "fácil", goalType: ["manutencao","hipertrofia"], isPremium: false },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing
  await prisma.recipe.deleteMany();
  await prisma.mealTemplate.deleteMany();

  // Insert recipes
  for (const r of RECIPES) {
    await prisma.recipe.create({ data: r as any });
  }
  console.log(`✅ ${RECIPES.length} receitas criadas`);

  // Meal templates
  const templates = [
    { name: "Emagrecimento — Dia tipo", goalType: "emagrecimento", totalCals: 1600, protein: 130, carbs: 140, fat: 50,
      meals: [
        { label: "Café da manhã", items: ["Omelete de espinafre", "Café preto"] },
        { label: "Lanche",        items: ["Iogurte grego", "Maçã"] },
        { label: "Almoço",        items: ["Frango grelhado", "Arroz integral", "Salada verde"] },
        { label: "Lanche 2",      items: ["Castanhas", "Banana"] },
        { label: "Jantar",        items: ["Peixe grelhado", "Legumes no vapor"] },
      ]
    },
    { name: "Hipertrofia — Dia tipo", goalType: "hipertrofia", totalCals: 2800, protein: 200, carbs: 320, fat: 70,
      meals: [
        { label: "Café da manhã", items: ["Panqueca de aveia", "Ovos mexidos", "Banana"] },
        { label: "Lanche",        items: ["Whey protein", "Batata doce"] },
        { label: "Almoço",        items: ["Frango grelhado", "Arroz integral", "Feijão"] },
        { label: "Pré-treino",    items: ["Banana", "Amendoim"] },
        { label: "Pós-treino",    items: ["Whey protein", "Fruta"] },
        { label: "Jantar",        items: ["Carne magra", "Macarrão integral", "Vegetais"] },
      ]
    },
    { name: "Low Carb — Dia tipo", goalType: "low_carb", totalCals: 1800, protein: 150, carbs: 80, fat: 100,
      meals: [
        { label: "Café da manhã", items: ["Ovos mexidos", "Abacate", "Café bulletproof"] },
        { label: "Almoço",        items: ["Salmão grelhado", "Salada verde", "Azeite"] },
        { label: "Lanche",        items: ["Castanhas", "Queijo"] },
        { label: "Jantar",        items: ["Carne moída", "Abobrinha", "Brócolis"] },
      ]
    },
  ];

  for (const t of templates) {
    await prisma.mealTemplate.create({ data: t as any });
  }
  console.log(`✅ ${templates.length} templates criados`);
  console.log("🎉 Seed concluído!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
