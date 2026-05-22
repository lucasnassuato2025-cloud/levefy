"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Flame, Lock, Sparkles, Trophy, Zap } from "lucide-react";
import Link from "next/link";

type Action = "water" | "meal" | "movement" | "mood";

type RetentionState = {
  completed: Action[];
  progress: number;
  xp: number;
  streakDays: number;
  streakRisk: boolean;
  message: string;
};

const ACTIONS: Array<{ id: Action; emoji: string; title: string; xp: number; desc: string }> = [
  { id: "water", emoji: "💧", title: "Água", xp: 15, desc: "hidratação" },
  { id: "meal", emoji: "🥗", title: "Alimentação", xp: 25, desc: "plano do dia" },
  { id: "movement", emoji: "🚶", title: "Movimento", xp: 20, desc: "corpo ativo" },
  { id: "mood", emoji: "🧠", title: "Humor", xp: 10, desc: "mente presente" },
];

export default function HabitLoopCenter({ user }: { user: any }) {
  const [state, setState] = useState<RetentionState | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Action[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [reminderSaved, setReminderSaved] = useState(false);

  const plan = user?.plan ?? "free";
  const isPaid = plan === "premium" || plan === "start";

  useEffect(() => {
    fetch("/api/retention/checkin")
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          setState(data);
          setSelected(data.completed ?? []);
        }
      })
      .catch(() => undefined);

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      setReminderSaved(localStorage.getItem("levefy_daily_reminder") === "true");
    }
  }, []);

  const completedSet = useMemo(() => new Set(state?.completed ?? []), [state]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const progress = state?.progress ?? Math.round((selectedSet.size / ACTIONS.length) * 100);

  function toggle(action: Action) {
    setSelected(current => current.includes(action) ? current.filter(item => item !== action) : [...current, action]);
  }

  async function saveCheckin() {
    setSaving(true);
    try {
      const res = await fetch("/api/retention/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: selected }),
      });
      const data = await res.json();
      if (data?.success) {
        const nextCompleted = Array.from(new Set([...(state?.completed ?? []), ...(data.completed ?? selected)])) as Action[];
        setState({
          completed: nextCompleted,
          progress: Math.round((nextCompleted.length / ACTIONS.length) * 100),
          xp: (state?.xp ?? user?.xp ?? 0) + (data.xpGained ?? 0),
          streakDays: data.streakDays ?? state?.streakDays ?? user?.streakDays ?? 0,
          streakRisk: false,
          message: data.message ?? "Check-in salvo. Você manteve sua transformação viva hoje.",
        });
        if (notificationPermission === "granted") {
          new Notification("Levefy", { body: data.message ?? "Check-in salvo 🔥", icon: "/favicon.ico" });
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function enableNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") {
      localStorage.setItem("levefy_daily_reminder", "true");
      setReminderSaved(true);
      new Notification("Levefy ativado 🔥", {
        body: "Seu lembrete diário está ligado. Volte hoje para proteger sua sequência.",
        icon: "/favicon.ico",
      });
    }
  }

  const streak = state?.streakDays ?? user?.streakDays ?? 0;
  const fomoText = state?.streakRisk
    ? "Sua sequência está em risco hoje. Um check-in salva seu progresso."
    : streak >= 3
    ? `Você já criou ${streak} dias de impulso. Não deixe essa identidade esfriar.`
    : "O objetivo é simples: aparecer hoje, ganhar XP e voltar amanhã.";

  return (
    <section className="mb-4 sm:mb-6 grid lg:grid-cols-[1.35fr_.85fr] gap-3 sm:gap-5">
      <div className="card relative overflow-hidden border-brand-100 p-3.5 sm:p-6">
        <div className="relative flex items-start justify-between gap-3 mb-3 sm:mb-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-700 sm:text-[11px]">Loop diário</p>
            <h2 className="mt-1 text-[1.08rem] font-extrabold leading-tight tracking-tight sm:text-2xl">Check-in de 30 segundos</h2>
            <p className="mt-1 max-w-xl text-[12px] leading-5 text-slate-500 sm:text-sm">{state?.message ?? "Marque pequenas vitórias para manter XP, sequência e vontade de voltar amanhã."}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-3 py-2 text-xs font-extrabold border border-orange-100">
            <Flame className="w-4 h-4" /> {streak}d streak
          </div>
        </div>

        <div className="relative mb-3 grid grid-cols-2 gap-2 sm:mb-5 sm:grid-cols-4 sm:gap-2.5">
          {ACTIONS.map(action => {
            const checked = selectedSet.has(action.id);
            const already = completedSet.has(action.id);
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggle(action.id)}
                className={`min-h-[82px] text-left rounded-2xl sm:rounded-3xl border-2 p-2.5 sm:min-h-[104px] sm:p-3.5 transition-all duration-200 ${checked
                  ? "border-brand-500 bg-brand-50 shadow-brand/20 shadow-lg -translate-y-0.5"
                  : "border-slate-100 bg-white hover:border-brand-200 hover:bg-brand-50/40"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg sm:text-2xl">{action.emoji}</span>
                  {checked || already ? <CheckCircle2 className="w-4 h-4 text-brand-600 sm:h-5 sm:w-5" /> : <span className="text-[9px] font-bold text-slate-400 sm:text-[10px]">+{action.xp} XP</span>}
                </div>
                <p className="text-[13px] font-extrabold leading-tight text-slate-900 sm:text-sm">{action.title}</p>
                <p className="hidden sm:block text-[11px] text-slate-500">{action.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="relative mb-3 sm:mb-5">
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>Check-in de hoje</span>
            <span className="text-brand-700">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full gradient-brand rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          {progress >= 100 && <p className="text-xs text-brand-700 font-bold mt-2">Bônus de consistência liberado: +30 XP 🎁</p>}
        </div>

        <button
          type="button"
          onClick={saveCheckin}
          disabled={saving || selected.length === 0}
          className="w-full min-h-11 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Salvando..." : "Salvar check-in"}
        </button>
      </div>

      <div className="hidden space-y-3 sm:space-y-4 lg:block">
        <div className={`rounded-3xl p-4 sm:p-5 border ${state?.streakRisk ? "bg-orange-50 border-orange-200" : "bg-slate-950 text-white border-slate-900"}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${state?.streakRisk ? "bg-orange-100" : "bg-white/10"}`}>
              <Zap className={`w-5 h-5 ${state?.streakRisk ? "text-orange-600" : "text-emerald-300"}`} />
            </div>
            <div>
              <p className={`text-[11px] uppercase tracking-widest font-extrabold ${state?.streakRisk ? "text-orange-700" : "text-emerald-300"}`}>Gatilho de retorno</p>
              <h3 className="font-extrabold">Não quebre a corrente</h3>
            </div>
          </div>
          <p className={`text-sm ${state?.streakRisk ? "text-orange-800" : "text-white/75"}`}>{fomoText}</p>
        </div>

        <div className="card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm">Lembrete diário</p>
              <p className="text-xs text-slate-500 mt-1">Ative notificações no navegador para o Levefy te puxar de volta ao hábito.</p>
              <button
                type="button"
                onClick={enableNotifications}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-xs font-extrabold px-4 py-2 disabled:opacity-60"
                disabled={notificationPermission === "granted" || notificationPermission === "unsupported"}
              >
                <Bell className="w-3.5 h-3.5" />
                {notificationPermission === "granted" || reminderSaved ? "Lembrete ativado" : notificationPermission === "unsupported" ? "Indisponível" : "Ativar lembrete"}
              </button>
            </div>
          </div>
        </div>

        {!isPaid && (
          <Link href="/membership" className="block card p-4 sm:p-5 bg-gradient-to-br from-slate-950 to-slate-800 text-white border-slate-800 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-extrabold text-amber-300">Premium loop</p>
                <h3 className="font-extrabold">IA ajusta seu plano todo dia</h3>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-3">Seu Free cria o hábito. O Premium usa seus check-ins para acelerar a transformação.</p>
            <span className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-300">Desbloquear evolução <Sparkles className="w-4 h-4" /></span>
          </Link>
        )}

        {isPaid && (
          <div className="card p-4 sm:p-5 bg-brand-50 border-brand-100">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-brand-700" />
              <p className="text-sm font-bold text-brand-900">Premium ativo: seus check-ins alimentam insights mais inteligentes.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
