"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Flame, Droplets, Target, Trophy, TrendingUp, Zap, ChevronRight, Brain, Lock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { getLevelFromXP, getNextLevel, getXPProgress } from "@/lib/gamification";

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

  if (loading) return (
    <AppShell title="Painel">
      <div className="card p-8 text-center text-slate-400">Carregando seu painel...</div>
    </AppShell>
  );

  return (
    <AppShell title="Painel">
      {/* XP + Level banner */}
      <div className="card p-5 gradient-brand-soft border border-brand-100 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-2xl shadow-lg shadow-brand-600/20">
              {level.emoji}
            </div>
            <div>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider">{level.title}</p>
              <p className="font-bold text-lg">Nível {level.level} · {xp} XP</p>
              {nextLevel && <p className="text-xs text-slate-500">Faltam {nextLevel.xpMin - xp} XP para Nível {nextLevel.level}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-orange-700">{streak > 0 ? `${streak} dias` : "Comece hoje!"}</span>
            </div>
          </div>
        </div>
        {nextLevel && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progresso nível</span>
              <span>{xpProgress}%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Target,     label: "Meta calórica", value: user?.goal ? "Definida" : "Não definida", sub: "configure no perfil", color: "text-brand-600", bg: "bg-brand-50" },
          { icon: TrendingUp, label: "Peso atual",    value: user?.currentWeight ? `${user.currentWeight}kg` : "—", sub: "atualize no perfil", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Trophy,     label: "XP total",      value: `${xp} XP`, sub: level.title, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Flame,      label: "Streak",        value: streak > 0 ? `${streak}d` : "0d", sub: "dias seguidos", color: "text-orange-500", bg: "bg-orange-50" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Water tracker */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Hidratação</h3>
          </div>
          <span className="text-sm font-semibold text-blue-600">{water}ml / {waterTarget}ml</span>
        </div>
        <div className="h-3 bg-blue-50 rounded-full overflow-hidden">
          <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
        </div>
        <div className="flex gap-2 mt-3">
          {[150, 250, 500].map(ml => (
            <button key={ml} onClick={() => setWater(w => Math.min(waterTarget, w + ml))}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
              +{ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Charts — only if has data */}
      {hasProgress ? (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4 text-sm">📉 Peso — últimos 7 dias</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto","auto"]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}kg`, "Peso"]} />
                <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: "#16a34a", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-4 text-sm">🔥 Calorias — últimos 7 dias</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={calData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v} kcal`, "Calorias"]} />
                <Bar dataKey="cal" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card p-8 mb-6 text-center border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold text-slate-700">Seus gráficos aparecerão aqui</p>
          <p className="text-sm text-slate-400 mt-1">Comece a usar o Levefy para ver seu progresso!</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/meal-ai" className="card p-5 hover:border-brand-300 transition group">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <p className="font-semibold text-sm">Gerar plano hoje</p>
          <p className="text-xs text-slate-400 mt-1">Meal AI personalizado</p>
          <ChevronRight className="w-4 h-4 text-brand-500 mt-3" />
        </Link>

        <Link href="/challenge" className="card p-5 hover:border-orange-300 transition group">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="font-semibold text-sm">Desafio 21 dias</p>
          <p className="text-xs text-slate-400 mt-1">{streak > 0 ? `Dia ${streak} de 21` : "Comece agora!"}</p>
          <ChevronRight className="w-4 h-4 text-orange-400 mt-3" />
        </Link>

        <Link href="/recipes" className="card p-5 hover:border-blue-300 transition group">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-semibold text-sm">Receitas de hoje</p>
          <p className="text-xs text-slate-400 mt-1">Explore receitas saudáveis</p>
          <ChevronRight className="w-4 h-4 text-blue-400 mt-3" />
        </Link>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPaid && (
        <div className="mt-6 card p-5 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold">Desbloqueie o potencial completo 🚀</p>
            <p className="text-sm text-white/80 mt-0.5">Meal AI, receitas exclusivas e muito mais</p>
          </div>
          <Link href="/membership" className="bg-white text-brand-700 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-brand-50 transition shrink-0">
            Ver planos
          </Link>
        </div>
      )}
    </AppShell>
  );
}
