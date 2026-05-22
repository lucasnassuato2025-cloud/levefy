"use client";

import AppShell from "@/components/AppShell";
import { Check, Zap, Crown, Star, ShieldCheck, Lock, TrendingUp, Sparkles, Brain } from "lucide-react";
import { useState } from "react";
import { FREE_VALUE_STACK, PREMIUM_VALUE_STACK } from "@/lib/plan-access";
import { trackConversion } from "@/lib/tracking";

const CAKTO_START_URL = "https://pay.cakto.com.br/3aaao4n_890593";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    per: "para sempre",
    description: "Para sentir o valor do Levefy e criar o primeiro hábito.",
    features: FREE_VALUE_STACK,
    cta: "Plano atual",
    disabled: true,
  },
  {
    name: "START",
    price: "R$ 27",
    per: "pagamento único",
    description: "Entrada de baixo risco para quem quer começar hoje.",
    icon: Zap,
    features: ["5 gerações Meal AI", "Jejum intermitente liberado", "Receitas exclusivas", "Bolos fit e sobremesas", "Desafio 7 dias", "Acesso vitalício ao START"],
    cta: "Comprar START",
    plan: "START",
    pix: true,
  },
  {
    name: "PREMIUM",
    price: "R$ 19",
    per: "/mês",
    description: "Transformação guiada com IA, rotina e progresso contínuo.",
    icon: Crown,
    features: PREMIUM_VALUE_STACK,
    cta: "Assinar PREMIUM",
    plan: "PREMIUM",
    featured: true,
  },
];

const comparison = [
  ["Plano IA semanal", "1x", "5x", "Ilimitado"],
  ["Check-in diário + streak", "Sim", "Sim", "Sim"],
  ["Receitas premium", "Prévia", "Selecionadas", "Ilimitadas"],
  ["Lista de compras", "Simples", "Semanal", "Automática"],
  ["Projeção de evolução", "Bloqueada", "30 dias", "30 e 90 dias"],
  ["Insights avançados", "Bloqueado", "Básico", "Completo"],
];

