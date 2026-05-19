"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Clock, Flame, Crown, Lock, Download, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const RECIPES = [
  {
    title: "Bowl de frango grelhado com quinoa",
    cal: 420, time: 20, diff: "Fácil",
    goal: ["emagrecimento","manutencao"], emoji: "🥗", premium: false,
    ingredients: ["150g frango grelhado", "80g quinoa cozida", "Folhas verdes", "Tomate cereja", "Azeite de oliva", "Limão", "Sal e pimenta"],
    steps: ["Cozinhe a quinoa em água com sal por 15 min.", "Tempere o frango com limão, sal e pimenta e grelhe.", "Monte o bowl com as folhas, quinoa, frango e tomate.", "Finalize com azeite e suco de limão."],
    macros: { protein: 42, carbs: 38, fat: 12 },
  },
  {
    title: "Omelete de espinafre e cottage",
    cal: 280, time: 10, diff: "Fácil",
    goal: ["emagrecimento","low_carb"], emoji: "🍳", premium: false,
    ingredients: ["3 ovos", "50g espinafre", "3 colheres cottage", "Sal e pimenta", "Azeite"],
    steps: ["Bata os ovos com sal e pimenta.", "Refogue o espinafre no azeite por 2 min.", "Adicione os ovos e o cottage.", "Dobre o omelete e sirva quente."],
    macros: { protein: 28, carbs: 4, fat: 16 },
  },
  {
    title: "Batata doce assada com atum",
    cal: 350, time: 30, diff: "Fácil",
    goal: ["emagrecimento","hipertrofia"], emoji: "🍠", premium: false,
    ingredients: ["200g batata doce", "1 lata atum em água", "Azeite", "Alecrim", "Sal"],
    steps: ["Pré-aqueça o forno a 200°C.", "Corte a batata em rodelas, tempere com azeite e alecrim.", "Asse por 25 minutos até dourar.", "Sirva com o atum escorrido por cima."],
    macros: { protein: 32, carbs: 42, fat: 6 },
  },
  {
    title: "Panqueca de aveia com banana",
    cal: 310, time: 15, diff: "Fácil",
    goal: ["manutencao"], emoji: "🥞", premium: false,
    ingredients: ["2 bananas maduras", "2 ovos", "4 colheres aveia", "Canela", "Mel"],
    steps: ["Amasse as bananas e misture com os ovos.", "Adicione a aveia e a canela.", "Frite colheradas na frigideira antiaderente.", "Sirva com mel a gosto."],
    macros: { protein: 14, carbs: 52, fat: 8 },
  },
  {
    title: "Marmita de frango com legumes no vapor",
    cal: 480, time: 35, diff: "Médio",
    goal: ["hipertrofia"], emoji: "🍱", premium: true,
    ingredients: ["200g frango", "Brócolis", "Cenoura", "Vagem", "Arroz integral", "Temperos naturais"],
    steps: ["Cozinhe o arroz integral.", "Marine o frango com ervas e grelhe.", "Cozinhe os legumes no vapor por 8 min.", "Monte a marmita e refrigere."],
    macros: { protein: 48, carbs: 45, fat: 10 },
  },
  {
    title: "Salada César fit com grão-de-bico",
    cal: 390, time: 15, diff: "Fácil",
    goal: ["emagrecimento"], emoji: "🥙", premium: true,
    ingredients: ["Alface romana", "100g grão-de-bico cozido", "30g parmesão", "Croutons integrais", "Molho César light"],
    steps: ["Lave e rasgue a alface.", "Misture o grão-de-bico cozido.", "Adicione o parmesão ralado.", "Finalize com molho e croutons."],
    macros: { protein: 22, carbs: 44, fat: 14 },
  },
  {
    title: "Carne moída com abobrinha refogada",
    cal: 440, time: 25, diff: "Médio",
    goal: ["low_carb","definicao"], emoji: "🥩", premium: true,
    ingredients: ["200g carne moída", "2 abobrinhas", "Alho", "Tomate", "Azeite", "Temperos"],
    steps: ["Refogue o alho no azeite.", "Doure a carne moída e tempere.", "Adicione a abobrinha em cubos.", "Cozinhe tampado por 10 min."],
    macros: { protein: 38, carbs: 12, fat: 28 },
  },
  {
    title: "Smoothie proteico de morango",
    cal: 240, time: 5, diff: "Fácil",
    goal: ["hipertrofia"], emoji: "🍓", premium: true,
    ingredients: ["200ml leite desnatado", "100g morango", "1 scoop whey", "1 banana", "Mel"],
    steps: ["Coloque todos os ingredientes no liquidificador.", "Bata por 1 minuto até ficar cremoso.", "Sirva imediatamente gelado."],
    macros: { protein: 30, carbs: 32, fat: 3 },
  },
];

