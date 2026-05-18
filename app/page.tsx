import Link from "next/link";
import Logo from "@/components/Logo";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import { Brain, Flame, BarChart3, ShoppingCart, Trophy, Zap, Star, Check, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Levefy — Receba seu plano alimentar inteligente em 60 segundos",
  description: "Dietas personalizadas, receitas e progresso inteligente sem complicação. Meal AI que se adapta ao seu corpo e objetivos.",
  openGraph: {
    title: "Levefy — Plano alimentar inteligente",
    description: "Dietas personalizadas em 60 segundos. Sem enrolação.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const FEATURES = [
  { icon: Brain,       title: "Meal AI Personalizado",  desc: "Plano criado exclusivamente para o seu corpo, objetivo e rotina. Sem fórmulas genéricas." },
  { icon: BarChart3,   title: "Macros calculados",      desc: "TMB, TDEE, proteína, carbs e gordura calculados com precisão para você." },
  { icon: Flame,       title: "Streak e gamificação",   desc: "XP, níveis, medalhas e desafios para manter a motivação alta todo dia." },
  { icon: ShoppingCart,title: "Lista de compras",       desc: "Lista automática dos ingredientes do seu plano semanal. Prática e econômica." },
  { icon: Trophy,      title: "Desafio 21 Dias",        desc: "Programa estruturado para criar hábitos reais de alimentação saudável." },
  { icon: Zap,         title: "Score nutricional",      desc: "Veja a qualidade da sua dieta em números. Sempre otimizando seus resultados." },
];

const TESTIMONIALS = [
  { name: "Ana Paula, 32", role: "Professora", text: "Em 3 semanas perdi 4kg seguindo o plano do Levefy. Nunca foi tão fácil comer bem.", avatar: "🧑‍🏫" },
  { name: "Carlos M., 28", role: "Atleta amador", text: "O Meal AI entende meu objetivo de hipertrofia. Os macros estão certeiros.", avatar: "🏋️" },
  { name: "Juliana S., 41", role: "Mãe de 2 filhos", text: "Finalmente uma dieta que funciona com a minha rotina corrida. Recomendo!", avatar: "👩‍👧" },
];

export default function LandingPage() {
  return (
    <div className="bg-noise min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-700 hidden sm:block">Entrar</Link>
            <Link href="/login" className="btn-primary py-2 px-5 text-sm">Começar grátis</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold mb-6">
          <Zap className="w-4 h-4" /> +2.800 planos gerados esta semana
        </div>
        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 max-w-3xl mx-auto">
          Receba seu plano alimentar inteligente em{" "}
          <span className="text-gradient">menos de 60 segundos</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Dietas personalizadas, receitas e progresso inteligente sem complicação. O Levefy calcula seus macros, monta suas refeições e acompanha seus resultados — tudo automático.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login" className="btn-primary text-base px-8 py-4 gap-2">
            <Brain className="w-5 h-5" /> Gerar meu plano grátis
          </Link>
          <Link href="/membership" className="btn-ghost text-base px-8 py-4">
            Ver planos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-400">Sem cartão de crédito para começar · Resultado em 60 segundos</p>
      </section>

      {/* STATS */}
      <section className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { v: "2.800+", l: "Planos gerados" },
            { v: "94%",    l: "Satisfação" },
            { v: "−3.2kg", l: "Perda média/mês" },
            { v: "60s",    l: "Para gerar seu plano" },
          ].map(s => (
            <div key={s.l}>
              <p className="text-3xl font-extrabold text-gradient">{s.v}</p>
              <p className="text-sm text-slate-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-3xl font-extrabold text-center mb-3">Tudo que você precisa para emagrecer de verdade</h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Sem complicação, sem fórmulas impossíveis. O Levefy se adapta a você.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-6 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING COMPARISON */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-extrabold text-center mb-10">START vs PREMIUM</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: "START", price: "R$ 27", period: "único", color: "border-slate-200", features: ["Meal AI (5 gerações)","Receitas exclusivas","Plano alimentar completo","Desafio 7 dias","Acesso vitalício"] },
              { name: "PREMIUM", price: "R$ 19", period: "/mês", color: "border-brand-600 ring-2 ring-brand-600", features: ["Meal AI ilimitado","Dashboard avançado","Plano semanal + lista compras","Histórico e progresso","XP, streak, gamificação completa","Receitas premium","Suporte prioritário"] },
            ].map(p => (
              <div key={p.name} className={`card p-7 ${p.color}`}>
                <h3 className="font-extrabold text-2xl mb-1">{p.name}</h3>
                <p className="text-3xl font-extrabold mb-5">{p.price}<span className="text-sm font-normal text-slate-500 ml-1">{p.period}</span></p>
                <ul className="space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-brand-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/membership" className="block text-center mt-6 btn-primary py-2.5">Escolher {p.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-extrabold text-center mb-10">O que nossos usuários dizem</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex mb-3">{Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-slate-700 leading-relaxed">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto text-center card p-10 gradient-brand-soft border border-brand-100">
          <h2 className="text-3xl font-extrabold mb-3">Comece sua transformação hoje</h2>
          <p className="text-slate-600 mb-6">Seu plano alimentar personalizado em menos de 60 segundos.</p>
          <Link href="/login" className="btn-primary inline-flex text-base px-10 py-4 gap-2">
            <Brain className="w-5 h-5" /> Criar conta grátis
          </Link>
          <p className="mt-3 text-xs text-slate-400">Sem compromisso · Resultado imediato</p>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        <p>© 2025 Levefy · Todos os direitos reservados</p>
      </footer>

      <MobileStickyCTA href="/login" label="Gerar meu plano grátis" />
    </div>
  );
}
