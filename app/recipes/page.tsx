"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Clock, Flame, Crown, Lock, Download, X, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { buildRecipeCatalog } from "@/lib/recipe-catalog";
import { normalizePlan } from "@/lib/plan-access";

type RecipeCategory =
  | "Refeições"
  | "Lanches"
  | "Bolos fit"
  | "Sobremesas"
  | "Low carb"
  | "Churrasco fit"
  | "Carnes vermelhas"
  | "Massas fit"
  | "Sucos detox"
  | "Sucos naturais"
  | "Hipertensão"
  | "Fumantes"
  | "Gorduras boas";

type Recipe = {
  title: string;
  description: string;
  category: RecipeCategory;
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

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;

const BASE_RECIPES: Recipe[] = [
  {
    title: "Bowl de frango grelhado com quinoa",
    description: "Almoço proteico, colorido e fácil de montar.",
    category: "Refeições",
    cal: 420,
    time: 20,
    diff: "Fácil",
    goal: ["Emagrecimento", "Manutenção"],
    premium: false,
    image: img("photo-1546069901-ba9599a7e63c"),
    ingredients: ["150g frango grelhado", "80g quinoa cozida", "Folhas verdes", "Tomate cereja", "1 fio de azeite", "Limão, sal e pimenta"],
    steps: ["Cozinhe a quinoa por 15 minutos.", "Tempere e grelhe o frango.", "Monte o bowl com folhas, quinoa e frango.", "Finalize com azeite, limão e tomates."],
    macros: { protein: 42, carbs: 38, fat: 12 },
  },
  {
    title: "Omelete de espinafre e cottage",
    description: "Café da manhã rápido com boa saciedade.",
    category: "Low carb",
    cal: 280,
    time: 10,
    diff: "Fácil",
    goal: ["Low carb", "Emagrecimento"],
    premium: false,
    image: img("photo-1525351484163-7529414344d8"),
    ingredients: ["3 ovos", "50g espinafre", "3 colheres de cottage", "1 fio de azeite", "Sal e pimenta"],
    steps: ["Bata os ovos com sal e pimenta.", "Refogue o espinafre rapidamente.", "Adicione os ovos e o cottage.", "Dobre o omelete e sirva quente."],
    macros: { protein: 28, carbs: 4, fat: 16 },
  },
  {
    title: "Batata doce assada com atum",
    description: "Lanche reforçado para rotina corrida.",
    category: "Lanches",
    cal: 350,
    time: 30,
    diff: "Fácil",
    goal: ["Emagrecimento", "Hipertrofia"],
    premium: false,
    image: img("photo-1511690656952-34342bb7c2f2"),
    ingredients: ["200g batata doce", "1 lata de atum em água", "1 colher de azeite", "Alecrim", "Sal"],
    steps: ["Corte a batata doce em cubos.", "Tempere com azeite, sal e alecrim.", "Asse por 25 minutos.", "Sirva com atum escorrido por cima."],
    macros: { protein: 32, carbs: 42, fat: 6 },
  },
  {
    title: "Panqueca de aveia com banana",
    description: "Doce simples, sem exagero e pronto em minutos.",
    category: "Sobremesas",
    cal: 310,
    time: 15,
    diff: "Fácil",
    goal: ["Manutenção"],
    premium: false,
    image: img("photo-1567620905732-2d1ec7ab7445"),
    ingredients: ["2 bananas maduras", "2 ovos", "4 colheres de aveia", "Canela", "Mel opcional"],
    steps: ["Amasse as bananas.", "Misture ovos, aveia e canela.", "Doure pequenas porções na frigideira.", "Sirva com um fio de mel se desejar."],
    macros: { protein: 14, carbs: 52, fat: 8 },
  },
  {
    title: "Tapioca com cottage e tomate",
    description: "Opção leve para café ou lanche.",
    category: "Lanches",
    cal: 290,
    time: 10,
    diff: "Fácil",
    goal: ["Emagrecimento", "Manutenção"],
    premium: false,
    image: img("photo-1490645935967-10de6ba17061"),
    ingredients: ["60g goma de tapioca", "80g cottage", "Tomate picado", "Orégano", "Sal"],
    steps: ["Aqueça a goma na frigideira.", "Vire quando firmar.", "Recheie com cottage e tomate.", "Finalize com orégano."],
    macros: { protein: 18, carbs: 42, fat: 5 },
  },
  {
    title: "Arroz integral, feijão e frango",
    description: "Clássico brasileiro equilibrado.",
    category: "Refeições",
    cal: 520,
    time: 30,
    diff: "Fácil",
    goal: ["Manutenção", "Hipertrofia"],
    premium: false,
    image: img("photo-1604908176997-125f25cc6f3d"),
    ingredients: ["100g arroz integral", "100g feijão", "120g frango grelhado", "Salada verde", "Temperos naturais"],
    steps: ["Cozinhe arroz e feijão.", "Grelhe o frango.", "Monte o prato com salada.", "Ajuste sal e temperos."],
    macros: { protein: 42, carbs: 58, fat: 8 },
  },
  {
    title: "Wrap integral de frango",
    description: "Prático para levar e comer bem fora de casa.",
    category: "Lanches",
    cal: 360,
    time: 15,
    diff: "Fácil",
    goal: ["Emagrecimento", "Definição"],
    premium: false,
    image: img("photo-1626700051175-6818013e1d4f"),
    ingredients: ["1 wrap integral", "120g frango desfiado", "Alface", "Tomate", "Iogurte natural", "Mostarda"],
    steps: ["Misture iogurte e mostarda.", "Recheie o wrap com frango e vegetais.", "Enrole firme.", "Doure rapidamente na frigideira."],
    macros: { protein: 32, carbs: 36, fat: 9 },
  },
  {
    title: "Iogurte grego com frutas e granola",
    description: "Lanche fresco para segurar a fome.",
    category: "Lanches",
    cal: 260,
    time: 5,
    diff: "Fácil",
    goal: ["Manutenção"],
    premium: false,
    image: img("photo-1488477181946-6428a0291777"),
    ingredients: ["170g iogurte grego", "Morangos", "Banana", "25g granola sem açúcar", "Canela"],
    steps: ["Coloque o iogurte em uma tigela.", "Adicione frutas picadas.", "Finalize com granola e canela.", "Sirva gelado."],
    macros: { protein: 18, carbs: 34, fat: 6 },
  },
  {
    title: "Marmita de frango com legumes no vapor",
    description: "Base semanal para quem quer constância.",
    category: "Refeições",
    cal: 480,
    time: 35,
    diff: "Médio",
    goal: ["Hipertrofia", "Manutenção"],
    premium: true,
    image: img("photo-1543352634-a1c51d9f1fa7"),
    ingredients: ["200g peito de frango", "Brócolis", "Cenoura", "Vagem", "80g arroz integral", "Temperos naturais"],
    steps: ["Cozinhe o arroz integral.", "Marine e grelhe o frango.", "Cozinhe os legumes no vapor.", "Monte a marmita e refrigere."],
    macros: { protein: 48, carbs: 45, fat: 10 },
  },
  {
    title: "Salada César fit com grão-de-bico",
    description: "Crocante, leve e rica em proteína.",
    category: "Refeições",
    cal: 390,
    time: 15,
    diff: "Fácil",
    goal: ["Emagrecimento"],
    premium: true,
    image: img("photo-1512621776951-a57141f2eefd"),
    ingredients: ["Alface romana", "100g grão-de-bico", "Frango grelhado", "Parmesão ralado", "Molho leve de iogurte"],
    steps: ["Lave e rasgue a alface.", "Misture grão-de-bico e frango.", "Adicione parmesão.", "Finalize com molho leve."],
    macros: { protein: 34, carbs: 34, fat: 12 },
  },
  {
    title: "Carne moída com abobrinha",
    description: "Jantar low carb de alto sabor.",
    category: "Low carb",
    cal: 440,
    time: 25,
    diff: "Médio",
    goal: ["Low carb", "Definição"],
    premium: true,
    image: img("photo-1555939594-58d7cb561ad1"),
    ingredients: ["200g patinho moído", "2 abobrinhas", "Alho", "Tomate picado", "Azeite", "Temperos"],
    steps: ["Refogue o alho no azeite.", "Doure a carne e tempere.", "Adicione abobrinha e tomate.", "Cozinhe tampado por 10 minutos."],
    macros: { protein: 38, carbs: 12, fat: 28 },
  },
  {
    title: "Smoothie proteico de morango",
    description: "Cremoso para pós-treino ou lanche.",
    category: "Lanches",
    cal: 240,
    time: 5,
    diff: "Fácil",
    goal: ["Hipertrofia"],
    premium: true,
    image: img("photo-1553530666-ba11a7da3888"),
    ingredients: ["200ml leite desnatado", "100g morango", "1 scoop whey", "1 banana pequena", "Gelo"],
    steps: ["Coloque tudo no liquidificador.", "Bata por 1 minuto.", "Ajuste gelo ou água se necessário.", "Sirva imediatamente."],
    macros: { protein: 30, carbs: 32, fat: 3 },
  },
  {
    title: "Bolo fit de banana com aveia",
    description: "Bolo sem farinha branca para matar vontade de doce.",
    category: "Bolos fit",
    cal: 180,
    time: 35,
    diff: "Fácil",
    goal: ["Manutenção", "Emagrecimento"],
    premium: true,
    image: img("photo-1578985545062-69928b1d9587"),
    ingredients: ["3 bananas maduras", "2 ovos", "1 xícara de aveia", "Canela", "1 colher de fermento", "Castanhas opcionais"],
    steps: ["Amasse as bananas.", "Misture ovos, aveia e canela.", "Adicione fermento.", "Asse por 30 minutos a 180°C."],
    macros: { protein: 7, carbs: 28, fat: 5 },
  },
  {
    title: "Brownie fit de cacau",
    description: "Sobremesa intensa com poucos ingredientes.",
    category: "Sobremesas",
    cal: 210,
    time: 30,
    diff: "Fácil",
    goal: ["Manutenção"],
    premium: true,
    image: img("photo-1606313564200-e75d5e30476c"),
    ingredients: ["2 ovos", "2 bananas", "3 colheres de cacau", "4 colheres de aveia", "Chocolate 70% picado"],
    steps: ["Bata ovos e banana.", "Misture cacau e aveia.", "Adicione chocolate 70%.", "Asse por 22 minutos."],
    macros: { protein: 8, carbs: 29, fat: 8 },
  },
  {
    title: "Cheesecake proteico de frutas vermelhas",
    description: "Doce gelado com proteína e visual premium.",
    category: "Sobremesas",
    cal: 230,
    time: 20,
    diff: "Médio",
    goal: ["Manutenção", "Hipertrofia"],
    premium: true,
    image: img("photo-1533134242443-d4fd215305ad"),
    ingredients: ["Iogurte grego", "Cream cheese light", "Whey baunilha", "Frutas vermelhas", "Base de aveia"],
    steps: ["Misture iogurte, cream cheese e whey.", "Monte sobre a base de aveia.", "Cubra com frutas vermelhas.", "Geladeira por 2 horas."],
    macros: { protein: 22, carbs: 24, fat: 7 },
  },
  {
    title: "Mousse de chocolate com abacate",
    description: "Textura cremosa sem creme de leite.",
    category: "Sobremesas",
    cal: 250,
    time: 10,
    diff: "Fácil",
    goal: ["Low carb"],
    premium: true,
    image: img("photo-1488477304112-4944851de03d"),
    ingredients: ["1 abacate pequeno", "2 colheres de cacau", "Adoçante ou mel", "Baunilha", "Chocolate 70% ralado"],
    steps: ["Bata abacate, cacau e baunilha.", "Adoce aos poucos.", "Leve para gelar.", "Finalize com chocolate ralado."],
    macros: { protein: 5, carbs: 18, fat: 19 },
  },
  {
    title: "Muffin integral de maçã",
    description: "Porção individual para lanche doce controlado.",
    category: "Bolos fit",
    cal: 170,
    time: 28,
    diff: "Fácil",
    goal: ["Manutenção"],
    premium: true,
    image: img("photo-1607958996333-41aef7caefaa"),
    ingredients: ["Maçã picada", "Aveia", "Ovo", "Canela", "Fermento", "Iogurte natural"],
    steps: ["Misture os ingredientes úmidos.", "Adicione aveia, maçã e canela.", "Coloque em forminhas.", "Asse por 22 minutos."],
    macros: { protein: 6, carbs: 27, fat: 5 },
  },
  {
    title: "Pudim de chia com manga",
    description: "Sobremesa fria rica em fibras.",
    category: "Sobremesas",
    cal: 190,
    time: 8,
    diff: "Fácil",
    goal: ["Emagrecimento"],
    premium: true,
    image: img("photo-1488477181946-6428a0291777"),
    ingredients: ["200ml leite vegetal", "2 colheres de chia", "Manga em cubos", "Canela", "Iogurte opcional"],
    steps: ["Misture leite e chia.", "Descanse por 4 horas na geladeira.", "Adicione manga.", "Finalize com canela."],
    macros: { protein: 7, carbs: 26, fat: 7 },
  },
  {
    title: "Panqueca proteica de chocolate",
    description: "Doce pós-treino com boa proteína.",
    category: "Bolos fit",
    cal: 320,
    time: 15,
    diff: "Fácil",
    goal: ["Hipertrofia"],
    premium: true,
    image: img("photo-1528207776546-365bb710ee93"),
    ingredients: ["1 ovo", "1 banana", "1 scoop whey chocolate", "2 colheres de aveia", "Cacau", "Morangos"],
    steps: ["Misture todos os ingredientes.", "Doure em fogo baixo.", "Vire com cuidado.", "Sirva com morangos."],
    macros: { protein: 31, carbs: 38, fat: 6 },
  },
];

const RECIPES = buildRecipeCatalog(BASE_RECIPES);

function recipePrintHtml(recipe: Recipe) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${recipe.title} - Levefy</title><style>*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#172033;padding:32px;max-width:720px;margin:0 auto}.brand{color:#16a34a;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase}h1{font-size:30px;line-height:1.15;margin:10px 0}.desc{color:#64748b}.meta{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.pill{border:1px solid #e2e8f0;border-radius:999px;padding:8px 12px;font-size:13px}.macros{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}.macro{background:#f8fafc;border-radius:16px;padding:16px;text-align:center}.macro strong{display:block;font-size:22px;color:#16a34a}h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#16a34a;margin-top:28px}li{margin:9px 0;color:#334155}.footer{margin-top:32px;border-top:1px solid #e2e8f0;padding-top:16px;color:#94a3b8;font-size:12px;text-align:center}@media print{body{padding:12px}}</style></head><body><p class="brand">Levefy - Receita saudável</p><h1>${recipe.title}</h1><p class="desc">${recipe.description}</p><div class="meta"><span class="pill">${recipe.cal} kcal</span><span class="pill">${recipe.time} min</span><span class="pill">${recipe.diff}</span><span class="pill">${recipe.category}</span></div><div class="macros"><div class="macro"><strong>${recipe.macros.protein}g</strong>Proteína</div><div class="macro"><strong>${recipe.macros.carbs}g</strong>Carboidrato</div><div class="macro"><strong>${recipe.macros.fat}g</strong>Gordura</div></div><h2>Ingredientes</h2><ul>${recipe.ingredients.map(item => `<li>${item}</li>`).join("")}</ul><h2>Modo de preparo</h2><ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol><div class="footer">Gerado pelo Levefy - levefy-mu.vercel.app - ${new Date().toLocaleDateString("pt-BR")}</div></body></html>`;
}

