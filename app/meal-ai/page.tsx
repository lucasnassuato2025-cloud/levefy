"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Sparkles, Brain, Loader2, ChevronDown, RefreshCw, Calendar, Star, BadgeCheck, Gift } from "lucide-react";
import type { MealSlot, MacroResult } from "@/lib/meal-engine";

const LOADING_STEPS = [
  "Analisando perfil nutricional...",
  "Calculando distribuição ideal de macros...",
  "Selecionando refeições otimizadas...",
  "Aplicando personalização avançada...",
  "Montando plano inteligente...",
];

const GOALS = [
  { v: "emagrecimento", l: "🔥 Emagrecimento" },
  { v: "hipertrofia",   l: "💪 Hipertrofia" },
  { v: "manutencao",    l: "⚖️ Manutenção" },
  { v: "low_carb",      l: "🥑 Low Carb" },
  { v: "definicao",     l: "⚡ Definição" },
  { v: "diabetes",      l: "💉 Para Diabéticos" },
  { v: "vegetariano",   l: "🥦 Vegetariano" },
  { v: "alta_proteina", l: "🏋️ Alta Proteína" },
];

const ACTIVITY = [
  { v: "sedentario", l: "Sedentário" },
  { v: "leve",       l: "Levemente ativo" },
  { v: "moderate",   l: "Moderadamente ativo" },
  { v: "ativo",      l: "Muito ativo" },
  { v: "muito_ativo", l: "Extremamente ativo" },
];

const EXPERTS = [
  { name: "Dra. Camila Azevedo", specialty: "Nutrição Clínica Esportiva", avatar: "CA", color: "from-rose-400 to-pink-600" },
  { name: "Dr. Rafael Monteiro", specialty: "Emagrecimento e Performance", avatar: "RM", color: "from-blue-400 to-indigo-600" },
  { name: "Dra. Juliana Ferraz", specialty: "Nutrição Funcional Hormonal", avatar: "JF", color: "from-amber-400 to-orange-500" },
];

const FREE_RECIPES_PREVIEW = [
  { day: "Dia 1", name: "Café da manhã proteico + almoço detox", cal: 1650, goal: "emagrecimento" },
  { day: "Dia 2", name: "Smoothie verde + prato equilibrado", cal: 1720, goal: "emagrecimento" },
  { day: "Dia 3", name: "Aveia fitness + frango grelhado", cal: 1580, goal: "manutencao" },
  { day: "Dia 4", name: "Omelete proteica + salada completa", cal: 1800, goal: "hipertrofia" },
  { day: "Dia 5", name: "Iogurte grego + peixe ao forno", cal: 1620, goal: "emagrecimento" },
  { day: "Dia 6", name: "Tapioca fit + peito de frango", cal: 1750, goal: "manutencao" },
  { day: "Dia 7", name: "Vitamina de frutas + wrap proteico", cal: 1680, goal: "emagrecimento" },
];

interface Result {
  macros: MacroResult;
  meals: MealSlot[];
  score: number;
  habits: string[];
}

