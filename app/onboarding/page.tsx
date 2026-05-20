"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Flame, Lock, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { buildEmotionalInsight, estimateProjection, getDifficultyLabel, getGoalLabel } from "@/lib/onboarding";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const goals = [
  { id: "emagrecimento", title: "Emagrecer", desc: "perder peso com rotina possível", emoji: "🔥" },
  { id: "definicao", title: "Definir", desc: "secar e ganhar forma", emoji: "⚡" },
  { id: "massa", title: "Ganhar massa", desc: "comer melhor para evoluir", emoji: "💪" },
  { id: "saude", title: "Mais saúde", desc: "energia, disposição e equilíbrio", emoji: "🌿" },
];

const difficulties = [
  { id: "ansiedade", title: "Ansiedade", desc: "como por emoção" },
  { id: "constancia", title: "Constância", desc: "começo e paro" },
  { id: "tempo", title: "Falta de tempo", desc: "rotina corrida" },
  { id: "doces", title: "Doces", desc: "difícil resistir" },
  { id: "delivery", title: "Delivery", desc: "peço comida demais" },
  { id: "fome", title: "Fome", desc: "sinto fome à noite" },
];

const activities = [
  { id: "sedentary", title: "Pouco ativo", desc: "quase não treino" },
  { id: "light", title: "Leve", desc: "1-2x por semana" },
  { id: "moderate", title: "Moderado", desc: "3-4x por semana" },
  { id: "active", title: "Ativo", desc: "5x+ por semana" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    currentWeight: "",
    goalWeight: "",
    height: "",
    age: "",
    gender: "feminino",
    goal: "emagrecimento",
    activityLevel: "moderate",
    difficulty: "constancia",
    minutesPerDay: "15",
    commitment: true,
  });

  const projection = useMemo(() => estimateProjection({
    name: form.name,
    currentWeight: Number(form.currentWeight),
    goalWeight: Number(form.goalWeight),
    height: Number(form.height),
    age: Number(form.age),
    gender: form.gender,
    goal: form.goal,
    activityLevel: form.activityLevel,
    difficulty: form.difficulty,
    minutesPerDay: Number(form.minutesPerDay),
    commitment: form.commitment,
  }), [form]);

  const insight = useMemo(() => buildEmotionalInsight({
    name: form.name,
    currentWeight: Number(form.currentWeight),
    goalWeight: Number(form.goalWeight),
    height: Number(form.height),
    age: Number(form.age),
    gender: form.gender,
    goal: form.goal,
    activityLevel: form.activityLevel,
    difficulty: form.difficulty,
    minutesPerDay: Number(form.minutesPerDay),
    commitment: form.commitment,
  }), [form]);

  const progress = Math.round(((step + 1) / 6) * 100);
  const canAdvance = step === 0 ? Boolean(form.name.trim()) : step === 1 ? Boolean(form.currentWeight && form.height && form.age) : true;

  const next = () => {
    if (!canAdvance) {
      setError("Preencha os campos principais para continuar.");
      return;
    }
    setError("");
    setStep(s => Math.min(5, s + 1) as Step);
  };

  const back = () => setStep(s => Math.max(0, s - 1) as Step);

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          currentWeight: Number(form.currentWeight),
          goalWeight: Number(form.goalWeight),
          height: Number(form.height),
          age: Number(form.age),
          minutesPerDay: Number(form.minutesPerDay),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erro ao salvar onboarding");
      router.push("/dashboard?onboarding=complete");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_35%),linear-gradient(180deg,#f8fafc,#ecfdf5)] px-4 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-100 shadow-sm text-xs font-extrabold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" /> Quiz IA Premium
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          <section className="bg-white/90 backdrop-blur rounded-[2rem] border border-white shadow-xl shadow-emerald-900/5 p-5 sm:p-8 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-emerald-100 blur-3xl opacity-70" />
            <div className="relative">
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Etapa {step + 1} de 6</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full gradient-brand rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest mb-3">Seu ponto de partida</p>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">Vamos montar sua transformação com IA.</h1>
                    <p className="text-slate-500 mt-4 max-w-xl">Responda em menos de 60 segundos. O Levefy vai usar isso para personalizar seu painel, metas e evolução.</p>
                  </div>
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">Como quer ser chamado?</span>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Lucas" className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400" />
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest mb-3">Dados essenciais</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Qual é o seu cenário atual?</h2>
                    <p className="text-slate-500 mt-3">Esses dados alimentam sua projeção e deixam o dashboard menos genérico.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ["currentWeight", "Peso atual", "kg", "82"],
                      ["goalWeight", "Peso desejado", "kg", "74"],
                      ["height", "Altura", "cm", "175"],
                      ["age", "Idade", "anos", "30"],
                    ].map(([key, label, suffix, ph]) => (
                      <label key={key} className="block rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{label}</span>
                        <div className="flex items-end gap-2 mt-2">
                          <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} inputMode="decimal" placeholder={ph} className="w-full bg-transparent text-3xl font-extrabold outline-none text-slate-950" />
                          <span className="text-sm font-bold text-slate-400 mb-1">{suffix}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["feminino", "masculino"].map(g => (
                      <button key={g} onClick={() => setForm({ ...form, gender: g })} className={`rounded-3xl p-4 text-sm font-extrabold border transition-all ${form.gender === g ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-white text-slate-500"}`}>
                        {g === "feminino" ? "Feminino" : "Masculino"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest mb-3">Objetivo</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Qual transformação você quer sentir primeiro?</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {goals.map(g => (
                      <button key={g.id} onClick={() => setForm({ ...form, goal: g.id })} className={`text-left rounded-3xl border p-5 transition-all ${form.goal === g.id ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-900/5" : "border-slate-100 bg-white hover:border-emerald-200"}`}>
                        <span className="text-3xl">{g.emoji}</span>
                        <strong className="block mt-3 text-lg text-slate-950">{g.title}</strong>
                        <span className="text-sm text-slate-500">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest mb-3">Maior trava</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">O que mais te faz sair da rotina?</h2>
                    <p className="text-slate-500 mt-3">A IA usa isso para falar com você do jeito certo, sem cobrança vazia.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {difficulties.map(d => (
                      <button key={d.id} onClick={() => setForm({ ...form, difficulty: d.id })} className={`text-left rounded-3xl border p-4 transition-all ${form.difficulty === d.id ? "border-emerald-400 bg-emerald-50" : "border-slate-100 bg-white hover:border-emerald-200"}`}>
                        <strong className="block text-slate-950">{d.title}</strong>
                        <span className="text-sm text-slate-500">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-700 uppercase tracking-widest mb-3">Rotina possível</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Quanto de energia você consegue colocar hoje?</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activities.map(a => (
                      <button key={a.id} onClick={() => setForm({ ...form, activityLevel: a.id })} className={`text-left rounded-3xl border p-5 transition-all ${form.activityLevel === a.id ? "border-emerald-400 bg-emerald-50" : "border-slate-100 bg-white hover:border-emerald-200"}`}>
                        <strong className="block text-slate-950">{a.title}</strong>
                        <span className="text-sm text-slate-500">{a.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <span className="text-sm font-extrabold text-slate-700">Tempo mínimo por dia</span>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[10, 15, 25].map(m => (
                        <button key={m} onClick={() => setForm({ ...form, minutesPerDay: String(m) })} className={`rounded-2xl py-3 font-extrabold text-sm ${form.minutesPerDay === String(m) ? "gradient-brand text-white" : "bg-white text-slate-500 border border-slate-100"}`}>{m} min</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                    <Brain className="w-4 h-4" /> Análise IA pronta
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">Sua transformação começa agora.</h2>
                    <p className="text-slate-500 mt-4 text-lg">{insight}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-3xl gradient-brand text-white p-5 shadow-premium">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-white/70 mb-2">Projeção 30 dias</p>
                      <p className="text-2xl font-extrabold">{projection.thirtyDays}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950 text-white p-5 shadow-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,.35),transparent_60%)]" />
                      <div className="relative">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-white/50 mb-2">Projeção 90 dias</p>
                        <p className="text-2xl font-extrabold">{projection.ninetyDays}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => setForm({ ...form, commitment: !form.commitment })} className={`w-full rounded-3xl border p-5 text-left transition-all ${form.commitment ? "border-emerald-400 bg-emerald-50" : "border-slate-100 bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={`w-6 h-6 shrink-0 ${form.commitment ? "text-emerald-600" : "text-slate-300"}`} />
                      <div>
                        <strong className="block text-slate-950">Eu me comprometo comigo por 7 dias.</strong>
                        <span className="text-sm text-slate-500">Não precisa ser perfeito. Só precisa voltar amanhã.</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {error && <p className="mt-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm font-bold">{error}</p>}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button onClick={back} disabled={step === 0} className="px-5 py-3 rounded-full font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-100">Voltar</button>
                {step < 5 ? (
                  <button onClick={next} className="btn-brand px-6 py-3 gap-2">Continuar <ArrowRight className="w-4 h-4" /></button>
                ) : (
                  <button onClick={finish} disabled={saving} className="btn-brand px-6 py-3 gap-2 disabled:opacity-70">
                    {saving ? "Salvando..." : "Ativar meu plano"} <Zap className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-[2rem] bg-slate-950 text-white p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,.35),transparent_60%)]" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mb-5 shadow-brand">
                  <Target className="w-6 h-6" />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-white/50">Seu plano está sendo montado para</p>
                <h3 className="text-2xl font-extrabold mt-2">{getGoalLabel(form.goal)}</h3>
                <div className="mt-5 space-y-3 text-sm text-white/70">
                  <p className="flex gap-2"><Flame className="w-4 h-4 text-orange-300 shrink-0 mt-0.5" /> Streak e check-in para criar hábito.</p>
                  <p className="flex gap-2"><Trophy className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" /> XP por pequenas vitórias diárias.</p>
                  <p className="flex gap-2"><Lock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" /> Premium libera ajustes automáticos e evolução avançada.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-emerald-100 p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-3">Insight personalizado</p>
              <p className="text-sm text-slate-600 leading-relaxed">Sua maior trava agora parece ser <strong>{getDifficultyLabel(form.difficulty)}</strong>. O Levefy vai transformar isso em missões pequenas para você não depender de motivação.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
