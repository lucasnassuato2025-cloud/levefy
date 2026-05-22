import Link from "next/link";
import Logo from "@/components/Logo";
import MobileInstallBanner from "@/components/MobileInstallBanner";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  Check,
  Clock3,
  Crown,
  Lock,
  Salad,
  ShieldCheck,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Levefy | Rotina saudável com IA",
  description:
    "Organize refeições, receitas, hábitos e check-ins em um só lugar. Comece grátis com o Levefy.",
  openGraph: {
    title: "Levefy | Rotina saudável com IA",
    description:
      "Planos alimentares, receitas e hábitos com IA para deixar sua rotina mais simples.",
    url: "https://levefy-mu.vercel.app",
    siteName: "Levefy",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Levefy - Rotina saudável com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Levefy | Rotina saudável com IA",
    description:
      "Planos alimentares, receitas e hábitos com IA para deixar sua rotina mais simples.",
    images: ["/og.jpg"],
  },
};

const BENEFITS = [
  {
    icon: Brain,
    title: "Meal AI",
    desc: "Gere planos alimentares com base na sua rotina, objetivo e preferências.",
    accent: "bg-emerald-50 text-brand-700",
  },
  {
    icon: Clock3,
    title: "Jejum intermitente",
    desc: "START e Premium liberam protocolos 12/12, 14/10 e 16/8 dentro do plano.",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    icon: Utensils,
    title: "Receitas prontas",
    desc: "Refeições, lanches, bolos fit e sobremesas com fotos e preparo simples.",
    accent: "bg-rose-50 text-rose-700",
  },
  {
    icon: CalendarCheck,
    title: "Check-ins diários",
    desc: "Acompanhe hábitos, progresso e consistência sem complicar seu dia.",
    accent: "bg-sky-50 text-sky-700",
  },
];

const STEPS = [
  "Crie sua conta grátis",
  "Informe sua rotina e objetivo",
  "Receba sugestões com IA",
  "Acompanhe seus hábitos no painel",
];

const PLANS = [
  {
    name: "Free",
    price: "R$0",
    period: "para começar",
    description: "Teste a plataforma antes de assinar.",
    href: "/login",
    cta: "Começar grátis",
    features: ["2 planos IA por semana", "Receitas básicas", "Dashboard e check-ins"],
  },
  {
    name: "START",
    price: "R$27",
    period: "pagamento único",
    description: "Para quem quer mais opções sem mensalidade.",
    href: "/membership",
    cta: "Ver START",
    featured: true,
    features: ["Meal AI com mais uso", "Jejum intermitente", "Bolos fit e sobremesas"],
  },
  {
    name: "Premium",
    price: "R$19",
    period: "por mês",
    description: "Para usar tudo com mais liberdade.",
    href: "/membership",
    cta: "Ver Premium",
    features: ["Meal AI ilimitado", "Receitas premium", "Recursos avançados"],
  },
];

