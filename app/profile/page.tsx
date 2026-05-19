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

  if (loading) return <AppShell title="Perfil"><div className="card p-8 text-center text-slate-400">Carregando...</div></AppShell>;

  return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Stats card */}
        <div className="card p-6 text-center">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            {avatar ? (
              <img src={avatar} alt="Foto de perfil" className="w-20 h-20 rounded-full object-cover border-4 border-brand-100 shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-full gradient-brand flex items-center justify-center text-4xl shadow-lg shadow-brand-600/20">
                {level.emoji}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <p className="font-bold text-xl">{form.name || "Usuário"}</p>
          <p className="text-sm text-slate-500 mt-0.5">{level.title} · Nível {level.level}</p>

          {/* Plan badge */}
          <div className="mt-3">
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            )}
            {isStart && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                ⚡ START
              </span>
            )}
            {!isPremium && !isStart && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                Plano Free
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-brand-50 p-3">
              <p className="text-xl font-bold text-brand-700">{xp}</p>
              <p className="text-xs text-brand-600">XP total</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3">
              <p className="text-xl font-bold text-orange-600">{streak > 0 ? `${streak}🔥` : "0"}</p>
              <p className="text-xs text-orange-500">Streak</p>
            </div>
          </div>

          {/* Cancel subscription */}
          {isPremium && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition mx-auto">
                <CreditCard className="w-3.5 h-3.5" /> Cancelar assinatura
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-6 space-y-4">
          <h3 className="font-semibold text-lg">Dados pessoais</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "name",   l: "Nome completo",  t: "text",   p: "Seu nome",  span: 2 },
              { k: "weight", l: "Peso atual (kg)", t: "number", p: "70",        span: 1 },
              { k: "height", l: "Altura (cm)",     t: "number", p: "165",       span: 1 },
              { k: "age",    l: "Idade",           t: "number", p: "30",        span: 1 },
            ].map(f => (
              <div key={f.k} className={f.span === 2 ? "col-span-2" : ""}>
                <label className="text-xs text-slate-500 mb-1 block">{f.l}</label>
                <input
                  type={f.t} placeholder={f.p} value={form[f.k as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Sexo</label>
              <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500">
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Objetivo</label>
              <select value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-brand-500">
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
        <div className="lg:col-span-3 card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Conquistas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MEDALS.map(m => (
              <div key={m.id} className="text-center p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-sm transition">
                <div className="text-3xl mb-2">{m.emoji}</div>
                <p className="text-xs font-semibold">{m.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">+{m.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold">Cancelar assinatura?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Você perderá acesso ao PREMIUM ao fim do período atual. Tem certeza?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)}
                className="flex-1 btn-ghost">Manter plano</button>
              <button onClick={cancelSubscription} disabled={canceling}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-full transition disabled:opacity-60">
                {canceling ? "Cancelando..." : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
