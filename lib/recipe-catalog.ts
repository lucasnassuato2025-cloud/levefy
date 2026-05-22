type RecipeLike = {
  title: string;
  description: string;
  category: string;
  cal: number;
  time: number;
  diff: "Fácil" | "Médio";
  goal: string[];
  premium: boolean;
  image: string;
  ingredients: string[];
  steps: string[];
  macros: { protein: number; carbs: number; fat: number };
};

const FREE_RECIPE_LIMIT = 40;

type RecipeGroup = {
  category: string;
  goals: string[];
  description: string;
  bases: string[];
  variants: string[];
  ingredients: string[];
  steps: string[];
  photos: string[];
  cal: [number, number];
  time: [number, number];
  macros: { protein: number; carbs: number; fat: number };
  premiumFrom?: number;
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;

const GROUPS: RecipeGroup[] = [
  {
    category: "Churrasco fit",
    goals: ["Hipertrofia", "Manutenção", "Perda de gordura", "Proteico"],
    description: "Churrasco com cortes selecionados, porção controlada e acompanhamentos leves.",
    bases: ["Picanha magra", "Maminha grelhada", "Fraldinha com ervas", "Alcatra acebolada", "Contra-file aparado", "Espetinho de patinho", "Baby beef", "Bife ancho porcionado"],
    variants: ["com vinagrete leve", "com legumes na brasa", "com arroz integral", "com salada crocante", "com farofa de aveia"],
    ingredients: ["carne vermelha aparada", "limão", "alho", "pimenta-do-reino", "alecrim", "salada verde", "azeite medido"],
    steps: ["Retire o excesso de gordura aparente.", "Tempere com alho, limão e ervas.", "Grelhe em fogo alto até o ponto desejado.", "Sirva com acompanhamento leve e porção controlada."],
    photos: ["photo-1555939594-58d7cb561ad1", "photo-1544025162-d76694265947", "photo-1600891964092-4316c288032e", "photo-1558030006-450675393462"],
    cal: [430, 620],
    time: [20, 38],
    macros: { protein: 44, carbs: 18, fat: 24 },
  },
  {
    category: "Carnes vermelhas",
    goals: ["Hipertrofia", "Manutenção", "Proteico", "Low carb"],
    description: "Receita proteica com carne vermelha, vegetais e preparo mais equilibrado.",
    bases: ["Patinho moído", "Carne de panela magra", "Isca de alcatra", "Bife de coxão mole", "Músculo desfiado", "Ragu fit de carne", "Hambúrguer caseiro de patinho", "Carne louca leve"],
    variants: ["com abobrinha", "com mix de folhas", "com batata doce", "com couve refogada", "com molho de tomate natural"],
    ingredients: ["carne bovina magra", "cebola", "alho", "tomate", "abobrinha", "ervas frescas", "azeite medido"],
    steps: ["Doure a carne em panela antiaderente.", "Adicione temperos naturais e vegetais.", "Cozinhe até ficar macio.", "Ajuste a porção e sirva com salada."],
    photos: ["photo-1555939594-58d7cb561ad1", "photo-1604908176997-125f25cc6f3d", "photo-1543352634-a1c51d9f1fa7", "photo-1546833999-b9f581a1996d"],
    cal: [360, 540],
    time: [18, 42],
    macros: { protein: 38, carbs: 20, fat: 18 },
  },
  {
    category: "Massas fit",
    goals: ["Manutenção", "Hipertrofia", "Perda de gordura", "Almoço prático"],
    description: "Massa com melhor distribuição de fibras, proteína e molho mais leve.",
    bases: ["Espaguete integral", "Penne integral", "Macarrão de arroz", "Nhoque de batata doce", "Lasanha de berinjela", "Macarrão de abobrinha", "Fusilli com frango", "Talharim integral"],
    variants: ["ao molho de tomate fresco", "com frango desfiado", "com atum e ervas", "com legumes salteados", "com carne magra"],
    ingredients: ["massa integral", "tomate", "manjericão", "proteína magra", "legumes", "azeite medido", "parmesão leve opcional"],
    steps: ["Cozinhe a massa até ficar al dente.", "Prepare o molho com tomate e ervas.", "Adicione proteína magra e vegetais.", "Finalize com porção controlada."],
    photos: ["photo-1551183053-bf91a1d81141", "photo-1621996346565-e3dbc353d2e5", "photo-1525755662778-989d0524087e", "photo-1473093295043-cdd812d0e601"],
    cal: [330, 520],
    time: [15, 35],
    macros: { protein: 28, carbs: 56, fat: 10 },
  },
  {
    category: "Bolos fit",
    goals: ["Sobremesa fit", "Lanche", "Manutenção", "Doce controlado"],
    description: "Bolo com ingredientes simples, menos açúcar e boa saciedade.",
    bases: ["Bolo de banana", "Bolo de cenoura fit", "Bolo de cacau", "Bolo de laranja integral", "Bolo de maçã", "Bolo de coco proteico", "Muffin de aveia", "Brownie de batata doce"],
    variants: ["com aveia", "com whey", "sem farinha branca", "com canela", "com castanhas"],
    ingredients: ["ovos", "aveia", "banana madura", "cacau ou fruta", "fermento", "canela", "iogurte natural"],
    steps: ["Misture os ingredientes úmidos.", "Incorpore aveia, fruta e fermento.", "Leve ao forno pré-aquecido.", "Espere amornar antes de cortar."],
    photos: ["photo-1578985545062-69928b1d9587", "photo-1606313564200-e75d5e30476c", "photo-1607958996333-41aef7caefaa", "photo-1528207776546-365bb710ee93"],
    cal: [150, 320],
    time: [20, 45],
    macros: { protein: 10, carbs: 34, fat: 8 },
    premiumFrom: 8,
  },
  {
    category: "Sobremesas",
    goals: ["Doce controlado", "Manutenção", "Perda de gordura", "Sobremesa fit"],
    description: "Sobremesa com porção inteligente para matar vontade de doce sem exagero.",
    bases: ["Mousse de cacau", "Cheesecake proteico", "Pudim de chia", "Sorvete de banana", "Creme de manga", "Brigadeiro fit", "Taça de iogurte", "Pavê proteico"],
    variants: ["com frutas vermelhas", "com coco", "com pasta de amendoim", "com granola sem açúcar", "com chocolate 70%"],
    ingredients: ["iogurte natural", "fruta", "chia", "cacau", "adoçante opcional", "whey opcional", "castanhas"],
    steps: ["Misture a base cremosa.", "Adoce aos poucos se necessário.", "Monte em porções individuais.", "Leve para gelar antes de servir."],
    photos: ["photo-1533134242443-d4fd215305ad", "photo-1488477304112-4944851de03d", "photo-1488477181946-6428a0291777", "photo-1563805042-7684c019e1cb"],
    cal: [140, 290],
    time: [8, 30],
    macros: { protein: 12, carbs: 28, fat: 7 },
    premiumFrom: 5,
  },
  {
    category: "Sucos detox",
    goals: ["Fumantes", "Antioxidante", "Hidratação", "Perda de gordura"],
    description: "Suco com frutas, folhas e boa hidratação para rotina mais leve.",
    bases: ["Suco verde", "Abacaxi com hortelã", "Melancia com gengibre", "Beterraba com laranja", "Limão com couve", "Maçã verde com pepino", "Cenoura com acerola", "Maracujá com gengibre"],
    variants: ["sem açúcar", "com chia", "com hortelã", "com limão", "com água de coco"],
    ingredients: ["fruta fresca", "folhas verdes", "água gelada", "limão", "gengibre opcional", "chia opcional", "gelo"],
    steps: ["Higienize frutas e folhas.", "Bata tudo com água gelada.", "Coe somente se preferir textura mais leve.", "Sirva sem adicionar açúcar."],
    photos: ["photo-1622597467836-f3285f2131b8", "photo-1613478223719-2ab802602423", "photo-1553530666-ba11a7da3888", "photo-1600271886742-f049cd451bba"],
    cal: [70, 180],
    time: [5, 10],
    macros: { protein: 2, carbs: 28, fat: 1 },
  },
  {
    category: "Sucos naturais",
    goals: ["Hidratação", "Vitaminas", "Fumantes", "Antioxidante"],
    description: "Bebida natural sem açúcar adicionado para acompanhar refeições ou lanches.",
    bases: ["Laranja com acerola", "Manga com maracujá", "Morango com limão", "Uva integral diluída", "Goiaba natural", "Caju com limão", "Melão com hortelã", "Abacaxi com laranja"],
    variants: ["sem açúcar", "com gelo", "com hortelã", "com água de coco", "com chia"],
    ingredients: ["fruta fresca", "água gelada", "gelo", "hortelã opcional", "chia opcional", "limão opcional"],
    steps: ["Bata a fruta com água gelada.", "Ajuste a diluição conforme preferência.", "Evite açúcar adicionado.", "Sirva imediatamente."],
    photos: ["photo-1600271886742-f049cd451bba", "photo-1553530666-ba11a7da3888", "photo-1613478223719-2ab802602423", "photo-1622597467836-f3285f2131b8"],
    cal: [80, 210],
    time: [5, 9],
    macros: { protein: 2, carbs: 32, fat: 1 },
  },
  {
    category: "Hipertensão",
    goals: ["Hipertensão", "Baixo sódio", "DASH", "Coração"],
    description: "Preparação com foco em temperos naturais, vegetais e menor uso de sal.",
    bases: ["Frango com ervas", "Salmão ao limão", "Grão-de-bico colorido", "Omelete de claras", "Tilápia assada", "Arroz integral com legumes", "Lentilha com abóbora", "Salada mediterrânea"],
    variants: ["sem sal adicionado", "com ervas frescas", "com legumes cozidos", "com azeite medido", "com folhas verdes"],
    ingredients: ["proteína magra", "legumes", "folhas verdes", "alho", "cebola", "limão", "ervas naturais"],
    steps: ["Use ervas, alho, cebola e limão para dar sabor.", "Evite temperos prontos e excesso de sal.", "Cozinhe ou asse com pouco óleo.", "Sirva com vegetais e grãos integrais."],
    photos: ["photo-1512621776951-a57141f2eefd", "photo-1546069901-ba9599a7e63c", "photo-1467003909585-2f8a72700288", "photo-1498837167922-ddd27525d352"],
    cal: [260, 460],
    time: [15, 35],
    macros: { protein: 30, carbs: 34, fat: 9 },
  },
  {
    category: "Fumantes",
    goals: ["Fumantes", "Antioxidante", "Hidratação", "Vitaminas"],
    description: "Receita rica em frutas, verduras e hidratação para apoiar uma rotina mais saudável.",
    bases: ["Bowl de frutas cítricas", "Salada de folhas escuras", "Smoothie de frutas vermelhas", "Iogurte com kiwi", "Wrap de vegetais", "Creme de abóbora", "Salada de cenoura", "Vitamina de mamão"],
    variants: ["com vitamina C", "com sementes", "com aveia", "com gengibre", "com hortelã"],
    ingredients: ["frutas frescas", "folhas verdes", "sementes", "iogurte natural", "aveia", "limão", "água"],
    steps: ["Priorize ingredientes frescos.", "Combine fruta, fibra e proteína leve.", "Evite açúcar adicionado.", "Sirva no mesmo dia para melhor sabor."],
    photos: ["photo-1488477181946-6428a0291777", "photo-1546069901-ba9599a7e63c", "photo-1490645935967-10de6ba17061", "photo-1553530666-ba11a7da3888"],
    cal: [180, 380],
    time: [5, 18],
    macros: { protein: 12, carbs: 44, fat: 6 },
  },
  {
    category: "Gorduras boas",
    goals: ["Gorduras boas", "Low carb", "Saciedade", "Manutenção"],
    description: "Receita com fontes de gordura boa em porção equilibrada.",
    bases: ["Salada de abacate", "Salmão com castanhas", "Ovos com avocado", "Pasta de grão-de-bico", "Mix de nuts porcionado", "Torrada integral com abacate", "Atum com azeite", "Bowl mediterrâneo"],
    variants: ["com limão", "com sementes", "com folhas verdes", "com iogurte natural", "com ervas"],
    ingredients: ["abacate", "azeite medido", "castanhas", "proteína magra", "folhas verdes", "limão", "sementes"],
    steps: ["Separe uma porção moderada da fonte de gordura.", "Combine com proteína e folhas.", "Tempere com limão e ervas.", "Sirva sem molhos industrializados."],
    photos: ["photo-1511690656952-34342bb7c2f2", "photo-1490645935967-10de6ba17061", "photo-1467003909585-2f8a72700288", "photo-1546069901-ba9599a7e63c"],
    cal: [260, 520],
    time: [8, 22],
    macros: { protein: 24, carbs: 20, fat: 24 },
  },
  {
    category: "Refeições",
    goals: ["Emagrecimento", "Manutenção", "Almoço prático", "Jantar leve"],
    description: "Prato completo com proteína, carboidrato de qualidade e vegetais.",
    bases: ["Bowl de frango", "Tilápia com arroz", "Marmita colorida", "Omelete completa", "Frango xadrez leve", "Carne moída com legumes", "Quinoa com frango", "Arroz e feijão equilibrado"],
    variants: ["com salada", "com legumes", "com quinoa", "com batata doce", "com feijão"],
    ingredients: ["proteína magra", "arroz integral ou quinoa", "legumes", "folhas", "azeite medido", "temperos naturais"],
    steps: ["Prepare a proteína com pouco óleo.", "Cozinhe o carboidrato em porção moderada.", "Adicione legumes e folhas.", "Monte o prato com metade de vegetais."],
    photos: ["photo-1546069901-ba9599a7e63c", "photo-1543352634-a1c51d9f1fa7", "photo-1512621776951-a57141f2eefd", "photo-1604908176997-125f25cc6f3d"],
    cal: [330, 560],
    time: [15, 40],
    macros: { protein: 34, carbs: 42, fat: 11 },
  },
  {
    category: "Lanches",
    goals: ["Lanche", "Prático", "Saciedade", "Perda de gordura"],
    description: "Lanche simples para rotina corrida, com proteína e fibras.",
    bases: ["Wrap integral", "Crepioca", "Tapioca proteica", "Sanduíche natural", "Iogurte com frutas", "Panqueca de banana", "Ovos mexidos", "Snack de grão-de-bico"],
    variants: ["com frango", "com cottage", "com atum", "com pasta de amendoim", "com frutas"],
    ingredients: ["base integral", "proteína magra", "frutas ou folhas", "iogurte natural", "sementes", "temperos naturais"],
    steps: ["Monte uma base leve.", "Adicione proteína para aumentar saciedade.", "Inclua fruta ou folhas.", "Evite molhos prontos e excesso de açúcar."],
    photos: ["photo-1626700051175-6818013e1d4f", "photo-1490645935967-10de6ba17061", "photo-1567620905732-2d1ec7ab7445", "photo-1488477181946-6428a0291777"],
    cal: [190, 380],
    time: [5, 18],
    macros: { protein: 20, carbs: 32, fat: 8 },
  },
];

function interpolate(index: number, [min, max]: [number, number]) {
  const span = max - min;
  return min + ((index * 37) % Math.max(1, span));
}

function unique(items: string[]) {
  return Array.from(new Set(items)).filter(Boolean);
}

export function buildRecipeCatalog<T extends RecipeLike>(baseRecipes: T[]): T[] {
  const recipes: RecipeLike[] = [];
  const seen = new Set<string>();

  const finalize = () =>
    recipes.slice(0, 200).map((recipe, recipeIndex) => ({
      ...recipe,
      premium: recipeIndex >= FREE_RECIPE_LIMIT,
    })) as T[];

  const add = (recipe: RecipeLike) => {
    const key = recipe.title.toLowerCase();
    if (seen.has(key) || recipes.length >= 200) return;
    seen.add(key);
    recipes.push(recipe);
  };

  baseRecipes.forEach(add);

  let index = 0;
  const cursors = new Map<string, number>();

  while (recipes.length < 200) {
    let addedInRound = false;

    for (const group of GROUPS) {
      const cursor = cursors.get(group.category) ?? 0;
      const maxCombinations = group.bases.length * group.variants.length;

      if (cursor >= maxCombinations) continue;

      const base = group.bases[cursor % group.bases.length];
      const variant = group.variants[Math.floor(cursor / group.bases.length) % group.variants.length];
      const cal = interpolate(index, group.cal);
      const time = interpolate(index + 3, group.time);
      const variantWords = variant.replace("com ", "").replace("sem ", "");

      add({
        title: `${base} ${variant}`,
        description: `${group.description} Versão ${variantWords} para variar o cardápio sem sair da proposta fit.`,
        category: group.category,
        cal,
        time,
        diff: time > 28 ? "Médio" : "Fácil",
        goal: unique([...group.goals, group.category, variantWords]),
        premium: recipes.length >= FREE_RECIPE_LIMIT,
        image: img(group.photos[(cursor + index) % group.photos.length]),
        ingredients: unique([...group.ingredients, variantWords]).slice(0, 8),
        steps: group.steps,
        macros: {
          protein: Math.max(2, group.macros.protein + ((index % 5) - 2) * 2),
          carbs: Math.max(1, group.macros.carbs + ((index % 7) - 3) * 3),
          fat: Math.max(1, group.macros.fat + ((index % 4) - 1) * 2),
        },
      });

      cursors.set(group.category, cursor + 1);
      index += 1;
      addedInRound = true;

      if (recipes.length >= 200) return finalize();
    }

    if (!addedInRound) break;
  }

  return finalize();
}
