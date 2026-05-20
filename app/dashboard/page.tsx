"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Flame, Droplets, Target, Trophy, TrendingUp, Zap, ChevronRight, Brain, Lock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { getLevelFromXP, getNextLevel, getXPProgress } from "@/lib/gamification";
import PremiumConversionCard from "@/components/PremiumConversionCard";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [water, setWater] = useState(0);
  const [checkin, setCheckin] = useState<any>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState("");
  const [daily, setDaily] = useState({ water: false, workout: false, diet: false, mood: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/user/me").then(r => r.json()),
      fetch("/api/checkin/today").then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([d, c]) => {
        setUser(d.user ?? c?.user ?? null);
        setWater(d.waterToday ?? 0);
        if (c?.checkin) {
          setCheckin(c.checkin);
          setDaily({
            water: Boolean(c.checkin.water),
            workout: Boolean(c.checkin.workout),
            diet: Boolean(c.checkin.diet),
            mood: c.checkin.mood ?? "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleDaily = (key: "water" | "workout" | "diet") => {
    if (checkin) return;
    setDaily(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitCheckin = async () => {
    if (checkin || checkinLoading) return;
    setCheckinLoading(true);
    setCheckinMessage("");
    try {
      const res = await fetch("/api/checkin/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(daily),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setCheckinMessage(data.error ?? "Não foi possível salvar seu check-in.");
        return;
      }
      setCheckin(data.checkin);
      if (data.user) setUser(data.user);
      setCheckinMessage(data.message ?? `+${data.xpEarned ?? 0} XP adicionados hoje!`);
      if (daily.water && water < 2500) setWater(2500);
    } catch {
      setCheckinMessage("Erro de conexão. Tente novamente.");
    } finally {
      setCheckinLoading(false);
    }
  };

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
      <div className="space-y-4">
        <div className="skeleton h-32 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
        </div>
        <div className="skeleton h-40 w-full" />
      </div>
    </AppShell>
  );

  return (
    <AppShell title="Painel">
      {/* XP + Level hero */}
      <div className="card card-premium p-6 sm:p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-brand flex items-center justify-center text-3xl shadow-brand">
                {level.emoji}
              </div>
              <span className="absolute -inset-1 rounded-2xl animate-pulse-ring" />
            </div>
            <div>
              <p className="text-[11px] text-brand-700 font-bold uppercase tracking-[0.16em]">{level.title}</p>
              <p className="font-extrabold text-xl sm:text-2xl tracking-tight">
                Nível {level.level} <span className="text-slate-400 font-bold">·</span>{" "}
                <span className="text-gradient-soft">{xp} XP</span>
              </p>
              {nextLevel && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Faltam <strong className="text-slate-700">{nextLevel.xpMin - xp} XP</strong> para o Nível {nextLevel.level}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-orange-100 shadow-soft">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-700 text-sm">
              {streak > 0 ? `${streak} dias seguidos` : "Comece hoje!"}
            </span>
          </div>
        </div>
        {nextLevel && (
          <div className="relative mt-5">
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



      {/* Daily Check-in */}
      <div className="card p-5 sm:p-6 mb-6 relative overflow-hidden border-brand-100">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-[11px] text-brand-700 font-bold uppercase tracking-[0.16em]">Check-in diário</p>
            <h2 className="font-extrabold text-xl tracking-tight mt-1">
              {checkin ? "Missão de hoje concluída 🔥" : "Ganhe XP cuidando de você hoje"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {checkin
                ? "Volte amanhã para manter sua sequência viva."
                : "Marque o que você já fez e construa seu hábito diário."}
            </p>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-orange-50 text-orange-700 text-xs font-extrabold border border-orange-100">
            {checkin ? `+${checkin.xpEarned ?? 0} XP hoje` : "Até +75 XP"}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 relative">
          {[
            { key: "water", emoji: "💧", title: "Bebi água", desc: "Hidratação em dia" },
            { key: "workout", emoji: "🏋️", title: "Me movimentei", desc: "Treino ou caminhada" },
            { key: "diet", emoji: "🥗", title: "Segui o plano", desc: "Alimentação consciente" },
          ].map(item => {
            const active = Boolean((daily as any)[item.key]);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleDaily(item.key as "water" | "workout" | "diet")}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  active
                    ? "border-brand-300 bg-brand-50 shadow-soft"
                    : "border-slate-100 bg-white hover:border-brand-200 hover:-translate-y-0.5"
                } ${checkin ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-300"}`}>
                    ✓
                  </span>
                </div>
                <p className="font-bold text-sm mt-3">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="relative mt-4 grid sm:grid-cols-[1fr_auto] gap-3 items-center">
          <select
            disabled={Boolean(checkin)}
            value={daily.mood}
            onChange={e => setDaily(prev => ({ ...prev, mood: e.target.value }))}
            className="input-premium bg-white disabled:opacity-70"
          >
            <option value="">Como você está se sentindo hoje?</option>
            <option value="motivado">😄 Motivado(a)</option>
            <option value="normal">🙂 Normal</option>
            <option value="cansado">😴 Cansado(a)</option>
            <option value="ansioso">😟 Ansioso(a)</option>
            <option value="orgulhoso">🔥 Orgulhoso(a)</option>
          </select>
          <button
            type="button"
            onClick={submitCheckin}
            disabled={Boolean(checkin) || checkinLoading}
            className="btn-primary px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checkinLoading ? "Salvando..." : checkin ? "Concluído" : "Salvar check-in"}
          </button>
        </div>

        {(checkinMessage || checkin) && (
          <div className="relative mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700">
            <strong className="text-brand-700">Levefy IA:</strong>{" "}
            {checkinMessage || (streak > 1
              ? `Você manteve sua sequência por ${streak} dias. Seu hábito está ficando mais forte.`
              : "Você concluiu a missão de hoje. Amanhã tem mais XP esperando por você.")}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { icon: Target,     label: "Meta calórica", value: user?.goal ? "Definida" : "Não definida", sub: "configure no perfil", color: "text-brand-600", bg: "bg-brand-50" },
          { icon: TrendingUp, label: "Peso atual",    value: user?.currentWeight ? `${user.currentWeight}kg` : "—", sub: "atualize no perfil", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Trophy,     label: "XP total",      value: `${xp} XP`, sub: level.title, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Flame,      label: "Streak",        value: streak > 0 ? `${streak}d` : "0d", sub: "dias seguidos", color: "text-orange-500", bg: "bg-orange-50" },
        ].map(s => (
          <div key={s.label} className="card card-hover p-4 sm:p-5 group">
            <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight">{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Premium conversion / FOMO */}
      <div className="mb-6">
        <PremiumConversionCard user={user} />
      </div>

      {/* Water tracker */}
      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Droplets className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Hidratação</h3>
              <p className="text-[11px] text-slate-400">Meta diária: {waterTarget}ml</p>
            </div>
          </div>
          <span className="text-sm font-bold text-blue-600">{water}<span className="text-slate-400 font-medium">/{waterTarget}ml</span></span>
        </div>
        <div className="h-3 bg-blue-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${waterPct}%` }}
          />
        </div>
        <div className="flex gap-2 mt-4">
          {[150, 250, 500].map(ml => (
            <button
              key={ml}
              onClick={() => setWater(w => Math.min(waterTarget, w + ml))}
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold border border-blue-100 bg-blue-50/50 text-blue-700 hover:bg-blue-100 hover:-translate-y-0.5 transition-all duration-200"
            >
              + {ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {hasProgress ? (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
          <div className="card p-5 sm:p-6">
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
          <div className="card p-5 sm:p-6">
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
        <div className="card p-10 mb-6 text-center border-2 border-dashed border-slate-200 bg-white/50">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-semibold text-slate-700">Seus gráficos aparecerão aqui</p>
          <p className="text-sm text-slate-400 mt-1">Comece a usar o Levefy para ver seu progresso!</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/meal-ai" className="card card-hover p-5 sm:p-6 group">
          <div className="w-11 h-11 gradient-brand rounded-2xl flex items-center justify-center mb-4 shadow-brand group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold text-sm">Gerar plano hoje</p>
          <p className="text-xs text-slate-500 mt-1">Meal AI personalizado em segundos</p>
          <ChevronRight className="w-4 h-4 text-brand-500 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link href="/challenge" className="card card-hover p-5 sm:p-6 group">
          <div className="w-11 h-11 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="font-bold text-sm">Desafio 21 dias</p>
          <p className="text-xs text-slate-500 mt-1">{streak > 0 ? `Dia ${streak} de 21` : "Comece agora!"}</p>
          <ChevronRight className="w-4 h-4 text-orange-400 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link href="/recipes" className="card card-hover p-5 sm:p-6 group">
          <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-bold text-sm">Receitas de hoje</p>
          <p className="text-xs text-slate-500 mt-1">Explore receitas saudáveis</p>
          <ChevronRight className="w-4 h-4 text-blue-400 mt-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Upgrade CTA */}
      {!isPaid && (
        <div className="mt-6 card p-5 sm:p-6 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap relative overflow-hidden shadow-premium">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <p className="font-extrabold text-lg tracking-tight">Sua evolução avançada está bloqueada 🚀</p>
            <p className="text-sm text-white/85 mt-1">Desbloqueie projeção 30/90 dias, IA emocional e ajustes premium.</p>
          </div>
          <Link
            href="/membership"
            className="relative bg-white text-brand-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-200 shrink-0 shadow-soft"
          >
            Ver planos
          </Link>
        </div>
      )}
    </AppShell>
  );
}
