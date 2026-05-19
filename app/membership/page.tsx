"use client";

import AppShell from "@/components/AppShell";
import { Check, Zap, Crown, Star, ShieldCheck } from "lucide-react";
import { useState } from "react";

const CAKTO_START_URL = "https://pay.cakto.com.br/3aaao4n_890593";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    per: "para sempre",
    features: ["Receitas básicas", "Controle de peso", "Dashboard simples"],
    cta: "Plano atual",
    disabled: true,
  },
  {
    name: "START",
    price: "R$ 27",
    per: "pagamento único",
    icon: Zap,
    features: ["Meal AI (5 gerações)", "Receitas exclusivas", "Plano alimentar", "Desafio 7 dias", "Acesso vitalício"],
    cta: "Comprar START",
    plan: "START",
    pix: true,
  },
  {
    name: "PREMIUM",
    price: "R$ 19",
    per: "/mês",
    icon: Crown,
    features: [
      "Meal AI ilimitado",
      "Dashboard avançado + gráficos",
      "Plano semanal completo",
      "Lista de compras automática",
      "Histórico e progresso",
      "Streak diário + gamificação",
      "Receitas premium",
      "Suporte prioritário",
    ],
    cta: "Assinar PREMIUM",
    plan: "PREMIUM",
    featured: true,
  },
];

export default function Membership() {
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = async (plan: string) => {
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

  return (
    <AppShell title="Área Premium">
      <div className="max-w-2xl mb-10">
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Desbloqueie todo o potencial do Levefy com um plano premium.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600" />
          </span>
          <span className="text-xs font-bold text-brand-700">
            Mais de 2.800 pessoas já transformaram sua alimentação
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        {plans.map(p => (
          <div
            key={p.name}
            className={`card p-7 sm:p-8 relative flex flex-col transition-all duration-300 ${
              p.featured
                ? "card-premium ring-2 ring-brand-500/30 shadow-premium md:-translate-y-2"
                : "card-hover"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-brand text-white text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1 shadow-brand">
                <Star className="w-3 h-3 fill-current" /> Mais popular
              </span>
            )}
            {p.pix && (
              <span className="absolute -top-3 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-soft">
                PIX & Cartão
              </span>
            )}

            <div className="flex items-center gap-2.5 mb-4">
              {p.icon && (
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  p.featured ? "gradient-brand shadow-brand" : "bg-brand-50"
                }`}>
                  <p.icon className={`w-5 h-5 ${p.featured ? "text-white" : "text-brand-600"}`} />
                </div>
              )}
              <h3 className="font-extrabold text-xl tracking-tight">{p.name}</h3>
            </div>

            <p className="mb-2 leading-none">
              <span className={`text-5xl font-extrabold tracking-tight ${p.featured ? "text-gradient-soft" : "text-slate-900"}`}>
                {p.price}
              </span>
              <span className="text-slate-500 text-sm ml-1.5 font-medium">{p.per}</span>
            </p>

            <ul className="mt-6 space-y-3 flex-1">
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
              className={`mt-8 w-full font-bold py-3.5 rounded-full transition-all duration-200 ${
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

      <div className="mt-10 card p-6 sm:p-7 gradient-brand-soft border border-brand-100">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <h3 className="font-bold text-brand-800">Pagamento 100% seguro</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="bg-white/70 rounded-2xl p-4 border border-white">
            <strong className="block text-slate-900">PIX instantâneo</strong>
            <span className="text-slate-500 text-xs">Acesso imediato após pagamento</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-white">
            <strong className="block text-slate-900">Cartão de crédito</strong>
            <span className="text-slate-500 text-xs">Visa, Mastercard, Elo e mais</span>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 border border-white">
            <strong className="block text-slate-900">Cancele quando quiser</strong>
            <span className="text-slate-500 text-xs">Sem multa nem fidelidade</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
