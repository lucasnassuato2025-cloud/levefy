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

  if (!isPaid && completedDays === 0) {
    return (
      <AppShell title="Desafio 21 Dias">
        <div className="card card-premium p-10 text-center max-w-md mx-auto shadow-premium">
          <div className="w-20 h-20 mx-auto rounded-3xl gradient-brand flex items-center justify-center text-5xl mb-5 shadow-brand">
            🏆
          </div>
          <h2 className="font-extrabold text-2xl tracking-tight mb-2">Transforme seus hábitos em 21 dias</h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
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
      <div className="card card-premium p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="w-4 h-4 text-brand-700" />
              <span className="text-[11px] font-extrabold text-brand-700 uppercase tracking-[0.16em]">
                Progresso atual
              </span>
            </div>
            <p className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Dia <span className="text-gradient-soft">{completedDays}</span>
              <span className="text-slate-300 text-xl sm:text-2xl font-bold"> / {total}</span>
            </p>
            <p className="text-slate-500 mt-2 text-sm">
              {completedDays >= total ? "🎉 Desafio concluído!" : `${total - completedDays} dias restantes para sua transformação`}
            </p>
          </div>
          <div className="w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 absolute">
              <defs>
                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" stroke="#dcfce7" strokeWidth="10" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                stroke="url(#ring)" strokeWidth="10" fill="none"
                strokeDasharray={`${pct * 2.64} 999`}
                strokeLinecap="round"
              />
            </svg>
            <span className="relative font-extrabold text-2xl sm:text-3xl text-gradient-soft">{pct}%</span>
          </div>
        </div>

        {/* Day grid */}
        <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const day = i + 1;
            const done = day <= completedDays;
            const today = day === completedDays + 1;
            return (
              <div
                key={day}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-200 ${
                  done
                    ? "gradient-brand text-white shadow-brand"
                    : today
                      ? "bg-white text-brand-700 border-2 border-brand-500 shadow-sm"
                      : "bg-white/60 text-slate-300 border border-slate-100"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> :
                 today ? <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> :
                 <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="text-[8px] sm:text-[10px] mt-0.5 font-extrabold">D{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's tasks */}
      {completedDays < total && (
        <>
          <h2 className="font-extrabold text-base sm:text-lg mb-4 flex items-center gap-2 tracking-tight">
            <Flame className="w-5 h-5 text-orange-500" />
            {todayDone ? "Tarefas de hoje — Concluídas! ✅" : `Tarefas de hoje · Dia ${completedDays + 1}`}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {CHALLENGE_TASKS.map((task, i) => {
              const isChecked = checked.has(i) || todayDone;
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  disabled={todayDone}
                  className={`card p-5 flex gap-4 text-left transition-all duration-200 hover:shadow-md ${
                    isChecked ? "border-brand-200 bg-brand-50/40" : "card-hover"
                  } ${todayDone ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 text-xl ${
                      isChecked ? "gradient-brand shadow-brand" : "bg-slate-50"
                    }`}
                  >
                    {isChecked ? <Check className="w-5 h-5 text-white" /> : task.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm tracking-tight ${isChecked ? "line-through text-slate-400" : ""}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {!todayDone && (
            <button
              onClick={completeDay}
              disabled={saving || checked.size < CHALLENGE_TASKS.length}
              className="btn-primary w-full mb-10 gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                : "✅ Confirmar dia concluído"}
            </button>
          )}
        </>
      )}

      {/* Milestones */}
      <h2 className="font-extrabold text-base sm:text-lg mb-4 flex items-center gap-2 tracking-tight">
        <Star className="w-5 h-5 text-amber-500" /> Marcos do desafio
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {MILESTONES.map(m => {
          const reached = completedDays >= m.day;
          return (
            <div
              key={m.day}
              className={`card p-5 transition-all duration-200 ${
                reached ? "border-brand-200 bg-brand-50/30 shadow-soft" : "card-hover"
              }`}
            >
              <div className="text-3xl mb-2">{m.emoji}</div>
              <div className={`text-xl sm:text-2xl font-extrabold mb-1 tracking-tight ${
                reached ? "text-gradient-soft" : "text-slate-300"
              }`}>
                Dia {m.day}
              </div>
              <p className="font-bold text-xs sm:text-sm">{m.title}</p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">{m.sub}</p>
              {reached && (
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Conquistado
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