export default function Membership() {
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = async (plan: string) => {
    const value = plan === "START" ? 27 : 19;
    trackConversion("InitiateCheckout", {
      content_name: `Levefy ${plan}`,
      currency: "BRL",
      value,
    });

    if (plan === "START") {
      window.location.href = CAKTO_START_URL;
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const mobileView = (
    <div className="space-y-3.5">
      <section className="rounded-[1.65rem] gradient-brand p-4 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.8)]">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75">Planos Levefy</p>
        <h1 className="mt-1 text-[1.45rem] font-extrabold leading-tight tracking-tight">Escolha seu acesso</h1>
        <p className="mt-1 text-xs leading-5 text-white/80">Comece gratis, compre START ou assine Premium.</p>
      </section>

      <section className="grid gap-3">
        {plans.map(plan => (
          <article
            key={plan.name}
            className={`rounded-[1.45rem] bg-white p-4 shadow-sm ring-1 ${
              plan.featured ? "ring-brand-200" : "ring-slate-100"
            }`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold text-slate-950">{plan.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{plan.description}</p>
              </div>
              {plan.featured && <span className="rounded-full gradient-brand px-2.5 py-1 text-[10px] font-extrabold text-white">melhor</span>}
              {plan.pix && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">PIX</span>}
            </div>
            <p>
              <span className="text-3xl font-black text-slate-950">{plan.price}</span>
              <span className="ml-1 text-xs font-bold text-slate-400">{plan.per}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.slice(0, 5).map(feature => (
                <li key={feature} className="flex items-start gap-2 text-xs font-medium leading-5 text-slate-700">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.disabled || loading === plan.plan}
              onClick={() => plan.plan && checkout(plan.plan)}
              className={`mt-4 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-extrabold ${
                plan.featured
                  ? "gradient-brand text-white shadow-brand"
                  : plan.disabled
                    ? "bg-slate-100 text-slate-400"
                    : "border border-slate-200 bg-white text-slate-950"
              }`}
            >
              {loading === plan.plan ? "Redirecionando..." : plan.cta}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-[1.45rem] bg-brand-50 p-3.5 ring-1 ring-brand-100">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-700" />
          <div>
            <p className="text-sm font-extrabold text-slate-950">Pagamento seguro</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-600">PIX, cartao e acesso liberado automaticamente quando o pagamento for aprovado.</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <AppShell title="Planos" mobile={mobileView}>
      <div className="relative overflow-hidden rounded-[1.35rem] sm:rounded-[2rem] gradient-brand text-white p-4 sm:p-8 mb-5 sm:mb-8 shadow-premium">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="relative grid lg:grid-cols-[1.4fr_.8fr] gap-4 sm:gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Upgrade inteligente
            </div>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Free cria o hábito. Premium acelera a transformação.
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/80 max-w-2xl">
              O Levefy foi organizado para entregar valor rápido no grátis e destravar personalização, recorrência e acompanhamento profundo no pago.
            </p>
          </div>
          <div className="bg-white/12 backdrop-blur rounded-[1.25rem] sm:rounded-3xl p-4 sm:p-5 border border-white/15">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8 text-emerald-100" />
              <div>
                <p className="font-extrabold">Momento WOW Premium</p>
                <p className="text-xs text-white/70">Projeção personalizada para o usuário sentir o valor.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-white/12 p-3">
                <p className="text-xl sm:text-2xl font-extrabold">30 dias</p>
                <p className="text-xs text-white/70">rota de evolução</p>
              </div>
              <div className="rounded-2xl bg-white/12 p-3">
                <p className="text-xl sm:text-2xl font-extrabold">90 dias</p>
                <p className="text-xs text-white/70">visão de resultado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
        {plans.map(p => (
          <div
            key={p.name}
            className={`card p-4 sm:p-8 relative flex flex-col transition-all duration-300 ${
              p.featured
                ? "card-premium ring-2 ring-brand-500/30 shadow-premium md:-translate-y-2"
                : "card-hover"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-brand text-white text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-brand">
                <Star className="w-3 h-3 fill-current" /> Melhor para resultado
              </span>
            )}
            {p.pix && (
              <span className="absolute -top-3 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-soft">
                PIX & Cartão
              </span>
            )}

            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              {p.icon ? (
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  p.featured ? "gradient-brand shadow-brand" : "bg-brand-50"
                }`}>
                  <p.icon className={`w-5 h-5 ${p.featured ? "text-white" : "text-brand-600"}`} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
              </div>
            </div>

            <p className="mb-2 leading-none">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${p.featured ? "text-gradient-soft" : "text-slate-900"}`}>
                {p.price}
              </span>
              <span className="text-slate-500 text-sm ml-1.5 font-medium">{p.per}</span>
            </p>
            {p.plan === "START" && (
              <p className="mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-relaxed text-blue-700">
                Use o mesmo e-mail da sua conta Levefy para liberar o START automaticamente.
              </p>
            )}

            <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 flex-1">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    p.featured ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={p.disabled || loading === p.plan}
              onClick={() => p.plan && checkout(p.plan)}
              className={`mt-5 sm:mt-8 w-full font-bold py-3 rounded-full transition-all duration-200 sm:py-3.5 ${
                p.featured
                  ? "btn-primary"
                  : p.disabled
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "btn-ghost"
              }`}
            >
              {loading === p.plan ? "Redirecionando..." : p.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-7 sm:mt-10 card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          <h3 className="font-extrabold">Comparação clara: Free x START x PREMIUM</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-4 font-bold">Recurso</th>
                <th className="text-left p-4 font-bold">Free</th>
                <th className="text-left p-4 font-bold">START</th>
                <th className="text-left p-4 font-bold text-brand-700">PREMIUM</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(row => (
                <tr key={row[0]} className="border-t border-slate-100">
                  {row.map((cell, i) => <td key={i} className={`p-4 ${i === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-7 sm:mt-10 card p-4 sm:p-7 gradient-brand-soft border border-brand-100">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <h3 className="font-bold text-brand-800">Pagamento 100% seguro</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 text-sm text-slate-700">
          <div className="bg-white/70 rounded-2xl p-3.5 sm:p-4 border border-white">
            <strong className="block text-slate-900">PIX instantâneo</strong>
            <span className="text-slate-500 text-xs">Acesso imediato após pagamento</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-3.5 sm:p-4 border border-white">
            <strong className="block text-slate-900">Cartão de crédito</strong>
            <span className="text-slate-500 text-xs">Visa, Mastercard, Elo e mais</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-3.5 sm:p-4 border border-white">
            <strong className="block text-slate-900">Cancele quando quiser</strong>
            <span className="text-slate-500 text-xs">Sem multa nem fidelidade</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
