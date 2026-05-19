"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Save, Trophy, Camera, Crown, CreditCard, AlertTriangle } from "lucide-react";
import { getLevelFromXP, MEDALS } from "@/lib/gamification";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", weight: "", height: "", age: "", gender: "feminino", goal: "emagrecimento" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name ?? "",
            weight: d.user.currentWeight?.toString() ?? "",
            height: d.user.height?.toString() ?? "",
            age: d.user.age?.toString() ?? "",
            gender: d.user.gender ?? "feminino",
            goal: d.user.goal ?? "emagrecimento",
          });
        }
        setLoading(false);
      });
  }, []);

  const xp = user?.xp ?? 0;
  const streak = user?.streakDays ?? 0;
  const plan = user?.plan ?? "free";
  const level = getLevelFromXP(xp);
  const avatar = user?.avatar;
  const isPremium = plan === "premium";
  const isStart = plan === "start";

  const save = async () => {
    await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancelSubscription = async () => {
    setCanceling(true);
    const res = await fetch("/api/stripe/cancel", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      alert("Assinatura cancelada. Você mantém o acesso até o fim do período atual.");
      setShowCancelConfirm(false);
      window.location.reload();
    } else {
      alert("Erro ao cancelar: " + data.error);
    }
    setCanceling(false);
  };

  if (loading) return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-72 w-full lg:col-span-2" />
      </div>
    </AppShell>
  );

  return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">

        {/* Stats card */}
        <div className="card p-7 text-center relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-brand-100/40 blur-3xl pointer-events-none" />

          <div className="relative w-24 h-24 mx-auto mb-4">
            {avatar ? (
              <img
                src={avatar}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-premium"
              />
            ) : (
              <div className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center text-5xl shadow-premium border-4 border-white">
                {level.emoji}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow border-2 border-white">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <p className="font-extrabold text-xl tracking-tight">{form.name || "Usuário"}</p>
          <p className="text-sm text-slate-500 mt-0.5">{level.title} · Nível {level.level}</p>

          <div className="mt-3 relative">
            {isPremium && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full gradient-brand text-white text-[11px] font-extrabold tracking-wider uppercase shadow-brand">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            )}
            {isStart && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-soft">
                ⚡ START
              </span>
            )}
            {!isPremium && !isStart && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                Plano Free
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-2xl font-extrabold text-brand-700">{xp}</p>
              <p className="text-[11px] text-brand-600 font-bold uppercase tracking-wider mt-0.5">XP total</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-2xl font-extrabold text-orange-600">{streak > 0 ? `${streak}🔥` : "0"}</p>
              <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">Streak</p>
            </div>
          </div>

          {isPremium && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition mx-auto font-medium"
              >
                <CreditCard className="w-3.5 h-3.5" /> Cancelar assinatura
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-7 space-y-5">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">Dados pessoais</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mantenha seus dados atualizados para um plano mais preciso</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "name",   l: "Nome completo",  t: "text",   p: "Seu nome",  span: 2 },
              { k: "weight", l: "Peso atual (kg)", t: "number", p: "70",        span: 1 },
              { k: "height", l: "Altura (cm)",     t: "number", p: "165",       span: 1 },
              { k: "age",    l: "Idade",           t: "number", p: "30",        span: 1 },
            ].map(f => (
              <div key={f.k} className={f.span === 2 ? "col-span-2" : ""}>
                <label className="text-[11px] text-slate-500 mb-1 block font-medium">{f.l}</label>
                <input
                  type={f.t} placeholder={f.p} value={form[f.k as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                  className="input-premium"
                />
              </div>
            ))}
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Sexo</label>
              <select
                value={form.gender}
                onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                className="input-premium bg-white"
              >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block font-medium">Objetivo</label>
              <select
                value={form.goal}
                onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
                className="input-premium bg-white"
              >
                <option value="emagrecimento">🔥 Emagrecimento</option>
                <option value="hipertrofia">💪 Hipertrofia</option>
                <option value="manutencao">⚖️ Manutenção</option>
                <option value="low_carb">🥑 Low Carb</option>
                <option value="definicao">⚡ Definição</option>
              </select>
            </div>
          </div>
          <button onClick={save} className="btn-primary gap-2 mt-2">
            <Save className="w-4 h-4" /> {saved ? "✓ Salvo!" : "Salvar perfil"}
          </button>
        </div>

        {/* Medals */}
        <div className="lg:col-span-3 card p-7">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold flex items-center gap-2 tracking-tight">
              <Trophy className="w-4 h-4 text-amber-500" /> Conquistas
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {MEDALS.length} medalhas
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MEDALS.map(m => (
              <div
                key={m.id}
                className="text-center p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
              >
                <div className="text-4xl mb-2">{m.emoji}</div>
                <p className="text-xs font-bold leading-tight">{m.title}</p>
                <p className="text-[11px] text-brand-600 mt-1 font-bold">+{m.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card p-6 max-w-sm w-full shadow-premium">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-extrabold">Cancelar assinatura?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Você perderá acesso ao PREMIUM ao fim do período atual. Tem certeza?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 btn-ghost">
                Manter plano
              </button>
              <button
                onClick={cancelSubscription}
                disabled={canceling}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 shadow-soft"
              >
                {canceling ? "Cancelando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
