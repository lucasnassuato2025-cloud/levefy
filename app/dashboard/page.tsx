"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import HabitLoopCenter from "@/components/HabitLoopCenter";
import { Flame, Droplets, Target, Trophy, TrendingUp, Zap, ChevronRight, Brain, Sparkles, ArrowRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { getLevelFromXP, getNextLevel, getXPProgress } from "@/lib/gamification";
import { trackConversion } from "@/lib/tracking";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [water, setWater] = useState(0);

  useEffect(() => {
    fetch("/api/user/me")
      .then(r => r.json())
      .then(d => {
        setUser(d.user ?? null);
        setWater(d.waterToday ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const checkoutSuccess = params.get("checkout") === "success" || params.get("success") === "true";
    if (!checkoutSuccess) return;

    const trackingKey = `levefy_purchase_${window.location.search}`;
    if (window.sessionStorage.getItem(trackingKey)) return;
    window.sessionStorage.setItem(trackingKey, "1");

    const planFromUrl = (params.get("plan") ?? "PREMIUM").toUpperCase();
    const value = planFromUrl === "START" ? 27 : 19;
    trackConversion("Purchase", {
      content_name: `Levefy ${planFromUrl}`,
      currency: "BRL",
      value,
    });

    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const xp = user?.xp ?? 0;
  const streak = user?.streakDays ?? 0;
  const plan = user?.plan ?? "free";
  const isPaid = plan === "premium" || plan === "start";
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const level = getLevelFromXP(xp);
  const nextLevel = getNextLevel(xp);
  const xpProgress = getXPProgress(xp);
  const waterTarget = 2500;
  const waterPct = Math.min(100, Math.round((water / waterTarget) * 100));

  const weightData = user?.progress?.slice(-7).map((p: any, i: number) => ({
    day: ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][i % 7],
    weight: p.weight ?? 0,
  })) ?? [];

  const calData = user?.progress?.slice(-7).map((p: any, i: number) => ({
    day: ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][i % 7],
    cal: p.calories ?? 0,
  })) ?? [];

  const hasProgress = weightData.length > 0;
  const onboardingComplete = Boolean(user?.currentWeight && user?.height && user?.age && user?.goal && user?.activityLevel);
  const firstName = user?.name?.split(" ")?.[0] || "Você";
  const primaryAction = onboardingComplete
    ? { href: "/meal-ai", label: "Gerar plano", sub: "Plano do dia em poucos segundos", icon: Brain }
    : { href: "/onboarding", label: "Fazer quiz", sub: "Libere metas e painel personalizado", icon: Sparkles };
  const PrimaryActionIcon = primaryAction.icon;

  if (loading) return (
    <AppShell title="Painel">
      <div className="space-y-3 sm:space-y-4">
        <div className="skeleton h-28 sm:h-32 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 sm:h-24 w-full" />)}
        </div>
        <div className="skeleton h-40 w-full" />
      </div>
    </AppShell>
  );

  return (
    <AppShell title="Painel">
      {/* XP + Level hero */}
      <div className="card card-premium p-3.5 sm:p-7 mb-3 sm:mb-6 relative overflow-hidden">
        <div className="relative flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl gradient-brand flex items-center justify-center text-xl sm:text-3xl shadow-brand">
                {level.emoji}
              </div>
              <span className="absolute -inset-1 rounded-2xl animate-pulse-ring" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] text-brand-700 font-bold uppercase tracking-[0.14em] truncate">{level.title}</p>
              <p className="font-extrabold text-base sm:text-2xl tracking-tight">
                Nível {level.level} <span className="text-slate-400 font-bold">·</span>{" "}
                <span className="text-gradient-soft">{xp} XP</span>
              </p>
              {nextLevel && (
                <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
                  Faltam <strong className="text-slate-700">{nextLevel.xpMin - xp} XP</strong> para o Nível {nextLevel.level}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white border border-orange-100 shadow-soft">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-700 text-xs sm:text-sm">
              {streak > 0 ? `${streak}d` : "Hoje"}
            </span>
          </div>
        </div>
        {nextLevel && (
          <div className="relative mt-3 sm:mt-5">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
              <span>Progresso do nível</span>
              <span className="text-brand-700 font-bold">{xpProgress}%</span>
            </div>
            <div className="h-2.5 bg-white/70 rounded-full overflow-hidden border border-brand-100">
              <div
                className="h-full gradient-brand rounded-full transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden mb-3 rounded-[1.35rem] bg-slate-950 text-white p-3.5 shadow-premium">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-300">Hoje</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight">{primaryAction.label}</h2>
            <p className="mt-0.5 text-xs text-white/65">{primaryAction.sub}</p>
          </div>
          <Link
            href={primaryAction.href}
            aria-label={primaryAction.label}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-brand shadow-brand"
          >
            <PrimaryActionIcon className="h-4 w-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Onboarding conversion banner */}
      {!onboardingComplete && (
        <Link
          href="/onboarding"
          className="group block mb-3 sm:mb-6 rounded-[1.35rem] sm:rounded-[2rem] bg-slate-950 text-white p-3.5 sm:p-7 relative overflow-hidden shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.38),transparent_60%)]" />
          <div className="relative flex items-center justify-between gap-4 sm:gap-5 flex-wrap">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-brand shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-300 mb-1">Ative sua transformação IA</p>
                <h2 className="text-base sm:text-2xl font-extrabold tracking-tight">{firstName}, falta seu quiz.</h2>
                <p className="hidden sm:block text-sm text-white/70 mt-1 max-w-xl">
                  Complete seu perfil emocional para liberar projeção 30/90 dias, metas reais e um painel feito para seu objetivo.
                </p>
              </div>
            </div>
            <span className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-white text-slate-950 px-4 py-2.5 text-sm font-extrabold group-hover:scale-105 transition-transform">
              Começar quiz <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
        {[
          { icon: Target,     label: "Meta calórica", value: user?.goal ? "Definida" : "Não definida", sub: "configure no perfil", color: "text-brand-600", bg: "bg-brand-50" },
          { icon: TrendingUp, label: "Peso atual",    value: user?.currentWeight ? `${user.currentWeight}kg` : "—", sub: "atualize no perfil", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Trophy,     label: "XP total",      value: `${xp} XP`, sub: level.title, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Flame,      label: "Streak",        value: streak > 0 ? `${streak}d` : "0d", sub: "dias seguidos", color: "text-orange-500", bg: "bg-orange-50" },
        ].map(s => (
          <div key={s.label} className="card card-hover p-3 sm:p-5 group">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl ${s.bg} flex items-center justify-center mb-2 sm:mb-3 transition-transform group-hover:scale-110`}>
              <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-base sm:text-2xl font-extrabold mt-0.5 sm:mt-1 tracking-tight">{s.value}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">{s.sub}</p>
          </div>
        ))}
      </div>

      <HabitLoopCenter user={user} />

      {/* Water tracker */}
      <div className="card p-3.5 sm:p-6 mb-3 sm:mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Hidratação</h3>
              <p className="text-[11px] text-slate-400">Meta diária: {waterTarget}ml</p>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-blue-600">{water}<span className="text-slate-400 font-medium">/{waterTarget}ml</span></span>
        </div>
        <div className="h-3 bg-blue-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${waterPct}%` }}
          />
        </div>
        <div className="flex gap-2 mt-3 sm:mt-4">
          {[150, 250, 500].map(ml => (
            <button
              key={ml}
              onClick={() => setWater(w => Math.min(waterTarget, w + ml))}
              className="flex-1 min-h-10 py-2 rounded-2xl text-xs font-bold border border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 hover:-translate-y-0.5 transition-all duration-200"
            >
              + {ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {hasProgress ? (
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 mb-4 sm:mb-6">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-base">📉</span> Peso · últimos 7 dias
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={weightData}>
                <defs>
                  <linearGradient id="weightLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#065f46" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto","auto"]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v: number) => [`${v}kg`, "Peso"]}
                />
                <Line type="monotone" dataKey="weight" stroke="url(#weightLine)" strokeWidth={3} dot={{ fill: "#16a34a", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="text-base">🔥</span> Calorias · últimos 7 dias
            </h3>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={calData}>
                <defs>
                  <linearGradient id="calBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v: number) => [`${v} kcal`, "Calorias"]}
                />
                <Bar dataKey="cal" fill="url(#calBar)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
          <div className="card p-5 sm:p-10 mb-3 sm:mb-6 text-center border-2 border-dashed border-slate-200 bg-white/50">
          <div className="text-4xl sm:text-5xl mb-3">📊</div>
          <p className="font-semibold text-slate-700">Seus gráficos aparecerão aqui</p>
          <p className="text-sm text-slate-400 mt-1">Comece a usar o Levefy para ver seu progresso!</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
        <Link href="/meal-ai" className="card card-hover p-3.5 sm:p-6 group flex sm:block items-center gap-3">
          <div className="w-10 h-10 gradient-brand rounded-2xl flex items-center justify-center sm:mb-4 shadow-brand group-hover:scale-110 transition-transform shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm">Gerar plano hoje</p>
            <p className="text-xs text-slate-500 mt-1">Meal AI personalizado em segundos</p>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-500 sm:mt-4 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link href="/challenge" className="card card-hover p-3.5 sm:p-6 group flex sm:block items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm">Desafio 21 dias</p>
            <p className="text-xs text-slate-500 mt-1">{streak > 0 ? `Dia ${streak} de 21` : "Comece agora!"}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-orange-400 sm:mt-4 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link href="/recipes" className="card card-hover p-3.5 sm:p-6 group flex sm:block items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm">Receitas de hoje</p>
            <p className="text-xs text-slate-500 mt-1">Explore receitas saudáveis</p>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-400 sm:mt-4 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>

      {/* Upgrade CTA */}
      {!isPaid && (
        <div className="mt-3 sm:mt-6 card p-3.5 sm:p-6 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap relative overflow-hidden shadow-premium">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <p className="font-extrabold text-lg tracking-tight">Desbloqueie o potencial completo 🚀</p>
            <p className="text-sm text-white/85 mt-1">Meal AI ilimitado, receitas exclusivas e muito mais</p>
          </div>
          <Link
            href="/membership"
            className="relative w-full sm:w-auto justify-center inline-flex bg-white text-brand-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-200 shrink-0 shadow-soft"
          >
            Ver planos
          </Link>
        </div>
      )}
    </AppShell>
  );
}