const GOAL_LABELS: Record<string, string> = {
  emagrecimento: "🔥 Emagrecimento",
  hipertrofia:   "💪 Hipertrofia",
  manutencao:    "⚖️ Manutenção",
  low_carb:      "🥑 Low Carb",
  definicao:     "⚡ Definição",
};

export default function RecipesPage() {
  const [plan, setPlan] = useState("free");
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<typeof RECIPES[0] | null>(null);

  useEffect(() => {
    fetch("/api/user/me").then(r => r.json()).then(d => setPlan(d.user?.plan ?? "free"));
  }, []);

  const canAccess = (r: typeof RECIPES[0]) => {
    if (!r.premium) return true;
    return plan === "premium" || plan === "start";
  };

  const filtered = RECIPES.filter(r => {
    if (filter === "Todas") return true;
    if (filter === "Fácil") return r.diff === "Fácil";
    if (filter === "Médio") return r.diff === "Médio";
    if (filter === "Premium") return r.premium;
    return true;
  });

  const downloadPDF = (recipe: typeof RECIPES[0]) => {
    const content = `
LEVEFY — ${recipe.title}
${"=".repeat(50)}

📊 Informações nutricionais
Calorias: ${recipe.cal} kcal | Tempo: ${recipe.time} min | Dificuldade: ${recipe.diff}
Proteínas: ${recipe.macros.protein}g | Carboidratos: ${recipe.macros.carbs}g | Gorduras: ${recipe.macros.fat}g

🛒 Ingredientes
${recipe.ingredients.map(i => `• ${i}`).join("\n")}

👩‍🍳 Modo de preparo
${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

${"=".repeat(50)}
Gerado pelo Levefy — levefy-mu.vercel.app
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Receitas">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-slate-500 text-sm">{filtered.length} receitas disponíveis</p>
        <div className="flex gap-2 flex-wrap text-xs">
          {["Todas","Fácil","Médio","Premium"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full border font-medium transition ${
                filter === f ? "border-brand-500 text-brand-700 bg-brand-50" : "border-slate-200 text-slate-600 hover:border-brand-400"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(r => (
          <div key={r.title} className="card p-5 flex flex-col hover:shadow-md transition cursor-pointer"
            onClick={() => canAccess(r) && setSelected(r)}>
            <div className="text-4xl mb-3">{r.emoji}</div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm leading-snug flex-1">{r.title}</h3>
              {r.premium && <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{r.cal} kcal</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time} min</span>
              <span>{r.diff}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-auto mb-3">
              {r.goal.map(g => (
                <span key={g} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">
                  {GOAL_LABELS[g]}
                </span>
              ))}
            </div>
            {canAccess(r) ? (
              <button className="flex items-center gap-1 text-xs text-brand-600 font-semibold mt-auto">
                Ver receita <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-auto">
                <Lock className="w-3 h-3" /> Requer START ou PREMIUM
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      {plan === "free" && (
        <div className="mt-8 card p-6 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold">🔓 Desbloqueie todas as receitas</p>
            <p className="text-sm text-white/80 mt-0.5">Acesse receitas exclusivas com o plano START ou PREMIUM</p>
          </div>
          <Link href="/membership" className="bg-white text-brand-700 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-brand-50 transition shrink-0">
            Ver planos
          </Link>
        </div>
      )}

      {/* Recipe Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-3xl">{selected.emoji}</span>
                <h2 className="font-bold text-lg mt-1">{selected.title}</h2>
                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                  <span>🔥 {selected.cal} kcal</span>
                  <span>⏱ {selected.time} min</span>
                  <span>{selected.diff}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Proteína", value: `${selected.macros.protein}g`, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Carboidrato", value: `${selected.macros.carbs}g`, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Gordura", value: `${selected.macros.fat}g`, color: "text-rose-600", bg: "bg-rose-50" },
              ].map(m => (
                <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
                  <p className={`font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            <h3 className="font-semibold mb-2">🛒 Ingredientes</h3>
            <ul className="space-y-1 mb-4">
              {selected.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>

            {/* Steps */}
            <h3 className="font-semibold mb-2">👩‍🍳 Modo de preparo</h3>
            <ol className="space-y-2 mb-6">
              {selected.steps.map((step, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-3">
                  <span className="w-5 h-5 gradient-brand text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <button onClick={() => downloadPDF(selected)}
              className="btn-primary w-full gap-2">
              <Download className="w-4 h-4" /> Baixar receita
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
