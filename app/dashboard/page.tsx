"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Flame, Droplets, Target, Trophy, TrendingUp, Zap, Plus, ChevronRight, Brain } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { getLevelFromXP, getNextLevel, getXPProgress } from "@/lib/gamification";

const mockWeightData = [
  { day: "Seg", weight: 72.4 },
  { day: "Ter", weight: 72.1 },
  { day: "Qua", weight: 71.8 },
  { day: "Qui", weight: 71.9 },
  { day: "Sex", weight: 71.5 },
  { day: "Sáb", weight: 71.3 },
  { day: "Dom", weight: 71.0 },
];

const mockCalData = [
  { day: "Seg", cal: 1820 },
  { day: "Ter", cal: 1950 },
  { day: "Qua", cal: 1760 },
  { day: "Qui", cal: 2010 },
  { day: "Sex", cal: 1890 },
  { day: "Sáb", cal: 1730 },
  { day: "Dom", cal: 1800 },
];

export default function DashboardPage() {
  const [xp] = useState(340);
  const [streak] = useState(7);
  const [water, setWater] = useState(1200);
  const level = getLevelFromXP(xp);
  const nextLevel = getNextLevel(xp);
  const xpProgress = getXPProgress(xp);

  const waterTarget = 2500;
  const waterPct = Math.min(100, Math.round((water / waterTarget) * 100));

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
              <span className="font-bold text-orange-700">{streak} dias</span>
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
          { icon: Target, label: "Meta calórica",   value: "1.800 kcal", sub: "meta diária",    color: "text-brand-600",  bg: "bg-brand-50"  },
          { icon: TrendingUp, label: "Peso atual",  value: "71,0 kg",    sub: "−1,4kg semana",  color: "text-blue-600",   bg: "bg-blue-50"   },
          { icon: Trophy, label: "XP total",        value: `${xp} XP`,   sub: level.title,      color: "text-amber-600",  bg: "bg-amber-50"  },
          { icon: Flame, label: "Streak",           value: `${streak}d`, sub: "dias seguidos",  color: "text-orange-500", bg: "bg-orange-50" },
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-sm">📉 Peso — últimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={mockWeightData}>
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
            <BarChart data={mockCalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v} kcal`, "Calorias"]} />
              <Bar dataKey="cal" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
          <p className="text-xs text-slate-400 mt-1">Dia 7 de 21</p>
          <ChevronRight className="w-4 h-4 text-orange-400 mt-3" />
        </Link>

        <Link href="/recipes" className="card p-5 hover:border-blue-300 transition group">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-semibold text-sm">Receitas de hoje</p>
          <p className="text-xs text-slate-400 mt-1">12 novas disponíveis</p>
          <ChevronRight className="w-4 h-4 text-blue-400 mt-3" />
        </Link>
      </div>
    </AppShell>
  );
}
