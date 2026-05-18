"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Check, Lock, Flame, Trophy, Star } from "lucide-react";

const CHALLENGE_TASKS = [
  { title: "Hidratação matinal", desc: "500ml de água nos primeiros 30 min após acordar." },
  { title: "Movimente o corpo", desc: "20 minutos de caminhada ou qualquer exercício." },
  { title: "Refeição saudável", desc: "Prepare uma receita Levefy hoje." },
  { title: "Noite consciente", desc: "10 min de alongamento + dormir antes das 23h." },
];

const MILESTONES = [
  { day: 1,  title: "Hoje você começa.",              sub: "Esse é o passo mais difícil." },
  { day: 7,  title: "Uma semana inteira!",            sub: "Seu hábito está se formando." },
  { day: 14, title: "14 dias de consistência.",       sub: "Você é mais forte que suas desculpas." },
  { day: 21, title: "Missão cumprida! 🏆",            sub: "Você criou um hábito real." },
];

export default function ChallengePage() {
  const [completed, setCompleted] = useState(14);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const total = 21;
  const pct = Math.round((completed / total) * 100);

  const toggle = (i: number) => setChecked(p => {
    const n = new Set(p);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  return (
    <AppShell title="Desafio 21 Dias">
      {/* Progress hero */}
      <div className="card p-7 mb-6 gradient-brand-soft border border-brand-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700 uppercase tracking-wider">Progresso atual</span>
            </div>
            <p className="text-4xl font-extrabold">Dia {completed} <span className="text-slate-400 text-2xl">/ {total}</span></p>
            <p className="text-slate-500 mt-1">{total - completed} dias restantes para completar</p>
          </div>
          <div className="w-28 h-28 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 absolute">
              <circle cx="50" cy="50" r="42" stroke="#dcfce7" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="#16a34a" strokeWidth="10" fill="none"
                strokeDasharray={`${pct * 2.64} 999`} strokeLinecap="round" />
            </svg>
            <span className="relative font-extrabold text-2xl text-brand-700">{pct}%</span>
          </div>
        </div>

        {/* Day grid */}
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const day = i + 1;
            const done = day <= completed;
            const today = day === completed + 1;
            return (
              <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition ${
                done ? "gradient-brand text-white shadow-sm" : today ? "bg-brand-50 text-brand-700 border-2 border-brand-600" : "bg-white text-slate-300 border border-slate-100"
              }`}>
                {done ? <Check className="w-3.5 h-3.5" /> : today ? <Flame className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                <span className="text-[9px] mt-0.5">D{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's tasks */}
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" /> Tarefas de hoje (Dia {completed + 1})
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {CHALLENGE_TASKS.map((task, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`card p-5 flex gap-4 text-left transition hover:shadow-md ${checked.has(i) ? "border-brand-300 bg-brand-50/30" : ""}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
              checked.has(i) ? "gradient-brand" : "bg-slate-100"
            }`}>
              <Check className={`w-5 h-5 ${checked.has(i) ? "text-white" : "text-slate-400"}`} />
            </div>
            <div>
              <p className={`font-semibold ${checked.has(i) ? "line-through text-slate-400" : ""}`}>{task.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{task.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Milestones */}
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500" /> Marcos do desafio
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MILESTONES.map(m => (
          <div key={m.day} className={`card p-5 ${completed >= m.day ? "border-brand-200 bg-brand-50/30" : ""}`}>
            <div className={`text-2xl font-extrabold mb-1 ${completed >= m.day ? "text-brand-600" : "text-slate-300"}`}>
              Dia {m.day}
            </div>
            <p className="font-semibold text-sm">{m.title}</p>
            <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
            {completed >= m.day && <Check className="w-4 h-4 text-brand-600 mt-2" />}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