function MiniDashboard() {
  const meals = [
    { label: "Café", kcal: "380", done: true },
    { label: "Almoço", kcal: "620", done: true },
    { label: "Lanche", kcal: "240", done: false },
    { label: "Jantar", kcal: "510", done: false },
  ];

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.08] shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-extrabold uppercase text-emerald-300">
            Plano de hoje
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white sm:text-2xl">
            Rotina saudável em ordem
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          Ativo
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-white">Refeições</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
              2 de 4
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {meals.map((meal) => (
              <div
                key={meal.label}
                className={`rounded-2xl border p-3 ${
                  meal.done
                    ? "border-emerald-300/30 bg-emerald-400/10"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-900">
                    {meal.label.slice(0, 1)}
                  </span>
                  {meal.done ? (
                    <Check className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <Lock className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <p className="text-sm font-bold text-white">{meal.label}</p>
                <p className="text-xs text-slate-400">{meal.kcal} kcal</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                <Salad className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Receita sugerida
                </p>
                <p className="font-extrabold text-white">
                  Bowl proteico simples
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-slate-400">
                Consistência
              </p>
              <p className="text-sm font-extrabold text-emerald-300">78%</p>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div className="h-3 w-[78%] rounded-full bg-gradient-to-r from-emerald-400 via-brand-500 to-sky-400" />
            </div>
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="text-xs font-bold uppercase text-amber-200">
              Jejum START
            </p>
            <p className="mt-1 font-extrabold text-white">16/8 configurável</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/membership"
              className="hidden text-sm font-bold text-slate-500 transition hover:text-brand-700 sm:inline"
            >
              Planos
            </Link>
            <Link href="/login" className="btn-brand px-5 py-2.5 text-sm">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-slate-950 px-4 pt-4 sm:hidden">
        <MobileInstallBanner />
      </div>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl content-center gap-10 px-4 py-10 sm:px-6 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-extrabold uppercase text-emerald-200">
              <Sparkles className="h-4 w-4" />
              SaaS fitness para rotina alimentar
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              Organize sua rotina saudável com IA em poucos minutos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              O Levefy reúne plano alimentar, receitas, jejum intermitente,
              check-ins e dashboard em uma experiência simples para usar todos
              os dias.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="btn-brand w-full px-8 py-4 text-base sm:w-auto"
              >
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/membership"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.08] px-8 py-4 text-base font-bold text-white transition hover:bg-white/[0.12] sm:w-auto"
              >
                Ver planos
              </Link>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-500">
              Sem cartão para testar. Cancele quando quiser no plano mensal.
            </p>
          </div>

          <MiniDashboard />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase text-brand-700">
              O essencial
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Seu plano em um só lugar.
            </h2>
            <p className="mt-3 text-slate-600">
              Refeições, receitas, hábitos e acompanhamento diário para deixar
              sua rotina mais leve e organizada.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand-200"
                >
                  <span
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-950">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase text-brand-700">
              Como funciona
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Caminho curto até o primeiro plano.
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Em poucos passos, o Levefy entende sua rotina e ajuda você a
              montar um caminho mais simples para seguir todos os dias.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
            >
              Criar minha conta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className="flex min-h-28 items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-brand text-sm font-black text-white shadow-brand">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-950">{step}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Simples, rápido e pensado para rotina real.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16" id="planos">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase text-brand-700">
              Planos
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Comece grátis e evolua quando fizer sentido.
            </h2>
            <p className="mt-3 text-slate-600">
              Free para testar, START para liberar recursos extras e Premium
              para uso mais completo.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-3xl border p-6 shadow-soft ${
                  plan.featured
                    ? "border-brand-300 bg-brand-50/60 ring-2 ring-brand-100"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full gradient-brand px-3 py-1 text-xs font-extrabold text-white shadow-brand">
                    <Zap className="h-3.5 w-3.5" />
                    Popular
                  </span>
                )}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  {plan.name === "Premium" ? (
                    <Crown className="h-6 w-6" />
                  ) : plan.name === "START" ? (
                    <Sparkles className="h-6 w-6" />
                  ) : (
                    <Brain className="h-6 w-6" />
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-slate-950">
                  {plan.name}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>
                <div className="mt-5">
                  <span className="text-4xl font-black text-slate-950">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm font-bold text-slate-500">
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm font-medium text-slate-700"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold transition ${
                    plan.featured
                      ? "btn-brand"
                      : "border border-slate-200 bg-white text-slate-900 hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase text-emerald-300">
              Comece hoje
            </p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Uma rotina saudável mais simples de seguir.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Organize sua alimentação, encontre novas ideias de receitas e
              acompanhe seus hábitos com uma experiência feita para o dia a dia.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-brand px-8 py-4 text-base">
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
              >
                Ver privacidade
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                icon: ShieldCheck,
                title: "Plano personalizado",
                desc: "Sugestões adaptadas à sua rotina, objetivo e preferências.",
              },
              {
                icon: Lock,
                title: "Privacidade",
                desc: "Seus dados ajudam a montar sua experiência dentro do Levefy.",
              },
              {
                icon: Salad,
                title: "Receitas práticas",
                desc: "Opções para refeições, lanches, bolos fit e sobremesas.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="font-bold hover:text-brand-700">
              Privacidade
            </Link>
            <Link href="/terms" className="font-bold hover:text-brand-700">
              Termos
            </Link>
            <span>Levefy não substitui orientação médica ou nutricional.</span>
            <span className="flex flex-col gap-0.5 text-left leading-tight text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                Desenvolvimento
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Lucas Nassuato da Silva
              </span>
              <span className="text-xs">
                © 2026 Levefy
              </span>
            </span>
          </div>
        </div>
      </footer>

      <MobileStickyCTA href="/login" label="Começar grátis" />
    </main>
  );
}
