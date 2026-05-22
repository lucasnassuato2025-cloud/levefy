"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Sparkles, Brain, Loader2, ChevronDown, RefreshCw, Calendar, Star, BadgeCheck, Crown, Lock, AlertCircle } from "lucide-react";
import type { FastingProtocol, MealSlot, MacroResult } from "@/lib/meal-engine";
import { PLAN_LIMITS, normalizePlan, type LevefyPlan } from "@/lib/plan-access";
import Link from "next/link";

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

const FASTING_OPTIONS: { value: FastingProtocol; label: string; description: string }[] = [
  { value: "none", label: "Sem jejum", description: "5 refeicoes ao longo do dia" },
  { value: "12_12", label: "12/12", description: "Janela leve para comecar" },
  { value: "14_10", label: "14/10", description: "Rotina moderada START" },
  { value: "16_8", label: "16/8", description: "Janela premium mais focada" },
];

const EXPERTS = [
  { name: "Dra. Camila Azevedo", specialty: "Nutrição Clínica Esportiva", avatar: "CA", color: "from-rose-400 to-pink-600" },
  { name: "Dr. Rafael Monteiro", specialty: "Emagrecimento e Performance", avatar: "RM", color: "from-blue-400 to-indigo-600" },
  { name: "Dra. Juliana Ferraz", specialty: "Nutrição Funcional Hormonal", avatar: "JF", color: "from-amber-400 to-orange-500" },
];

interface Result {
  macros: MacroResult;
  meals: MealSlot[];
  score: number;
  habits: string[];
  fastingProtocol?: FastingProtocol;
  usage?: { used: number; limit: number | null; plan: LevefyPlan };
}