const CATEGORIES = [
  "Todas",
  "Refeições",
  "Lanches",
  "Bolos fit",
  "Sobremesas",
  "Low carb",
  "Churrasco fit",
  "Carnes vermelhas",
  "Massas fit",
  "Sucos detox",
  "Sucos naturais",
  "Gorduras boas",
  "Hipertensão",
  "Fumantes",
  "Premium",
] as const;

export default function RecipesPage() {
  const [plan, setPlan] = useState("free");
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Recipe | null>(null);
  const activePlan = normalizePlan(plan);

  useEffect(() => {
    fetch("/api/user/me").then(r => r.json()).then(d => setPlan(d.user?.plan ?? "free"));
  }, []);

  const canAccess = (recipe: Recipe) => !recipe.premium || activePlan !== "free";
  const openRecipe = (recipe: Recipe) => {
    if (canAccess(recipe)) setSelected(recipe);
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return RECIPES.filter(recipe => {
      const matchCategory = filter === "Todas"
        ? true
        : filter === "Premium"
          ? recipe.premium
          : recipe.category === filter || recipe.goal.includes(filter);
      const matchQuery = !normalizedQuery || [
        recipe.title,
        recipe.description,
        recipe.category,
        ...recipe.goal,
        ...recipe.ingredients,
        ...recipe.steps,
      ].join(" ").toLowerCase().includes(normalizedQuery);

      return matchCategory && matchQuery;
    });
  }, [filter, query]);

  const printRecipe = (recipe: Recipe) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    document.body.appendChild(iframe);

    const printDocument = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!printDocument) {
      iframe.remove();
      return;
    }

    printDocument.open();
    printDocument.write(recipePrintHtml(recipe));
    printDocument.close();

    let printed = false;
    const runPrint = () => {
      if (printed) return;
      printed = true;
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1000);
    };

    iframe.onload = runPrint;
    setTimeout(runPrint, 250);
  };

  const mobileView = (
    <div className="space-y-3.5">
      <section className="rounded-[1.65rem] bg-slate-950 p-4 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.8)]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">Receitas Levefy</p>
        <h1 className="mt-1 text-[1.45rem] font-extrabold leading-tight tracking-tight">Receitas prontas e organizadas</h1>
        <p className="mt-1 text-xs leading-5 text-white/65">Filtre por objetivo, veja macros e salve a receita.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-2.5">
            <p className="text-base font-extrabold">{RECIPES.filter(r => !r.premium).length}</p>
            <p className="text-[10px] text-white/55">gratis</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2.5">
            <p className="text-base font-extrabold">{RECIPES.filter(r => r.premium).length}</p>
            <p className="text-[10px] text-white/55">premium</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2.5">
            <p className="text-base font-extrabold">6</p>
            <p className="text-[10px] text-white/55">doces fit</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.45rem] bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar bolo, frango..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-base font-medium outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-extrabold ${
                filter === category ? "border-transparent gradient-brand text-white shadow-brand" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        {filtered.map(recipe => {
          const allowed = canAccess(recipe);
          return (
            <article
              key={recipe.title}
              onClick={() => openRecipe(recipe)}
              className={`rounded-[1.45rem] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 ${allowed ? "cursor-pointer" : ""}`}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">{recipe.category}</p>
                  <h2 className="mt-1 line-clamp-2 break-words text-sm font-extrabold leading-snug text-slate-950">{recipe.title}</h2>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {recipe.premium && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-extrabold text-amber-800">PRO</span>
                  )}
                  {!allowed && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Lock className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 break-words text-[11px] leading-4 text-slate-500">{recipe.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{recipe.cal} kcal</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{recipe.time} min</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{recipe.diff}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="truncate text-[10px] text-slate-400">P {recipe.macros.protein}g • C {recipe.macros.carbs}g • G {recipe.macros.fat}g</p>
                {allowed ? (
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      openRecipe(recipe);
                    }}
                    className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-extrabold text-brand-700"
                  >
                    Abrir
                  </button>
                ) : (
                  <Link
                    href="/membership"
                    onClick={event => event.stopPropagation()}
                    className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-extrabold text-slate-600"
                  >
                    Premium
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {activePlan === "free" && (
        <Link href="/membership" className="flex items-center justify-between rounded-[1.45rem] bg-slate-950 p-3.5 text-white shadow-sm">
          <div>
            <p className="text-sm font-extrabold">Desbloqueie receitas premium</p>
            <p className="text-[11px] text-white/60">Bolos fit, sobremesas e opcoes extras.</p>
          </div>
          <Crown className="h-5 w-5 text-amber-300" />
        </Link>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/70 backdrop-blur-sm">
          <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.8rem] bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">{selected.category}</p>
                <h2 className="mt-1 break-words text-xl font-extrabold text-slate-950">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 p-4">
              <p className="mt-2 text-sm leading-6 text-slate-500">{selected.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["Proteina", `${selected.macros.protein}g`],
                  ["Carbo", `${selected.macros.carbs}g`],
                  ["Gordura", `${selected.macros.fat}g`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-base font-extrabold text-slate-950">{value}</p>
                    <p className="text-[10px] font-bold text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
              <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wider text-slate-400">Ingredientes</h3>
              <ul className="mt-2 space-y-2">
                {selected.ingredients.map(item => <li key={item} className="text-sm text-slate-600">• {item}</li>)}
              </ul>
              <h3 className="mt-5 text-xs font-extrabold uppercase tracking-wider text-slate-400">Preparo</h3>
              <ol className="mt-2 space-y-2">
                {selected.steps.map((step, index) => <li key={step} className="text-sm leading-6 text-slate-700">{index + 1}. {step}</li>)}
              </ol>
              <button onClick={() => printRecipe(selected)} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full gradient-brand text-sm font-extrabold text-white">
                <Download className="h-4 w-4" /> Salvar / imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppShell title="Receitas" mobile={mobileView}>
      <div className="mb-4 rounded-[1.35rem] bg-slate-950 p-4 text-white shadow-premium sm:mb-6 sm:rounded-3xl sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">Catálogo Levefy</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-3xl">
              Receitas prontas, doces fit e opções premium.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
              São {RECIPES.length} receitas organizadas por objetivo, com macros, ingredientes e modo de preparo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center sm:gap-2">
            <div className="rounded-2xl bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3">
              <p className="text-base font-extrabold sm:text-lg">{RECIPES.filter(r => !r.premium).length}</p>
              <p className="text-[10px] text-white/55">grátis</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3">
              <p className="text-base font-extrabold sm:text-lg">{RECIPES.filter(r => r.premium).length}</p>
              <p className="text-[10px] text-white/55">premium</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-2.5 sm:px-3 sm:py-3">
              <p className="text-base font-extrabold sm:text-lg">6</p>
              <p className="text-[10px] text-white/55">doces fit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:mb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar bolo, frango, sobremesa..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 sm:py-3"
          />
        </div>
        <p className="text-sm font-medium text-slate-500">
          <span className="font-extrabold text-slate-900">{filtered.length}</span> receitas encontradas
        </p>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 text-[11px] sm:mb-6 sm:gap-2 sm:text-xs">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full border px-3.5 py-2 font-bold transition-all sm:px-4 ${
              filter === category
                ? "border-transparent gradient-brand text-white shadow-brand"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(recipe => (
          <article
            key={recipe.title}
            className={`group rounded-[1.35rem] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:p-5 ${
              canAccess(recipe) ? "cursor-pointer" : ""
            }`}
            onClick={() => openRecipe(recipe)}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                {recipe.category}
              </span>
              {recipe.premium && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold text-amber-800">
                  <Crown className="h-3 w-3" /> PRO
                </span>
              )}
            </div>

            <div className="min-w-0 pt-4">
              <h3 className="line-clamp-2 break-words text-base font-extrabold leading-snug text-slate-950">{recipe.title}</h3>
              <p className="mt-1 line-clamp-2 min-h-9 break-words text-xs leading-relaxed text-slate-500">{recipe.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-500 sm:gap-2 sm:text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                  <Flame className="h-3 w-3" /> {recipe.cal} kcal
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                  <Clock className="h-3 w-3" /> {recipe.time} min
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{recipe.diff}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  P {recipe.macros.protein}g · C {recipe.macros.carbs}g · G {recipe.macros.fat}g
                </div>
                {canAccess(recipe) ? (
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      openRecipe(recipe);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-700"
                  >
                    Abrir receita <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/membership"
                    onClick={event => event.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-500"
                  >
                    <Lock className="h-3.5 w-3.5" /> Premium
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {activePlan === "free" && (
        <div className="mt-7 flex flex-col gap-4 rounded-[1.35rem] gradient-brand p-4 text-white shadow-premium sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-6">
          <div>
            <p className="text-lg font-extrabold tracking-tight">Desbloqueie bolos fit, sobremesas e receitas premium</p>
            <p className="mt-1 text-sm text-white/85">START e PREMIUM liberam todo o catálogo completo do Levefy.</p>
          </div>
          <Link href="/membership" className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand-700 shadow-soft">
            Ver planos
          </Link>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/65 backdrop-blur-sm animate-fade-in sm:items-center">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-premium sm:max-w-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-widest text-brand-700">{selected.category}</p>
                <h2 className="mt-2 break-words text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">{selected.title}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Fechar receita"
              >
                <X className="h-4 w-4" />
              </button>
              {selected.premium && (
                <span className="hidden shrink-0 items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 sm:inline-flex">
                  <Crown className="h-3.5 w-3.5" /> Premium
                </span>
              )}
            </div>
            <div className="p-4 sm:p-7">
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{selected.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "Proteína", value: `${selected.macros.protein}g`, color: "bg-blue-50 text-blue-700" },
                  { label: "Carbo", value: `${selected.macros.carbs}g`, color: "bg-amber-50 text-amber-700" },
                  { label: "Gordura", value: `${selected.macros.fat}g`, color: "bg-rose-50 text-rose-700" },
                ].map(item => (
                  <div key={item.label} className={`rounded-2xl p-3 text-center ${item.color}`}>
                    <p className="text-base font-extrabold sm:text-lg">{item.value}</p>
                    <p className="text-[11px] font-bold opacity-70">{item.label}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-7 text-xs font-extrabold uppercase tracking-widest text-slate-400">Ingredientes</h3>
              <ul className="mt-3 space-y-2">
                {selected.ingredients.map(ingredient => (
                  <li key={ingredient} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {ingredient}
                  </li>
                ))}
              </ul>

              <h3 className="mt-7 text-xs font-extrabold uppercase tracking-widest text-slate-400">Modo de preparo</h3>
              <ol className="mt-3 space-y-3">
                {selected.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-brand text-xs font-extrabold text-white shadow-brand">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>

              <button onClick={() => printRecipe(selected)} className="btn-primary mt-7 w-full gap-2">
                <Download className="h-4 w-4" /> Salvar / Imprimir PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
