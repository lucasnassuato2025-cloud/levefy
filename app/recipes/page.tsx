import AppShell from "@/components/AppShell";
import { Clock, Flame, Crown } from "lucide-react";

const RECIPES = [
  { title: "Bowl de frango grelhado com quinoa", cal: 420, time: 20, diff: "Fácil", goal: ["emagrecimento","manutencao"], emoji: "🥗", premium: false },
  { title: "Omelete de espinafre e cottage", cal: 280, time: 10, diff: "Fácil", goal: ["emagrecimento","low_carb"], emoji: "🍳", premium: false },
  { title: "Batata doce assada com atum", cal: 350, time: 30, diff: "Fácil", goal: ["emagrecimento","hipertrofia"], emoji: "🍠", premium: false },
  { title: "Panqueca de aveia com banana", cal: 310, time: 15, diff: "Fácil", goal: ["manutencao"], emoji: "🥞", premium: false },
  { title: "Marmita de frango com legumes no vapor", cal: 480, time: 35, diff: "Médio", goal: ["hipertrofia"], emoji: "🍱", premium: true },
  { title: "Salada César fit com grão-de-bico", cal: 390, time: 15, diff: "Fácil", goal: ["emagrecimento"], emoji: "🥙", premium: true },
  { title: "Carne moída com abobrinha refogada", cal: 440, time: 25, diff: "Médio", goal: ["low_carb","definicao"], emoji: "🥩", premium: true },
  { title: "Smoothie proteico de morango", cal: 240, time: 5, diff: "Fácil", goal: ["hipertrofia"], emoji: "🍓", premium: true },
];

const GOAL_LABELS: Record<string, string> = {
  emagrecimento: "🔥 Emagrecimento",
  hipertrofia:   "💪 Hipertrofia",
  manutencao:    "⚖️ Manutenção",
  low_carb:      "🥑 Low Carb",
  definicao:     "⚡ Definição",
};

export default function RecipesPage() {
  return (
    <AppShell title="Receitas">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-slate-500 text-sm">{RECIPES.length} receitas disponíveis</p>
        <div className="flex gap-2 text-xs">
          {["Todas","Fácil","Médio","Premium"].map(f => (
            <span key={f} className="px-3 py-1.5 rounded-full border border-slate-200 font-medium text-slate-600 cursor-pointer hover:border-brand-400 hover:text-brand-700 transition">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {RECIPES.map(r => (
          <div key={r.title} className={`card p-5 flex flex-col hover:shadow-md transition ${r.premium ? "opacity-90" : ""}`}>
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
            <div className="flex flex-wrap gap-1 mt-auto">
              {r.goal.map(g => (
                <span key={g} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full font-medium">
                  {GOAL_LABELS[g]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
