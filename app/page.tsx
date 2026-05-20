import Link from "next/link";
import Logo from "@/components/Logo";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import {
  Brain, Flame, BarChart3, ShoppingCart, Trophy, Zap, Star, Check,
  TrendingUp, Target, ArrowRight, Sparkles, Lock, RefreshCw, Layers
} from "lucide-react";

export const metadata = {
  title: "Levefy — Você não precisa de motivação. Precisa do plano certo.",
  description: "Constância, evolução e resultado com IA. O app fitness premium que se adapta ao seu corpo — todos os dias.",
  openGraph: {
    title: "Levefy — Você não precisa de motivação. Precisa do plano certo.",
    description: "Constância, evolução e resultado com IA. O app fitness premium.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const FEATURES = [
  { icon: Brain,        title: "Meal AI",          desc: "Plano criado só para você. Corpo, objetivo e rotina — sem fórmulas genéricas.",  tag: "IA",        color: "from-emerald-500 to-green-700" },
  { icon: BarChart3,    title: "Macros Certeiros",  desc: "TMB, TDEE, proteína e carbs calculados com precisão científica, não chute.",     tag: "Precisão",  color: "from-green-600 to-emerald-800" },
  { icon: Flame,        title: "Streak Diário",     desc: "XP, níveis e medalhas. A gamificação que transforma disciplina em hábito.",       tag: "Motivação", color: "from-emerald-400 to-green-600" },
  { icon: ShoppingCart, title: "Lista Automática",  desc: "Ingredientes do seu plano semanais gerados em segundos. Sem pensar.",            tag: "Auto",      color: "from-green-500 to-emerald-700" },
  { icon: Trophy,       title: "Desafio 21 Dias",   desc: "Programa estruturado para criar hábitos reais — de forma progressiva.",          tag: "Desafio",   color: "from-emerald-600 to-green-900" },
  { icon: Zap,          title: "Score Nutricional", desc: "Veja a qualidade da sua dieta em um número. Sempre evoluindo.",                  tag: "Análise",   color: "from-green-400 to-emerald-600" },
];

const TESTIMONIALS = [
  { name: "Ana Paula",  age: "32",  role: "Professora",  quote: "Primeira vez que consigo manter uma dieta por mais de 1 mês.", result: "−4kg em 3 semanas", streak: "22 dias",  initials: "AP", color: "#16a34a" },
  { name: "Carlos M.",  age: "28",  role: "Atleta",       quote: "Finalmente consegui constância. Os macros estão certeiros.",   result: "+3kg de massa",   streak: "41 dias",  initials: "CM", color: "#059669" },
  { name: "Juliana S.", age: "41",  role: "Empresária",   quote: "Funciona com a minha rotina corrida. Resultados reais.",       result: "−6kg em 5 sem",   streak: "30 dias",  initials: "JS", color: "#047857" },
];

const PROOF = [
  { v: "+12.000", l: "usuários ativos" },
  { v: "4.9★",    l: "avaliação" },
  { v: "2.1M",    l: "refeições geradas" },
  { v: "98%",     l: "retenção" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-15 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-brand-700 transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link href="/login" className="btn-brand text-sm px-5 py-2.5 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#030712] min-h-[95svh] flex flex-col items-center justify-center">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid-fade opacity-70 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110vw] h-[55vh] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.08) 45%, transparent 70%)", filter: "blur(32px)" }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[40vh] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(6,95,70,0.18) 0%, transparent 65%)", filter: "blur(50px)" }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pt-14 pb-8 flex flex-col items-center text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-bold mb-8 animate-fade-in animate-border-glow"
            style={{ background: "rgba(22,163,74,0.1)", borderColor: "rgba(134,239,172,0.3)", color: "#86efac" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            App fitness com IA · +12.000 usuários
          </div>

          {/* HEADLINE */}
          <h1 className="font-display font-extrabold text-white leading-[1.04] tracking-tight text-balance max-w-[900px] animate-fade-in delay-100"
            style={{ fontSize: "clamp(2.4rem, 7.5vw, 5.8rem)" }}>
            Você não precisa de mais{" "}
            <span className="relative inline-block">
              motivação.
              <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] rounded-full opacity-70"
                style={{ background: "linear-gradient(90deg, transparent 0%, #22c55e 40%, #86efac 60%, transparent 100%)" }} />
            </span>
            <br />
            <span className="text-gradient-dark">Precisa do plano certo.</span>
          </h1>

          {/* Subheadline — curto, direto */}
          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed animate-fade-in delay-200">
            Constância gera resultado. O Levefy cria seu plano, acompanha seu progresso{" "}
            <span className="text-slate-200 font-semibold">e faz você continuar — todos os dias.</span>
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto animate-fade-in delay-300">
            <Link href="/login" className="btn-brand text-base sm:text-lg px-8 py-4 gap-2.5 w-full sm:w-auto animate-pulse-glow">
              <Brain className="w-5 h-5" />
              Destravar meu plano IA
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* SOCIAL PROOF — abaixo do CTA, acima da dobra */}
          <div className="mt-8 flex items-center justify-center flex-wrap gap-x-6 gap-y-3 animate-fade-in delay-400">
            {PROOF.map(p => (
              <span key={p.l} className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-display font-bold text-emerald-400">{p.v}</span>
                <span className="text-slate-600">{p.l}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-700 animate-fade-in delay-500">
            Sem cartão de crédito · Resultado em 60 segundos
          </p>

          {/* ── DASHBOARD MOCKUP ─────────────────────────── */}
          <div className="mt-16 relative w-full max-w-2xl animate-fade-in delay-500">

            {/* Floating left card */}
            <div className="hidden sm:block absolute -left-10 top-8 w-40 card-glass-dark rounded-2xl p-3.5 animate-float z-20"
              style={{ border: "1px solid rgba(134,239,172,0.15)" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">🔥 Streak</p>
              <p className="text-white font-display font-extrabold text-3xl leading-none">18</p>
              <p className="text-slate-500 text-[10px] mt-1">dias consecutivos</p>
              <div className="mt-2 flex gap-0.5">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="h-2 flex-1 rounded-full" style={{ background: i < 6 ? "#16a34a" : "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
            </div>

            {/* Floating right card */}
            <div className="hidden sm:block absolute -right-8 top-6 w-44 card-glass-dark rounded-2xl p-3.5 animate-float-b z-20"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">⚡ Score Hoje</p>
              <div className="flex items-end gap-1.5">
                <p className="text-white font-display font-extrabold text-4xl leading-none">94</p>
                <span className="text-emerald-400 text-xs font-bold mb-1">/ 100</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">Excelente</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/5">
                <div className="h-1.5 rounded-full" style={{ width: "94%", background: "linear-gradient(90deg, #22c55e, #86efac)" }} />
              </div>
            </div>

            {/* Main dashboard card */}
            <div className="relative card-glass-dark rounded-[1.75rem] overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Seu plano hoje</p>
                  <p className="text-white font-display font-bold text-lg mt-0.5">Semana 3 — Fase Evolução</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">PLANO ATIVO</span>
                </div>
              </div>

              <div className="p-5">
                {/* Macro stats */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  {[
                    { l: "Calorias", v: "1.840", u: "kcal", accent: "#22c55e" },
                    { l: "Proteína", v: "142g",  u: "/ 150g meta", accent: "#60a5fa" },
                    { l: "Carboidratos", v: "220g", u: "/ 240g meta", accent: "#f59e0b" },
                  ].map(s => (
                    <div key={s.l} className="rounded-2xl p-3 text-left"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">{s.l}</p>
                      <p className="font-display font-extrabold text-lg mt-1 leading-none" style={{ color: s.accent }}>{s.v}</p>
                      <p className="text-[9px] text-slate-700 mt-1">{s.u}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="rounded-2xl p-3.5 mb-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] text-slate-500 font-semibold">Progresso semanal</p>
                    <p className="text-[10px] font-bold text-emerald-400">78% completo</p>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full" style={{ width: "78%", background: "linear-gradient(90deg, #16a34a, #22c55e, #86efac)" }} />
                  </div>
                </div>

                {/* Meal pills */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "☕", label: "Café",    kcal: "420", done: true },
                    { icon: "🥗", label: "Almoço",  kcal: "680", done: true },
                    { icon: "🍎", label: "Lanche",  kcal: "280", done: true },
                    { icon: "🍽️", label: "Jantar",  kcal: "460", done: false },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-2.5 text-center"
                      style={{
                        background: m.done ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${m.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}`,
                      }}>
                      <div className="text-xl mb-1">{m.icon}</div>
                      <p className="text-[9px] font-bold" style={{ color: m.done ? "#86efac" : "#475569" }}>{m.label}</p>
                      <p className="text-[9px] text-slate-700 mt-0.5">{m.kcal}kcal</p>
                    </div>
                  ))}
                </div>

                {/* XP bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-display font-bold text-amber-400">Nível 7</span>
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-1.5 rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
                  </div>
                  <span className="text-[10px] text-slate-600 shrink-0">680 / 1000 XP</span>
                </div>
              </div>
            </div>

            {/* Bottom floating — achievement */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 card-glass-dark rounded-2xl px-5 py-3 flex items-center gap-3 animate-float-y z-20 whitespace-nowrap"
              style={{ border: "1px solid rgba(134,239,172,0.15)" }}>
              <span className="text-xl">🏆</span>
              <div>
                <p className="text-white text-xs font-bold">Semana Perfeita desbloqueada!</p>
                <p className="text-emerald-400 text-[10px] font-bold">+500 XP · Conquista rara</p>
              </div>
            </div>
          </div>

          {/* Bottom spacing for floating card */}
          <div className="h-12" />
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────── */}
      <div className="bg-[#030712] border-y overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="ticker-wrap py-3.5">
          <div className="ticker-inner select-none">
            {Array(2).fill([
              ["🔥", "Streak de 30 dias"],
              ["🧬", "Meal AI personalizado"],
              ["📊", "+12.000 usuários ativos"],
              ["⭐", "4.9 de avaliação"],
              ["🍽️", "2.1M refeições geradas"],
              ["💪", "98% retenção no plano"],
              ["🏆", "Desafio 21 dias"],
              ["⚡", "Resultado em 60 segundos"],
            ]).flat().map(([icon, label], i) => (
              <span key={i} className="inline-flex items-center gap-2.5 px-6 text-sm whitespace-nowrap">
                <span>{icon}</span>
                <span className="text-slate-400 font-medium">{label}</span>
                <span className="text-slate-800 px-4">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── NUMBERS ──────────────────────────────────────────── */}
      <section className="bg-white py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-400 mb-12">
            Resultados que provam
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { v: "12k+", l: "Usuários ativos",    sub: "e crescendo",          icon: "👥" },
              { v: "4.9★", l: "Avaliação média",    sub: "nas lojas de app",     icon: "⭐" },
              { v: "2.1M", l: "Refeições geradas",  sub: "pela nossa IA",        icon: "🍽️" },
              { v: "98%",  l: "Retenção no plano",  sub: "voltam todo dia",      icon: "🔥" },
            ].map(s => (
              <div key={s.l} className="text-center group cursor-default">
                <div className="text-2xl mb-3">{s.icon}</div>
                <p className="font-display font-extrabold text-gradient group-hover:scale-110 transition-transform duration-300"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
                  {s.v}
                </p>
                <p className="font-bold text-slate-800 text-sm mt-1">{s.l}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-light pointer-events-none opacity-50" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold tracking-tight text-slate-900 text-balance"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3.5rem)" }}>
              Tudo que você precisa.{" "}
              <span className="text-gradient">Em um lugar.</span>
            </h2>
            <p className="mt-3 text-slate-500 max-w-md mx-auto">Sem planilha. Sem nutricionista caro. Sem desculpa.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="group card p-6 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-100 transition-all duration-300 cursor-default relative overflow-hidden">
                {/* Hover glow bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(34,197,94,0.05), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-brand mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg text-slate-900">{f.title}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      {f.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE ─────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-brand-700 bg-brand-50 border border-brand-200 mb-6">
              Evolução visível
            </span>
            <h2 className="font-display font-extrabold tracking-tight text-slate-900 leading-tight text-balance"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.25rem)" }}>
              Seu shape começa{" "}
              <span className="text-gradient">na constância.</span>
            </h2>
            <p className="mt-5 text-slate-500 text-lg leading-relaxed max-w-md">
              O dashboard do Levefy mostra sua evolução em tempo real — macros, streak, XP e score nutricional. Você vê o progresso acontecer.
            </p>

            {/* Feature list — mais visual, menos texto */}
            <ul className="mt-8 space-y-4">
              {[
                { icon: Target,   text: "Metas ajustadas por IA conforme você evolui" },
                { icon: TrendingUp, text: "Gráfico de progresso semana a semana" },
                { icon: Lock,     text: "Plano adaptado à sua rotina real, não ideal" },
                { icon: RefreshCw, text: "Receitas novas geradas toda semana pela IA" },
                { icon: Layers,   text: "Gamificação que cria hábito sem esforço" },
              ].map(item => (
                <li key={item.text} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium text-[15px] leading-tight mt-1">{item.text}</span>
                </li>
              ))}
            </ul>

            <Link href="/login" className="btn-brand mt-10 inline-flex text-base px-8 py-4 gap-2.5">
              <Brain className="w-5 h-5" />
              Criar meu plano fitness
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — SVG macros ring + cards */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />

            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* Main card */}
              <div className="card glow-green-sm border border-brand-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 100% 0%, rgba(34,197,94,0.1), transparent 70%)" }} />

                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Nutrição de hoje</p>

                {/* SVG Macro ring */}
                <div className="flex justify-center my-4 relative">
                  <svg width="170" height="170" viewBox="0 0 170 170">
                    {/* BG rings */}
                    <circle cx="85" cy="85" r="75" fill="none" stroke="#f1f5f9" strokeWidth="13" />
                    <circle cx="85" cy="85" r="57" fill="none" stroke="#f1f5f9" strokeWidth="11" />
                    <circle cx="85" cy="85" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    {/* Carbs */}
                    <circle cx="85" cy="85" r="75" fill="none" stroke="#16a34a" strokeWidth="13"
                      strokeDasharray="471" strokeDashoffset="118" strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "85px 85px" }} />
                    {/* Protein */}
                    <circle cx="85" cy="85" r="57" fill="none" stroke="#22c55e" strokeWidth="11"
                      strokeDasharray="358" strokeDashoffset="107" strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "85px 85px" }} />
                    {/* Fat */}
                    <circle cx="85" cy="85" r="40" fill="none" stroke="#86efac" strokeWidth="10"
                      strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "85px 85px" }} />
                    {/* Center */}
                    <text x="85" y="80" textAnchor="middle" fontSize="21" fontWeight="800" fill="#0f172a" fontFamily="Syne,sans-serif">1.840</text>
                    <text x="85" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="DM Sans,sans-serif">kcal/dia</text>
                  </svg>
                  {/* Legend */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 space-y-2">
                    {[{ c: "#16a34a", l: "Carbs",  v: "220g" }, { c: "#22c55e", l: "Prot",  v: "142g" }, { c: "#86efac", l: "Gordu", v: "58g" }].map(m => (
                      <div key={m.l} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.c }} />
                        <span className="text-[11px] text-slate-500">{m.l}</span>
                        <span className="text-[11px] font-bold text-slate-800">{m.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-2">
                  {[
                    { icon: "☕", name: "Café da manhã", cal: "420 kcal", done: true },
                    { icon: "🥗", name: "Almoço",        cal: "680 kcal", done: true },
                    { icon: "🍎", name: "Lanche",         cal: "280 kcal", done: false },
                  ].map(m => (
                    <div key={m.name} className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{
                        background: m.done ? "rgba(34,197,94,0.06)" : "#f8fafc",
                        border: `1px solid ${m.done ? "rgba(34,197,94,0.15)" : "#f1f5f9"}`,
                      }}>
                      <span className="text-lg">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.cal}</p>
                      </div>
                      {m.done && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Float — XP */}
              <div className="absolute -top-5 -right-5 card px-4 py-3 w-32 shadow-premium border border-brand-100 animate-float-y">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">XP Ganho</p>
                <p className="font-display font-extrabold text-3xl text-gradient leading-none mt-1">+280</p>
                <div className="mt-1.5 h-1 rounded-full bg-brand-50">
                  <div className="h-1 rounded-full w-2/3 gradient-brand" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1">Nível 7 → 8</p>
              </div>

              {/* Float — Score */}
              <div className="absolute -bottom-5 -left-5 card px-4 py-3 w-36 shadow-brand border border-brand-100 animate-float">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Score</p>
                </div>
                <p className="font-display font-extrabold text-4xl text-slate-900 leading-none">94</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ Excelente qualidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-5 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-light opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold tracking-tight text-slate-900 text-balance"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.25rem)" }}>
              Pessoas reais.{" "}
              <span className="text-gradient">Transformações reais.</span>
            </h2>
            <p className="mt-3 text-slate-400 text-sm">Não são promessas. São resultados documentados.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="group card card-hover p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(34,197,94,0.05), transparent 65%)" }} />
                <div className="relative z-10">
                  <div className="flex gap-0.5 mb-4">
                    {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>

                  <p className="text-slate-700 leading-relaxed text-[15px] mb-5">&ldquo;{t.quote}&rdquo;</p>

                  {/* Result + streak */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700">
                      <TrendingUp className="w-3 h-3" />{t.result}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                      🔥 {t.streak} streak
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
                      style={{ background: t.color }}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{t.name}, {t.age}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold tracking-tight text-slate-900"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.25rem)" }}>
              Simples. Justo. <span className="text-gradient">Eficiente.</span>
            </h2>
            <p className="mt-3 text-slate-400">Menos de um cafezinho por dia.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* START */}
            <div className="card p-8 hover:-translate-y-1 transition-all duration-300">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Para começar</p>
              <h3 className="font-display font-extrabold text-3xl text-slate-900 mb-1">START</h3>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display font-extrabold text-5xl text-slate-900">R$27</span>
                <span className="text-slate-400 text-sm">pagamento único</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Meal AI (5 gerações)", "Receitas exclusivas", "Plano alimentar completo", "Desafio 7 dias", "Acesso vitalício"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/membership" className="btn-ghost w-full block text-center py-3.5 font-bold">Começar com START</Link>
            </div>

            {/* PREMIUM */}
            <div className="card-premium p-8 ring-2 ring-brand-600/25 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-5 right-5 px-3 py-1 rounded-full gradient-brand text-white text-[10px] font-extrabold shadow-brand">
                MAIS POPULAR
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 mb-2">Recomendado</p>
              <h3 className="font-display font-extrabold text-3xl text-slate-900 mb-1">PREMIUM</h3>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-display font-extrabold text-5xl text-gradient">R$19</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">menos de R$0,63 por dia</p>
              <ul className="space-y-3 mb-8">
                {["Meal AI ilimitado", "Dashboard avançado", "Plano semanal + lista de compras", "Histórico e progresso", "XP, streak, gamificação completa", "Receitas premium", "Suporte prioritário"].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/membership" className="btn-brand w-full block text-center py-4 text-base font-bold">
                Destravar PREMIUM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 px-5" style={{ background: "#030712" }}>
        <div className="absolute inset-0 bg-grid-fade opacity-60 pointer-events-none" />

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[700px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.06) 50%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8 text-emerald-400"
            style={{ background: "rgba(22,163,74,0.1)", borderColor: "rgba(134,239,172,0.3)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            60 segundos para seu primeiro plano
          </div>

          {/* Headline */}
          <h2 className="font-display font-extrabold text-white leading-tight text-balance tracking-tight"
            style={{ fontSize: "clamp(2rem, 6.5vw, 4.25rem)" }}>
            Resultado não vem da sorte.{" "}
            <span className="text-gradient-dark">Vem da consistência.</span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Mais de 12.000 pessoas já escolheram ter um plano que funciona.
            {" "}<span className="text-slate-200 font-medium">A única diferença é um clique.</span>
          </p>

          {/* Giant CTA */}
          <div className="mt-10">
            <Link href="/login"
              className="btn-brand inline-flex text-lg sm:text-xl px-10 sm:px-14 py-5 gap-3 animate-pulse-glow w-full sm:w-auto justify-center"
              style={{ borderRadius: "9999px" }}>
              <Brain className="w-6 h-6" />
              Começar minha transformação
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex items-center justify-center gap-5 flex-wrap">
            {["Sem cartão de crédito", "Cancele quando quiser", "Resultado em 60s"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-700" />{t}
              </span>
            ))}
          </div>

          {/* Social avatars */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5">
              {[["AP","#16a34a"],["CM","#059669"],["JS","#047857"],["LR","#065f46"],["MF","#14532d"]].map(([init, bg], i) => (
                <div key={init} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-display font-extrabold text-white"
                  style={{ background: bg, borderColor: "#030712", zIndex: 5 - i }}>
                  {init}
                </div>
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              <span className="text-slate-200 font-semibold">+12.000 pessoas</span> já começaram
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#030712] border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light />
          <div className="flex flex-col items-center sm:items-end gap-1 text-center sm:text-right">
            <p className="text-slate-600 text-xs">© {new Date().getFullYear()} Levefy · Todos os direitos reservados</p>
            <p className="text-slate-700 text-xs font-medium">
              Lucas Nassuato da Silva
              <span className="mx-1.5 text-slate-800">·</span>
              CNPJ 35.593.116/0001-66
            </p>
          </div>
        </div>
      </footer>

      <MobileStickyCTA href="/login" label="Destravar meu plano IA →" />
    </div>
  );
}
