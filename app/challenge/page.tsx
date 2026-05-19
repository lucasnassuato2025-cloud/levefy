"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Check, Lock, Flame, Trophy, Star, Loader2 } from "lucide-react";
import Link from "next/link";

const CHALLENGE_TASKS = [
  { title: "Hidratação matinal", desc: "500ml de água nos primeiros 30 min após acordar.", icon: "💧" },
  { title: "Movimente o corpo", desc: "20 minutos de caminhada ou qualquer exercício.", icon: "🏃‍♀️" },
  { title: "Refeição saudável", desc: "Prepare uma receita Levefy hoje.", icon: "🥗" },
  { title: "Noite consciente", desc: "10 min de alongamento + dormir antes das 23h.", icon: "🌙" },
];

const MILESTONES = [
  { day: 1,  title: "Primeiro passo!",          sub: "Esse é o mais difícil. Você conseguiu.",  emoji: "🌱" },
  { day: 7,  title: "Uma semana inteira!",       sub: "Seu hábito está se formando.",            emoji: "🔥" },
  { day: 14, title: "14 dias de consistência.",  sub: "Você é mais forte que suas desculpas.",  emoji: "💪" },
  { day: 21, title: "Missão cumprida!",          sub: "Você criou um hábito real.",              emoji: "🏆" },
];

export default function ChallengePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completedDays, setCompletedDays] = useState(0);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [todayDone, setTodayDone] = useState(false);
  const [plan, setPlan] = useState("free");
  const total = 21;
  const pct = Math.round((completedDays / total) * 100);

  useEffect(() => {
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        setCompletedDays(d.user?.streakDays ?? 0);
        setPlan(d.user?.plan ?? "free");
        // Check if already completed today
        const today = new Date().toDateString();
        const lastActive = d.user?.lastActiveAt ? new Date(d.user.lastActiveAt).toDateString() : null;
        setTodayDone(lastActive === today && (d.user?.streakDays ?? 0) > 0);
        setLoading(false);
      });
  }, []);

  const toggle = (i: number) => {
    if (todayDone) return;
    setChecked(p => {
      const n = new Set(p);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const completeDay = async () => {
    if (checked.size < CHALLENGE_TASKS.length) {
      alert("Complete todas as tarefas do dia antes de confirmar!");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/challenge/complete", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCompletedDays(data.streakDays);
        setTodayDone(true);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const isPaid = plan === "premium" || plan === "start";

  if (loading) return (
    <AppShell title="Desafio 21 Dias">
      <div className="card p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando seu desafio...
      </div>
    </AppShell>
  );

  // Free users see teaser
  if (!isPaid && completedDays === 0) {
    return (
      <AppShell title="Desafio 21 Dias">
        <div className="card p-8 text-center max-w-md mx-auto">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="font-bold text-xl mb-2">Transforme seus hábitos em 21 dias</h2>
          <p className="text-slate-500 text-sm mb-6">
            O Desafio 21 Dias é exclusivo para assinantes. Complete tarefas diárias, ganhe XP e construa hábitos saudáveis de verdade.
          </p>
          <Link href="/membership" className="btn-primary inline-flex">
            Desbloquear desafio
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Desafio 21 Dias">
      {/* Progress hero */}
      <div className="card p-5 sm:p-7 mb-6 gradient-brand-soft border border-brand-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-brand-600" />
              <span className="text-xs sm:text-sm font-semibold text-brand-700 uppercase tracking-wider">Progresso atual</span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold">
              Dia {completedDays} <span className="text-slate-400 text-xl sm:text-2xl">/ {total}</span>
            </p>
            <p className="text-slate-500 mt-1 text-sm">
              {completedDays >= total ? "🎉 Desafio concluído!" : `${total - completedDays} dias restantes`}
            </p>
          </div>
          <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 absolute">
              <circle cx="50" cy="50" r="42" stroke="#dcfce7" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="#16a34a" strokeWidth="10" fill="none"
                strokeDasharray={`${pct * 2.64} 999`} strokeLinecap="round" />
            </svg>
            <span className="relative font-extrabold text-xl sm:text-2xl text-brand-700">{pct}%</span>
          </div>
        </div>

        {/* Day grid */}
        <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const day = i + 1;
            const done = day <= completedDays;
            const today = day === completedDays + 1;
            return (
              <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center font-bold transition ${
                done ? "gradient-brand text-white shadow-sm" :
                today ? "bg-brand-50 text-brand-700 border-2 border-brand-600" :
                "bg-white text-slate-300 border border-slate-100"
              }`}>
                {done ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> :
                 today ? <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> :
                 <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="text-[8px] sm:text-[9px] mt-0.5">D{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's tasks */}
      {completedDays < total && (
        <>
          <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            {todayDone ? "Tarefas de hoje — Concluídas! ✅" : `Tarefas de hoje (Dia ${completedDays + 1})`}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {CHALLENGE_TASKS.map((task, i) => (
              <button key={i} onClick={() => toggle(i)} disabled={todayDone}
                className={`card p-4 sm:p-5 flex gap-3 sm:gap-4 text-left transition hover:shadow-md ${
                  checked.has(i) || todayDone ? "border-brand-300 bg-brand-50/30" : ""
                } ${todayDone ? "cursor-default" : "cursor-pointer"}`}>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition text-lg ${
                  checked.has(i) || todayDone ? "gradient-brand" : "bg-slate-100"
                }`}>
                  {checked.has(i) || todayDone
                    ? <Check className="w-4 h-4 text-white" />
                    : task.icon}
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm ${checked.has(i) || todayDone ? "line-through text-slate-400" : ""}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {!todayDone && (
            <button onClick={completeDay} disabled={saving || checked.size < CHALLENGE_TASKS.length}
              className="btn-primary w-full mb-8 disabled:opacity-50 gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "✅ Confirmar dia concluído"}
            </button>
          )}
        </>
      )}

      {/* Milestones */}
      <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500" /> Marcos do desafio
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {MILESTONES.map(m => (
          <div key={m.day} className={`card p-4 sm:p-5 ${completedDays >= m.day ? "border-brand-200 bg-brand-50/30" : ""}`}>
            <div className="text-2xl mb-2">{m.emoji}</div>
            <div className={`text-lg sm:text-2xl font-extrabold mb-1 ${completedDays >= m.day ? "text-brand-600" : "text-slate-300"}`}>
              Dia {m.day}
            </div>
            <p className="font-semibold text-xs sm:text-sm">{m.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.sub}</p>
            {completedDays >= m.day && <Check className="w-4 h-4 text-brand-600 mt-2" />}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