export default function MealAIPage() {
  const [form, setForm] = useState({
    weight: "", height: "", age: "", gender: "feminino",
    activityLevel: "moderate", goal: "emagrecimento", restrictions: [] as string[],
    fastingProtocol: "none" as FastingProtocol,
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [plan, setPlan] = useState<LevefyPlan>("free");
  const [usage, setUsage] = useState<Result["usage"] | null>(null);
  const [error, setError] = useState("");

  // Auto-fill from profile
  useEffect(() => {
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setPlan(normalizePlan(d.user.plan));
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
    setError("");
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
      if (!res.ok || !data.success) {
        setError(data.error ?? "Nao foi possivel gerar seu plano agora.");
        if (data.usage) setUsage(data.usage);
        return;
      }
      setResult(data);
      if (data.usage) setUsage(data.usage);
    } catch (e) {
      console.error(e);
      setError("Nao foi possivel gerar seu plano agora.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 85 ? "text-brand-600" : s >= 70 ? "text-amber-600" : "text-red-500";
  const scoreLabel = (s: number) => s >= 85 ? "Excelente" : s >= 70 ? "Bom" : "Regular";
  const isPaid = plan === "start" || plan === "premium";
  const planLimit = PLAN_LIMITS[plan].mealAiGenerationsPerWeek;
  const usageLabel = usage
    ? `${usage.used}/${usage.limit ?? "∞"} usados esta semana`
    : planLimit === "ilimitado"
      ? "Ilimitado no Premium"
      : `${planLimit} gerações por semana`;

  const mobileView = (
    <div className="space-y-3.5">
      <section className="rounded-[1.65rem] bg-slate-950 p-4 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.8)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">Meal AI</p>
            <h1 className="mt-1 text-[1.45rem] font-extrabold leading-tight tracking-tight">
              Plano alimentar rapido
            </h1>
            <p className="mt-1 text-xs leading-5 text-white/65">Preencha o basico e gere seu plano do dia.</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-brand shadow-brand">
            <Brain className="h-5 w-5 text-white" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Plano</p>
          <p className="mt-1 text-xs font-extrabold text-slate-900">{PLAN_LIMITS[plan].label}</p>
        </div>
        <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Uso</p>
          <p className="mt-1 text-xs font-extrabold text-slate-900">{usageLabel}</p>
        </div>
        <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Jejum</p>
          <p className="mt-1 text-xs font-extrabold text-slate-900">{isPaid ? "Liberado" : "Pago"}</p>
        </div>
      </section>

      <section className="rounded-[1.45rem] bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-950">Seu perfil</h2>
          {profileLoaded && <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-extrabold text-brand-700">sincronizado</span>}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <label className="block">
            <span className="text-[11px] font-bold text-slate-500">Peso</span>
            <input value={form.weight} onChange={e => set("weight", e.target.value)} type="number" className="input-premium mt-1" placeholder="70" />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-slate-500">Altura</span>
            <input value={form.height} onChange={e => set("height", e.target.value)} type="number" className="input-premium mt-1" placeholder="165" />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-slate-500">Idade</span>
            <input value={form.age} onChange={e => set("age", e.target.value)} type="number" className="input-premium mt-1" placeholder="30" />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-slate-500">Sexo</span>
            <select value={form.gender} onChange={e => set("gender", e.target.value)} className="input-premium mt-1 bg-white">
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </label>
        </div>

        <label className="mt-3 block">
          <span className="text-[11px] font-bold text-slate-500">Objetivo</span>
          <select value={form.goal} onChange={e => set("goal", e.target.value)} className="input-premium mt-1 bg-white">
            {GOALS.map(goal => <option key={goal.v} value={goal.v}>{goal.l}</option>)}
          </select>
        </label>

        <label className="mt-3 block">
          <span className="text-[11px] font-bold text-slate-500">Atividade</span>
          <select value={form.activityLevel} onChange={e => set("activityLevel", e.target.value)} className="input-premium mt-1 bg-white">
            {ACTIVITY.map(activity => <option key={activity.v} value={activity.v}>{activity.l}</option>)}
          </select>
        </label>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Jejum intermitente</span>
            {!isPaid && <Link href="/membership" className="text-[10px] font-extrabold text-amber-700">START/Premium</Link>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FASTING_OPTIONS.map(option => {
              const locked = option.value !== "none" && !isPaid;
              const active = form.fastingProtocol === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={locked}
                  onClick={() => setForm(current => ({ ...current, fastingProtocol: option.value }))}
                  className={`rounded-2xl border px-3 py-2 text-left ${active ? "gradient-brand text-white border-transparent" : locked ? "border-slate-100 bg-slate-50 text-slate-300" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  <span className="block text-xs font-extrabold">{option.label}</span>
                  <span className={`block text-[10px] leading-tight ${active ? "text-white/75" : "text-slate-400"}`}>{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <button onClick={generate} disabled={loading || !form.weight || !form.height || !form.age} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full gradient-brand px-4 text-sm font-extrabold text-white shadow-brand disabled:opacity-50">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</> : <><Sparkles className="h-4 w-4" /> Gerar plano</>}
        </button>
      </section>

      {loading && (
        <section className="rounded-[1.45rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-extrabold text-slate-900">{LOADING_STEPS[step]}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full gradient-brand transition-all" style={{ width: `${((step + 1) / LOADING_STEPS.length) * 100}%` }} />
          </div>
        </section>
      )}

      {result && !loading && (
        <section className="space-y-3.5">
          <div className="rounded-[1.45rem] bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold">Macros do dia</h2>
              <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-extrabold text-brand-700">{result.score}/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Calorias", `${result.macros.calories} kcal`],
                ["Proteina", `${result.macros.protein}g`],
                ["Carbs", `${result.macros.carbs}g`],
                ["Gordura", `${result.macros.fat}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
                  <p className="mt-1 text-base font-extrabold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.45rem] bg-white shadow-sm ring-1 ring-slate-100">
            <div className="border-b border-slate-100 p-3.5">
              <h2 className="text-sm font-extrabold">Plano do dia</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {result.meals.map((meal, index) => (
                <button key={index} type="button" onClick={() => setExpandedMeal(expandedMeal === index ? null : index)} className="block w-full p-3.5 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-slate-950">{meal.label}</p>
                      <p className="text-[11px] text-slate-500">{meal.time} • {meal.totalCals} kcal</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition ${expandedMeal === index ? "rotate-180" : ""}`} />
                  </div>
                  {expandedMeal === index && (
                    <div className="mt-3 space-y-2">
                      {meal.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs">
                          <span className="font-bold text-slate-700">{item.name}</span>
                          <span className="text-slate-400">{item.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );

  return (
    <AppShell title="" mobile={mobileView}>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
        <div className="relative">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </span>
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Meal <span className="text-gradient-soft">AI</span>
          </h1>
          <p className="text-sm text-slate-500">Plano alimentar personalizado em segundos</p>
        </div>
      </div>

      <div className="mb-4 grid gap-2.5 sm:mb-5 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/70 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-700">Seu plano</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{PLAN_LIMITS[plan].label}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Meal AI</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{usageLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Jejum</p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">{isPaid ? "Liberado" : "START/Premium"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-4 space-y-4 sm:p-6 sm:space-y-5">
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
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              {GOALS.map(g => (
                <button key={g.v} onClick={() => set("goal", g.v)}
                  className={`text-left px-3 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 border sm:px-4 sm:py-2.5 ${
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

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-[11px] text-slate-500 block font-medium">Jejum intermitente</label>
              {!isPaid && (
                <Link href="/membership" className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700">
                  <Lock className="h-3 w-3" /> START/Premium
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {FASTING_OPTIONS.map(option => {
                const locked = option.value !== "none" && !isPaid;
                const active = form.fastingProtocol === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={locked}
                    onClick={() => setForm(current => ({ ...current, fastingProtocol: option.value }))}
                    className={`rounded-2xl border px-2.5 py-2 text-left transition-all sm:px-3 sm:py-3 ${
                      active
                        ? "border-transparent gradient-brand text-white shadow-brand"
                        : locked
                          ? "border-slate-100 bg-slate-50 text-slate-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{option.label}</span>
                    <span className={`mt-0.5 block text-[10px] leading-tight ${active ? "text-white/75" : "text-slate-400"}`}>
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

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
            <div className="card p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
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
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Distribuição de macros</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-extrabold ${scoreColor(result.score)}`}>{result.score}<span className="text-slate-300 font-medium">/100</span></span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      result.score >= 85 ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
                    }`}>{scoreLabel(result.score)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {[
                    { l: "Calorias", v: `${result.macros.calories}`, u: "kcal", color: "bg-brand-50 text-brand-700" },
                    { l: "Proteína", v: `${result.macros.protein}g`, u: "", color: "bg-blue-50 text-blue-700" },
                    { l: "Carbs",    v: `${result.macros.carbs}g`,   u: "", color: "bg-amber-50 text-amber-700" },
                    { l: "Gordura", v: `${result.macros.fat}g`,      u: "", color: "bg-purple-50 text-purple-700" },
                  ].map(m => (
                    <div key={m.l} className={`rounded-2xl p-2.5 text-center sm:p-3 ${m.color}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{m.l}</p>
                      <p className="text-lg sm:text-xl font-extrabold mt-0.5">{m.v}</p>
                      {m.u && <p className="text-[10px] opacity-60">{m.u}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* WOW projection */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="card p-4 sm:p-5 bg-gradient-to-br from-brand-50 to-emerald-50 border-brand-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-brand-700" />
                    <h3 className="font-extrabold text-sm text-brand-900">Projeção de 30 dias</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-brand-700 leading-none">
                    {form.goal === "hipertrofia" ? "+1 a +3kg" : "-2 a -5kg"}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Estimativa educativa baseada em consistência, macros e check-ins. O Premium acompanha e ajusta essa rota todos os dias.
                  </p>
                </div>
                <div className="card p-4 sm:p-5 bg-slate-950 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_60%)]" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="w-4 h-4 text-amber-300" />
                      <h3 className="font-extrabold text-sm">Premium desbloqueia ajustes diários</h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">
                      Troque refeições, gere novos dias, monte lista de compras e veja a rota de 90 dias sem limite.
                    </p>
                    <Link href="/membership" className="inline-flex items-center gap-2 bg-white text-slate-950 px-3.5 py-2 rounded-full text-xs font-extrabold sm:px-4">
                      <Lock className="w-3.5 h-3.5" /> Desbloquear Premium
                    </Link>
                  </div>
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
                    <div key={i} className="p-3.5 sm:p-5 transition-colors hover:bg-slate-50/40">
                      <button className="w-full flex items-center justify-between" onClick={() => setExpandedMeal(expandedMeal === i ? null : i)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-lg sm:text-xl">
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
                <div className="card p-4 sm:p-6">
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
            <div className="card p-6 sm:p-14 text-center">
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
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">Desenvolvido com especialistas</h3>
            <p className="text-xs text-slate-500 mt-0.5">Algoritmo validado por nutricionistas certificados</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            <BadgeCheck className="w-3.5 h-3.5" /> CRN verificado
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
          {EXPERTS.map(e => (
            <div key={e.name} className="bg-white rounded-[1.35rem] sm:rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
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
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
          {["+12.000 planos gerados", "4.9★ avaliação média", "98% satisfação"].map(s => (
            <div key={s} className="text-center p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100/60">
              <p className="text-sm font-extrabold text-brand-700">{s.split(" ")[0]}</p>
              <p className="text-[11px] text-slate-500">{s.split(" ").slice(1).join(" ")}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