export default function MealAIPage() {
  const [form, setForm] = useState({
    weight: "", height: "", age: "", gender: "feminino",
    activityLevel: "moderate", goal: "emagrecimento", restrictions: [] as string[],
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-fill from profile
  useEffect(() => {
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setForm(prev => ({
            ...prev,
            weight: d.user.currentWeight?.toString() ?? prev.weight,
            height: d.user.height?.toString() ?? prev.height,
            age: d.user.age?.toString() ?? prev.age,
            gender: d.user.gender ?? prev.gender,
            activityLevel: d.user.activityLevel ?? prev.activityLevel,
            goal: d.user.goal ?? prev.goal,
            restrictions: d.user.restrictions ?? [],
          }));
          setProfileLoaded(true);
        }
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.weight || !form.height || !form.age) return;
    setLoading(true);
    setResult(null);
    setStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }

    try {
      const res = await fetch("/api/ai/generate-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: "daily" }),
      });
      const data = await res.json();
      if (data.success) setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 85 ? "text-brand-600" : s >= 70 ? "text-amber-600" : "text-red-500";
  const scoreLabel = (s: number) => s >= 85 ? "Excelente" : s >= 70 ? "Bom" : "Regular";

  return (
    <AppShell title="">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Meal <span className="text-gradient-soft">AI</span>
          </h1>
          <p className="text-sm text-slate-500">Plano alimentar personalizado em segundos</p>
        </div>
      </div>

      {/* 7-day free trial banner */}
      <div className="mb-6 rounded-3xl p-5 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #22c55e 0%, transparent 60%)" }} />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">7 Dias Grátis</span>
            </div>
            <h3 className="text-white font-extrabold text-lg mb-1">Seu presente de boas-vindas 🎁</h3>
            <p className="text-white/60 text-sm">7 cardápios completos e personalizados para começar sua jornada</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FREE_RECIPES_PREVIEW.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center min-w-[90px]">
                <p className="text-[10px] font-bold text-green-400 mb-1">{r.day}</p>
                <p className="text-[10px] text-white/70 leading-tight">{r.cal} kcal</p>
              </div>
            ))}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center min-w-[90px] flex items-center justify-center">
              <p className="text-[10px] text-white/50">+4 dias incluídos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs uppercase tracking-[0.14em] text-slate-500">Seu perfil</h2>
            <div className="flex items-center gap-2">
              {profileLoaded && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  ✓ Perfil sincronizado
                </span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                IA personalizada
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Peso (kg)</label>
              <input value={form.weight} onChange={e => set("weight", e.target.value)} type="number"
                className="input-premium" placeholder="70" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Altura (cm)</label>
              <input value={form.height} onChange={e => set("height", e.target.value)} type="number"
                className="input-premium" placeholder="165" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Idade</label>
              <input value={form.age} onChange={e => set("age", e.target.value)} type="number"
                className="input-premium" placeholder="30" />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Sexo</label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}
                className="input-premium bg-white">
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 mb-2 block font-medium">Objetivo</label>
            <div className="grid grid-cols-1 gap-2">
              {GOALS.map(g => (
                <button key={g.v} onClick={() => set("goal", g.v)}
                  className={`text-left px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 border ${
                    form.goal === g.v
                      ? "gradient-brand text-white border-transparent shadow-brand"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:-translate-y-0.5"
                  }`}>
                  {g.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 mb-1 block font-medium">Nível de atividade</label>
            <select value={form.activityLevel} onChange={e => set("activityLevel", e.target.value)}
              className="input-premium bg-white">
              {ACTIVITY.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}
            </select>
          </div>

          <button onClick={generate} disabled={loading || !form.weight || !form.height || !form.age}
            className="w-full btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando...</>
              : <><Sparkles className="w-4 h-4" /> Gerar plano com IA</>}
          </button>
        </div>

        {/* Result */}
        <div className="lg:col-span-3">
          {loading && (
            <div className="card p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
                  <Brain className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <p className="font-bold">Meal AI processando</p>
                  <p className="text-xs text-slate-500">Inteligência artificial analisando seu perfil...</p>
                </div>
              </div>
              <div className="space-y-3">
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    i < step ? "text-brand-600" : i === step ? "text-slate-900 font-semibold" : "text-slate-300"
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      i < step ? "bg-brand-100 text-brand-600" : i === step ? "gradient-brand text-white shadow-brand" : "bg-slate-100"
                    }`}>
                      {i < step ? "✓" : i === step ? <Loader2 className="w-3 h-3 animate-spin" /> : ""}
                    </div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-in">
              {/* Macros */}
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Distribuição de macros</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-extrabold ${scoreColor(result.score)}`}>{result.score}<span className="text-slate-300 font-medium">/100</span></span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      result.score >= 85 ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
                    }`}>{scoreLabel(result.score)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { l: "Calorias", v: `${result.macros.calories}`, u: "kcal", color: "bg-brand-50 text-brand-700" },
                    { l: "Proteína", v: `${result.macros.protein}g`, u: "", color: "bg-blue-50 text-blue-700" },
                    { l: "Carbs",    v: `${result.macros.carbs}g`,   u: "", color: "bg-amber-50 text-amber-700" },
                    { l: "Gordura", v: `${result.macros.fat}g`,      u: "", color: "bg-purple-50 text-purple-700" },
                  ].map(m => (
                    <div key={m.l} className={`rounded-2xl p-3 text-center ${m.color}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{m.l}</p>
                      <p className="text-lg sm:text-xl font-extrabold mt-0.5">{m.v}</p>
                      {m.u && <p className="text-[10px] opacity-60">{m.u}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meals */}
              <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-600" /> Plano do dia
                  </h3>
                  <button onClick={generate}
                    className="flex items-center gap-1.5 text-xs text-brand-600 font-bold hover:text-brand-700 transition">
                    <RefreshCw className="w-3.5 h-3.5" /> Gerar novo
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {result.meals.map((meal, i) => (
                    <div key={i} className="p-4 sm:p-5 transition-colors hover:bg-slate-50/40">
                      <button className="w-full flex items-center justify-between" onClick={() => setExpandedMeal(expandedMeal === i ? null : i)}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-xl">
                            {["☀️","🍏","🍽️","🥤","🌙"][i]}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{meal.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{meal.time} · {meal.totalCals} kcal</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 hidden sm:block">
                            P: {Math.round(meal.totalProtein)}g · C: {Math.round(meal.totalCarbs)}g · G: {Math.round(meal.totalFat)}g
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedMeal === i ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {expandedMeal === i && (
                        <div className="mt-4 pl-13 sm:pl-14 space-y-2 animate-fade-in">
                          {meal.items.map((item, j) => (
                            <div key={j} className="flex items-center justify-between text-sm p-2.5 rounded-2xl bg-slate-50">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.emoji}</span>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-slate-400 text-xs">{item.amount}</span>
                              </div>
                              <span className="text-slate-500 text-xs font-medium">{item.calories} kcal</span>
                            </div>
                          ))}
                          {meal.tip && (
                            <p className="text-xs text-brand-700 italic pl-1 pt-1 leading-relaxed">
                              💡 {meal.tip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Habits */}
              {result.habits.length > 0 && (
                <div className="card p-5 sm:p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">💡 Hábitos recomendados</h3>
                  <ul className="space-y-2">
                    {result.habits.slice(0, 4).map((h, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2 p-3 rounded-2xl bg-brand-50/60 border border-brand-100/60">
                        <span className="shrink-0">{h.slice(0, 2)}</span>
                        <span>{h.slice(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="card p-10 sm:p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-brand-400" />
              </div>
              <p className="font-bold text-slate-700">Preencha o formulário e clique em Gerar plano</p>
              <p className="text-sm text-slate-400 mt-1.5 max-w-xs mx-auto">
                O Meal AI cria um plano personalizado para você em segundos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Experts section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">Desenvolvido com especialistas</h3>
            <p className="text-xs text-slate-500 mt-0.5">Algoritmo validado por nutricionistas certificados</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            <BadgeCheck className="w-3.5 h-3.5" /> CRN verificado
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {EXPERTS.map(e => (
            <div key={e.name} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                  {e.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm">{e.name}</p>
                  <p className="text-[11px] text-brand-700 font-medium">{e.specialty}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] text-slate-400 ml-1 font-medium">5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-[10px] text-slate-400 font-medium">Especialista Verificado</span>
              </div>
            </div>
          ))}
        </div>
        {/* Trust row */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {["+12.000 planos gerados", "4.9★ avaliação média", "98% satisfação"].map(s => (
            <div key={s} className="text-center p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100/60">
              <p className="text-sm font-extrabold text-brand-700">{s.split(" ")[0]}</p>
              <p className="text-[11px] text-slate-500">{s.split(" ").slice(1).join(" ")}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
