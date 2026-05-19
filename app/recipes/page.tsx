"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Clock, Flame, Crown, Lock, Download, X, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

const RECIPES = [
  { title: "Bowl de frango grelhado com quinoa", cal: 420, time: 20, diff: "Fácil", goal: ["emagrecimento","manutencao"], emoji: "🥗", premium: false, ingredients: ["150g frango grelhado", "80g quinoa cozida", "Folhas verdes a gosto", "6 tomates cereja", "1 fio de azeite", "Suco de ½ limão", "Sal e pimenta"], steps: ["Cozinhe a quinoa em água com sal por 15 min.", "Tempere o frango com limão, sal e pimenta e grelhe.", "Monte o bowl com as folhas, quinoa e frango fatiado.", "Finalize com azeite e tomates cereja."], macros: { protein: 42, carbs: 38, fat: 12 } },
  { title: "Omelete de espinafre e cottage", cal: 280, time: 10, diff: "Fácil", goal: ["emagrecimento","low_carb"], emoji: "🍳", premium: false, ingredients: ["3 ovos inteiros", "50g espinafre fresco", "3 colheres de cottage", "Sal e pimenta a gosto", "1 fio de azeite"], steps: ["Bata os ovos com sal e pimenta.", "Refogue o espinafre no azeite por 2 min.", "Despeje os ovos e adicione o cottage.", "Dobre o omelete e sirva quente."], macros: { protein: 28, carbs: 4, fat: 16 } },
  { title: "Batata doce assada com atum", cal: 350, time: 30, diff: "Fácil", goal: ["emagrecimento","hipertrofia"], emoji: "🍠", premium: false, ingredients: ["200g batata doce", "1 lata de atum em água", "1 colher de azeite", "Alecrim a gosto", "Sal a gosto"], steps: ["Pré-aqueça o forno a 200°C.", "Corte a batata, tempere com azeite e alecrim.", "Asse por 25 minutos até dourar.", "Sirva com o atum escorrido por cima."], macros: { protein: 32, carbs: 42, fat: 6 } },
  { title: "Panqueca de aveia com banana", cal: 310, time: 15, diff: "Fácil", goal: ["manutencao"], emoji: "🥞", premium: false, ingredients: ["2 bananas maduras", "2 ovos", "4 colheres de aveia", "Canela a gosto", "Mel para finalizar"], steps: ["Amasse as bananas com um garfo.", "Adicione os ovos, aveia e canela e misture.", "Frite colheradas na frigideira antiaderente.", "Sirva com mel a gosto."], macros: { protein: 14, carbs: 52, fat: 8 } },
  { title: "Marmita de frango com legumes no vapor", cal: 480, time: 35, diff: "Médio", goal: ["hipertrofia"], emoji: "🍱", premium: true, ingredients: ["200g peito de frango", "Brócolis a gosto", "1 cenoura média", "100g vagem", "80g arroz integral", "Temperos naturais"], steps: ["Cozinhe o arroz integral.", "Marine o frango com ervas e grelhe.", "Cozinhe os legumes no vapor por 8 min.", "Monte a marmita e refrigere."], macros: { protein: 48, carbs: 45, fat: 10 } },
  { title: "Salada César fit com grão-de-bico", cal: 390, time: 15, diff: "Fácil", goal: ["emagrecimento"], emoji: "🥙", premium: true, ingredients: ["Alface romana a gosto", "100g grão-de-bico cozido", "30g parmesão ralado", "Croutons integrais", "Molho César light"], steps: ["Lave e rasgue a alface romana.", "Misture com o grão-de-bico cozido.", "Adicione o parmesão ralado.", "Finalize com molho e croutons."], macros: { protein: 22, carbs: 44, fat: 14 } },
  { title: "Carne moída com abobrinha refogada", cal: 440, time: 25, diff: "Médio", goal: ["low_carb","definicao"], emoji: "🥩", premium: true, ingredients: ["200g carne moída", "2 abobrinhas médias", "2 dentes de alho", "1 tomate picado", "Azeite e temperos"], steps: ["Refogue o alho no azeite.", "Doure a carne moída e tempere.", "Adicione abobrinha em cubos e tomate.", "Cozinhe tampado por 10 min."], macros: { protein: 38, carbs: 12, fat: 28 } },
  { title: "Smoothie proteico de morango", cal: 240, time: 5, diff: "Fácil", goal: ["hipertrofia"], emoji: "🍓", premium: true, ingredients: ["200ml leite desnatado", "100g morango", "1 scoop whey protein", "1 banana pequena", "Mel a gosto"], steps: ["Coloque todos os ingredientes no liquidificador.", "Bata por 1 minuto até ficar cremoso.", "Sirva imediatamente gelado."], macros: { protein: 30, carbs: 32, fat: 3 } },
];

