"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Flame, Droplets, Target, Trophy, TrendingUp, Zap, ChevronRight, Brain, Star, BadgeCheck } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLevelFromXP, getNextLevel, getXPProgress } from "@/lib/gamification";

const EXPERTS = [
  {
    name: "Dra. Camila Azevedo",
    specialty: "Nutrição Clínica Esportiva",
    crn: "CRN-3 · 45821",
    years: "12 anos",
    avatar: "CA",
    color: "from-rose-400 to-pink-600",
    quote: "A personalização alimentar é o caminho mais eficiente para resultados duradouros.",
  },
  {
    name: "Dr. Rafael Monteiro",
    specialty: "Emagrecimento e Performance",
    crn: "CRN-3 · 38904",
    years: "9 anos",
    avatar: "RM",
    color: "from-blue-400 to-indigo-600",
    quote: "Tecnologia aliada à ciência da nutrição muda vidas de forma sustentável.",
  },
  {
    name: "Dra. Juliana Ferraz",
    specialty: "Nutrição Funcional e Hormonal",
    crn: "CRN-3 · 52173",
    years: "15 anos",
    avatar: "JF",
    color: "from-amber-400 to-orange-600",
    quote: "Cada organismo é único. Planos inteligentes respeitam essa individualidade.",
  },
];

const TRUST_STATS = [
  { value: "+12.000", label: "planos gerados" },
  { value: "4.9★", label: "avaliação média" },
  { value: "98%", label: "satisfação" },
  { value: "21 dias", label: "para ver resultados" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [water, setWater] = useState(0);
  const router = useRouter();

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

  const handleComecaHoje = () => {
    if (streak > 0) {
      router.push("/meal-ai");
    } else {
      router.push("/challenge");
    }
  };

  if (loading) return (
    <AppShell title="Painel">
      <div className="card p-8 text-center text-slate-400">Carregando seu painel...</div>
    </AppShell>
  );

  return (
    <AppShell title="Painel">
      {/* XP Banner premium */}
      <div className="relative rounded-3xl overflow-hidden mb-6 p-6 gradient-brand shadow-lg shadow-brand-600/20">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)"}} />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
              {level.emoji}
            </div>
            <div className="text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">{level.title}</p>
              <p className="text-2xl font-extrabold">Nível {level.level} · {xp} XP</p>
              {nextLevel && <p className="text-sm text-white/80">Faltam {nextLevel.xpMin - xp} XP para o Nível {nextLevel.level}</p>}
            </div>
          </div>
          <button
            onClick={handleComecaHoje}
            className="flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2.5 rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="font-bold text-white text-sm">
              {streak > 0 ? `${streak} dias de streak` : "Comece hoje!"}
            </span>
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
        {nextLevel && (
          <div className="relative mt-5">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>Progresso para Nível {nextLevel.level}</span>
              <span>{xpProgress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Target,     label: "Meta calórica", value: user?.goal ? "Definida" : "Não definida",              sub: "configure no perfil", color: "text-emerald-600", bg: "bg-emerald-50",  ring: "ring-emerald-100" },
          { icon: TrendingUp, label: "Peso atual",    value: user?.currentWeight ? `${user.currentWeight}kg` : "—", sub: "atualize no perfil",  color: "text-blue-600",   bg: "bg-blue-50",    ring: "ring-blue-100" },
          { icon: Trophy,     label: "XP total",      value: `${xp}`,                                               sub: level.title,           color: "text-amber-600",  bg: "bg-amber-50",   ring: "ring-amber-100" },
          { icon: Flame,      label: "Streak",        value: `${streak}d`,                                          sub: "dias seguidos",        color: "text-orange-500", bg: "bg-orange-50",  ring: "ring-orange-100" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-2xl ${s.bg} ring-4 ${s.ring} flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Hidratação */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Hidratação diária</h3>
              <p className="text-xs text-slate-400">{water}ml de {waterTarget}ml</p>
            </div>
          </div>
          <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${waterPct >= 100 ? "bg-brand-100 text-brand-700" : "bg-blue-50 text-blue-600"}`}>
            {waterPct}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${waterPct}%`, background: "linear-gradient(90deg, #60a5fa, #3b82f6)" }} />
        </div>
        <div className="flex gap-2">
          {[150, 250, 500].map(ml => (
            <button key={ml} onClick={() => setWater(w => Math.min(waterTarget, w + ml))}
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold border-2 border-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-150">
              +{ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {hasProgress ? (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
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
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
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
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 mb-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold text-slate-700">Seus gráficos aparecerão aqui</p>
          <p className="text-sm text-slate-400 mt-1">Comece a usar o Levefy para ver seu progresso!</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { href: "/meal-ai",   icon: Brain, color: "gradient-brand",                                          textColor: "text-white", label: "Gerar plano hoje",   sub: "Meal AI personalizado",          iconBg: "bg-white/20" },
          { href: "/challenge", icon: Flame, color: "bg-gradient-to-br from-orange-400 to-red-500",            textColor: "text-white", label: "Desafio 21 dias",    sub: streak > 0 ? `Dia ${streak} de 21` : "Comece agora!", iconBg: "bg-white/20" },
          { href: "/recipes",   icon: Zap,   color: "bg-gradient-to-br from-blue-500 to-indigo-600",           textColor: "text-white", label: "Receitas de hoje",   sub: "Explore receitas saudáveis",      iconBg: "bg-white/20" },
        ].map(a => (
          <Link key={a.href} href={a.href}
            className={`${a.color} rounded-3xl p-6 flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group`}>
            <div className={`w-11 h-11 ${a.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
              <a.icon className={`w-6 h-6 ${a.textColor}`} />
            </div>
            <p className={`font-bold ${a.textColor}`}>{a.label}</p>
            <p className={`text-sm mt-1 ${a.textColor} opacity-80`}>{a.sub}</p>
            <ChevronRight className={`w-4 h-4 ${a.textColor} opacity-60 mt-4 group-hover:translate-x-1 transition-transform`} />
          </Link>
        ))}
      </div>

      {/* Trust Stats */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_STATS.map(s => (
            <div key={s.label} className="text-center p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100/60">
              <p className="text-2xl font-extrabold text-brand-700">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Experts Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">Especialistas verificados</h3>
            <p className="text-xs text-slate-500 mt-0.5">Metodologia desenvolvida com nutricionistas certificados</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            <BadgeCheck className="w-3.5 h-3.5" /> CRN verificado
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {EXPERTS.map(e => (
            <div key={e.name} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                  {e.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{e.name}</p>
                  <p className="text-[11px] text-slate-500">{e.crn}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] text-slate-400 ml-1 font-medium">5.0</span>
              </div>
              <p className="text-xs text-brand-700 font-bold mb-1">{e.specialty}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">"{e.quote}"</p>
              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                <BadgeCheck className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-[10px] text-slate-400 font-medium">Especialista Verificado · {e.years} de exp.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {!isPaid && (
        <div className="rounded-3xl p-5 gradient-brand text-white flex items-center justify-between gap-4 flex-wrap shadow-lg shadow-brand-600/20">
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
