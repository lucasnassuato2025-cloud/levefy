"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { User, Save, Trophy, Flame } from "lucide-react";
import { getLevelFromXP, MEDALS } from "@/lib/gamification";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", weight: "", height: "", age: "", gender: "feminino", goal: "emagrecimento", activityLevel: "moderate" });
  const [saved, setSaved] = useState(false);
  const xp = 340;
  const streak = 7;
  const level = getLevelFromXP(xp);

  const save = async () => {
    // would POST to /api/profile
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats card */}
        <div className="card p-6 text-center">
          <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center text-3xl mx-auto mb-3">
            {level.emoji}
          </div>
          <p className="font-bold text-lg">{form.name || "Usuário"}</p>
          <p className="text-sm text-slate-500">{level.title} · Nível {level.level}</p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-brand-50 p-3">
              <p className="text-xl font-bold text-brand-700">{xp}</p>
              <p className="text-xs text-brand-600">XP total</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3">
              <p className="text-xl font-bold text-orange-600">{streak}🔥</p>
              <p className="text-xs text-orange-500">Streak</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 card p-6 space-y-4">
          <h3 className="font-semibold">Dados pessoais</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "name",   l: "Nome completo",   t: "text",   p: "Seu nome",   span: 2 },
              { k: "weight", l: "Peso atual (kg)",  t: "number", p: "70",         span: 1 },
              { k: "height", l: "Altura (cm)",      t: "number", p: "165",        span: 1 },
              { k: "age",    l: "Idade",             t: "number", p: "30",         span: 1 },
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
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="manutencao">Manutenção</option>
                <option value="low_carb">Low Carb</option>
                <option value="definicao">Definição</option>
              </select>
            </div>
          </div>
          <button onClick={save} className="btn-primary gap-2 mt-2">
            <Save className="w-4 h-4" /> {saved ? "Salvo!" : "Salvar perfil"}
          </button>
        </div>

        {/* Medals */}
        <div className="lg:col-span-3 card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Conquistas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MEDALS.map(m => (
              <div key={m.id} className="text-center p-3 rounded-2xl border border-slate-100 hover:border-brand-200 transition">
                <div className="text-3xl mb-2">{m.emoji}</div>
                <p className="text-xs font-semibold">{m.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">+{m.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