const GOAL_LABELS: Record<string,string> = { emagrecimento:"🔥 Emagrecimento", hipertrofia:"💪 Hipertrofia", manutencao:"⚖️ Manutenção", low_carb:"🥑 Low Carb", definicao:"⚡ Definição" };

export default function RecipesPage() {
  const [plan, setPlan] = useState("free");
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<typeof RECIPES[0] | null>(null);

  useEffect(() => {
    fetch("/api/user/me").then(r => r.json()).then(d => setPlan(d.user?.plan ?? "free"));
  }, []);

  const canAccess = (r: typeof RECIPES[0]) => !r.premium || plan === "premium" || plan === "start";
  const filtered = RECIPES.filter(r => filter === "Todas" ? true : filter === "Premium" ? r.premium : r.diff === filter);

  const printRecipe = (recipe: typeof RECIPES[0]) => {
    const w = window.open("","_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${recipe.title} — Levefy</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e293b;padding:40px;max-width:600px;margin:0 auto}.header{border-bottom:3px solid #16a34a;padding-bottom:20px;margin-bottom:24px}.brand{color:#16a34a;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}.emoji{font-size:48px;display:block;margin-bottom:12px}h1{font-size:22px;font-weight:800;line-height:1.3}.meta{display:flex;gap:16px;margin-top:10px;font-size:13px;color:#64748b;flex-wrap:wrap}.macros{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}.macro{background:#f8fafc;border-radius:10px;padding:14px;text-align:center;border:1px solid #e2e8f0}.macro-val{font-size:20px;font-weight:800;color:#16a34a}.macro-lbl{font-size:11px;color:#94a3b8;margin-top:2px;text-transform:uppercase}h2{font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;margin:24px 0 12px}ul{list-style:none}ul li{padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:14px;display:flex;align-items:center;gap:8px}ul li::before{content:"•";color:#16a34a;font-weight:bold;font-size:18px}ol{list-style:none}ol li{padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;display:flex;gap:12px;align-items:flex-start}.num{background:#16a34a;color:white;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8}@media print{body{padding:20px}}</style></head><body><div class="header"><p class="brand">Levefy — Receita Saudável</p><span class="emoji">${recipe.emoji}</span><h1>${recipe.title}</h1><div class="meta"><span>🔥 ${recipe.cal} kcal</span><span>⏱ ${recipe.time} min</span><span>${recipe.diff}</span></div></div><div class="macros"><div class="macro"><div class="macro-val">${recipe.macros.protein}g</div><div class="macro-lbl">Proteína</div></div><div class="macro"><div class="macro-val">${recipe.macros.carbs}g</div><div class="macro-lbl">Carboidrato</div></div><div class="macro"><div class="macro-val">${recipe.macros.fat}g</div><div class="macro-lbl">Gordura</div></div></div><h2>🛒 Ingredientes</h2><ul>${recipe.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul><h2>👩‍🍳 Modo de preparo</h2><ol>${recipe.steps.map((s,i)=>`<li><span class="num">${i+1}</span><span>${s}</span></li>`).join("")}</ol><div class="footer">Gerado pelo Levefy · levefy-mu.vercel.app · ${new Date().toLocaleDateString("pt-BR")}</div><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script></body></html>`);
    w.document.close();
  };

  return (
    <AppShell title="Receitas">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-slate-500 text-sm font-medium">
          <span className="text-slate-900 font-bold">{filtered.length}</span> receitas disponíveis
        </p>
        <div className="flex gap-2 flex-wrap text-xs">
          {["Todas","Fácil","Médio","Premium"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border font-semibold transition-all duration-200 ${
                filter === f
                  ? "border-transparent text-white gradient-brand shadow-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700 hover:-translate-y-0.5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(r => (
          <div
            key={r.title}
            className={`card card-hover p-5 flex flex-col group relative overflow-hidden ${
              canAccess(r) ? "cursor-pointer" : ""
            }`}
            onClick={() => canAccess(r) && setSelected(r)}
          >
            {r.premium && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold">
                <Crown className="w-2.5 h-2.5" /> PRO
              </span>
            )}
            <div className="w-14 h-14 rounded-2xl bg-brand-50/60 flex items-center justify-center text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
              {r.emoji}
            </div>
            <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{r.title}</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3 flex-wrap font-medium">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400"/>{r.cal} kcal</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{r.time} min</span>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">{r.diff}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-auto mb-3">
              {r.goal.map(g => (
                <span key={g} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] rounded-full font-bold">
                  {GOAL_LABELS[g]}
                </span>
              ))}
            </div>
            {canAccess(r) ? (
              <span className="flex items-center gap-1 text-xs text-brand-600 font-bold group-hover:gap-2 transition-all">
                Ver receita <ChevronRight className="w-3.5 h-3.5"/>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                <Lock className="w-3 h-3"/> Requer plano pago
              </span>
            )}
          </div>
        ))}
      </div>

      {plan === "free" && (
        <div className="mt-10 card p-5 sm:p-6 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap relative overflow-hidden shadow-premium">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <p className="font-extrabold text-lg tracking-tight">🔓 Desbloqueie todas as receitas</p>
            <p className="text-sm text-white/85 mt-1">Acesse receitas exclusivas com START ou PREMIUM</p>
          </div>
          <Link
            href="/membership"
            className="relative bg-white text-brand-700 font-bold px-6 py-3 rounded-full text-sm shrink-0 hover:-translate-y-0.5 hover:bg-brand-50 transition-all duration-200 shadow-soft"
          >
            Ver planos
          </Link>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in">
          <div className="bg-white w-full sm:rounded-3xl sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl shadow-premium">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0 w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center">{selected.emoji}</span>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-sm leading-tight truncate">{selected.title}</h2>
                  <div className="flex gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                    <span>🔥 {selected.cal} kcal</span><span>⏱ {selected.time} min</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 shrink-0 ml-2 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600"/>
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { l: "Proteína", v: `${selected.macros.protein}g`, c: "text-blue-700", b: "bg-blue-50" },
                  { l: "Carbo",    v: `${selected.macros.carbs}g`,   c: "text-amber-700", b: "bg-amber-50" },
                  { l: "Gordura",  v: `${selected.macros.fat}g`,     c: "text-rose-700",  b: "bg-rose-50" },
                ].map(m => (
                  <div key={m.l} className={`${m.b} rounded-2xl p-3 text-center`}>
                    <p className={`font-extrabold text-lg ${m.c}`}>{m.v}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{m.l}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-slate-500">🛒 Ingredientes</h3>
              <ul className="space-y-2 mb-6">
                {selected.ingredients.map((ing,i)=>(
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0 mt-2"/>
                    {ing}
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-slate-500">👩‍🍳 Modo de preparo</h3>
              <ol className="space-y-3 mb-7">
                {selected.steps.map((step,i)=>(
                  <li key={i} className="text-sm text-slate-700 flex gap-3">
                    <span className="w-7 h-7 gradient-brand text-white rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 shadow-brand">
                      {i+1}
                    </span>
                    <span className="leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
              <button onClick={() => printRecipe(selected)} className="btn-primary w-full gap-2">
                <Download className="w-4 h-4"/> Salvar / Imprimir PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
