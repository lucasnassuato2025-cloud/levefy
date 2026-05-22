"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Crown,
  Droplets,
  Flame,
  Footprints,
  Salad,
  Smile,
  Sparkles,
  Target,
  Trophy,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { getLevelFromXP, getXPProgress } from "@/lib/gamification";

type Action = "water" | "meal" | "movement" | "mood";

type MobileDashboardProps = {
  user: any;
  water: number;
  setWater: Dispatch<SetStateAction<number>>;
  waterTarget: number;
  onboardingComplete: boolean;
  isPaid: boolean;
  primaryAction: {
    href: string;
    label: string;
    sub: string;
    icon: LucideIcon;
  };
};

const ACTIONS: Array<{ id: Action; label: string; points: number; icon: LucideIcon; tone: string }> = [
  { id: "water", label: "Agua", points: 15, icon: Droplets, tone: "bg-sky-50 text-sky-600" },
  { id: "meal", label: "Alimentacao", points: 25, icon: Salad, tone: "bg-emerald-50 text-emerald-600" },
  { id: "movement", label: "Movimento", points: 20, icon: Footprints, tone: "bg-amber-50 text-amber-600" },
  { id: "mood", label: "Humor", points: 10, icon: Smile, tone: "bg-rose-50 text-rose-600" },
];

export default function MobileDashboard({
  user,
  water,
  setWater,
  waterTarget,
  onboardingComplete,
  isPaid,
  primaryAction,
}: MobileDashboardProps) {
  const [completed, setCompleted] = useState<Action[]>([]);
  const [selected, setSelected] = useState<Action[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const xp = user?.xp ?? 0;
  const streak = user?.streakDays ?? 0;
  const level = getLevelFromXP(xp);
  const xpProgress = getXPProgress(xp);
  const firstName = user?.name?.split(" ")?.[0] || "Voce";
  const plan = user?.plan ?? "free";
  const waterPct = Math.min(100, Math.round((water / waterTarget) * 100));
  const PrimaryActionIcon = primaryAction.icon;

  useEffect(() => {
    fetch("/api/retention/checkin")
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          const done = data.completed ?? [];
          setCompleted(done);
          setSelected(done);
          setMessage(data.message ?? "");
        }
      })
      .catch(() => undefined);
  }, []);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const completedSet = useMemo(() => new Set(completed), [completed]);
  const checkinProgress = Math.round((selectedSet.size / ACTIONS.length) * 100);

  const toggleAction = (action: Action) => {
    setSelected(current =>
      current.includes(action) ? current.filter(item => item !== action) : [...current, action]
    );
  };

  const saveCheckin = async () => {
    if (!selected.length) return;
    setSaving(true);
    try {
      const res = await fetch("/api/retention/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: selected }),
      });
      const data = await res.json();
      if (data?.success) {
        const nextCompleted = Array.from(new Set([...(completed ?? []), ...(data.completed ?? selected)])) as Action[];
        setCompleted(nextCompleted);
        setSelected(nextCompleted);
        setMessage(data.message ?? "Check-in salvo. Sua rotina segue ativa hoje.");
      }
    } finally {
      setSaving(false);
    }
  };

  const planLabel = plan === "premium" ? "Premium" : plan === "start" ? "START" : "Free";

  return (
    <div className="space-y-3.5">
      <section className="overflow-hidden rounded-[1.65rem] bg-slate-950 p-4 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.8)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">Painel Levefy</p>
            <h1 className="mt-1 text-[1.45rem] font-extrabold leading-tight tracking-tight">
              Oi, {firstName}
            </h1>
            <p className="mt-1 max-w-[15rem] text-xs leading-5 text-white/62">
              Sua rotina de hoje em uma tela simples.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Plano</p>
            <p className="text-sm font-extrabold text-emerald-200">{planLabel}</p>
          </div>
        </div>

        <Link
          href={primaryAction.href}
          className="mt-4 flex items-center justify-between rounded-2xl bg-white p-3 text-slate-950 shadow-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-brand shadow-brand">
              <PrimaryActionIcon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{primaryAction.label}</p>
              <p className="truncate text-[11px] text-slate-500">{primaryAction.sub}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-brand-600" />
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-2.5">
        <div className="rounded-[1.35rem] border border-white bg-white p-3 shadow-sm">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Trophy className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{level.title}</p>
          <p className="mt-0.5 text-lg font-extrabold">Nivel {level.level}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full gradient-brand" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-white bg-white p-3 shadow-sm">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
            <Flame className="h-4 w-4" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Streak</p>
          <p className="mt-0.5 text-lg font-extrabold">{streak > 0 ? `${streak} dias` : "Comece hoje"}</p>
          <p className="mt-1 text-[11px] text-slate-500">{xp} XP acumulado</p>
        </div>
      </section>

      {!onboardingComplete && (
        <Link
          href="/onboarding"
          className="flex items-center justify-between rounded-[1.35rem] bg-white p-3.5 shadow-sm ring-1 ring-brand-100"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-brand">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Finalize seu perfil</p>
              <p className="text-[11px] text-slate-500">Libere metas e plano personalizado.</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-brand-600" />
        </Link>
      )}

      <section className="rounded-[1.45rem] border border-white bg-white p-3.5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-700">Loop diario</p>
            <h2 className="text-base font-extrabold tracking-tight">Check-in rapido</h2>
          </div>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-extrabold text-brand-700">
            {checkinProgress}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ACTIONS.map(action => {
            const Icon = action.icon;
            const active = selectedSet.has(action.id);
            const already = completedSet.has(action.id);

            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggleAction(action.id)}
                className={`min-h-[68px] rounded-2xl border p-2.5 text-left transition ${
                  active ? "border-brand-400 bg-brand-50 shadow-sm" : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-xl ${action.tone}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {active || already ? (
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">+{action.points}</span>
                  )}
                </div>
                <p className="text-xs font-extrabold text-slate-900">{action.label}</p>
              </button>
            );
          })}
        </div>

        {message && <p className="mt-3 text-[11px] leading-4 text-slate-500">{message}</p>}

        <button
          type="button"
          onClick={saveCheckin}
          disabled={saving || selected.length === 0}
          className="mt-3 flex min-h-10 w-full items-center justify-center rounded-full gradient-brand px-4 text-sm font-extrabold text-white shadow-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar check-in"}
        </button>
      </section>

      <section className="rounded-[1.45rem] border border-white bg-white p-3.5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Hidratacao</p>
              <p className="text-[11px] text-slate-500">Meta diaria {waterTarget}ml</p>
            </div>
          </div>
          <p className="text-xs font-extrabold text-sky-600">{water}ml</p>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-sky-50">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${waterPct}%` }} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[150, 250, 500].map(ml => (
            <button
              key={ml}
              type="button"
              onClick={() => setWater(value => Math.min(waterTarget, value + ml))}
              className="min-h-10 rounded-2xl bg-sky-50 text-xs font-extrabold text-sky-700"
            >
              +{ml}ml
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        {[
          { href: "/meal-ai", label: "Meal AI", icon: Brain, color: "bg-brand-50 text-brand-700" },
          { href: "/recipes", label: "Receitas", icon: UtensilsCrossed, color: "bg-amber-50 text-amber-700" },
          { href: "/challenge", label: "Desafio", icon: Zap, color: "bg-orange-50 text-orange-600" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="rounded-[1.25rem] border border-white bg-white p-3 text-center shadow-sm">
            <span className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-700">{item.label}</span>
          </Link>
        ))}
      </section>

      {!isPaid && (
        <Link
          href="/membership"
          className="flex items-center justify-between rounded-[1.45rem] bg-slate-950 p-3.5 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.8)]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Crown className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Desbloquear Premium</p>
              <p className="text-[11px] text-white/60">IA ilimitada, receitas e desafios.</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-300" />
        </Link>
      )}

      <section className="rounded-[1.45rem] border border-brand-100 bg-brand-50/70 p-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">Foco de hoje</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-600">
              Abra o Meal AI, escolha uma refeicao simples e marque seu check-in antes de dormir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
