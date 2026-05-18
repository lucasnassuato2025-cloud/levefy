"use client";

import AppShell from "@/components/AppShell";
import { Check, Zap, Crown, Star } from "lucide-react";
import { useState } from "react";

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
      <p className="text-slate-600 mb-2 max-w-xl">Desbloqueie todo o potencial do Levefy.</p>
      <p className="text-sm text-brand-700 font-semibold mb-8">⚡ Mais de 2.800 pessoas já transformaram sua alimentação</p>

      <div className="grid md:grid-cols-3 gap-5 items-start">
        {plans.map(p => (
          <div key={p.name} className={`card p-7 relative flex flex-col ${p.featured ? "ring-2 ring-brand-600 shadow-lg shadow-brand-600/10" : ""}`}>
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-brand text-white text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Mais popular
              </span>
            )}
            {p.pix && (
              <span className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                PIX & Cartão
              </span>
            )}

            <div className="flex items-center gap-2 mb-4">
              {p.icon && <p.icon className="w-5 h-5 text-brand-600" />}
              <h3 className="font-bold text-lg">{p.name}</h3>
            </div>

            <p className="mb-1">
              <span className="text-4xl font-extrabold">{p.price}</span>
              <span className="text-slate-500 text-sm ml-1">{p.per}</span>
            </p>

            <ul className="mt-6 space-y-2.5 flex-1">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              disabled={p.disabled || loading === p.plan}
              onClick={() => p.plan && checkout(p.plan)}
              className={`mt-7 w-full font-semibold py-3 rounded-full transition ${
                p.featured ? "btn-primary" : p.disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed rounded-full" : "btn-ghost"
              }`}
            >
              {loading === p.plan ? "Redirecionando..." : p.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6 gradient-brand-soft border border-brand-100">
        <h3 className="font-semibold text-brand-800 mb-3">🔒 Pagamento 100% seguro</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-700">
          <div><strong>PIX instantâneo</strong><br/>Acesso imediato após pagamento</div>
          <div><strong>Cartão de crédito</strong><br/>Visa, Mastercard, Elo e mais</div>
          <div><strong>Cancele quando quiser</strong><br/>Sem multa nem fidelidade</div>
        </div>
      </div>
    </AppShell>
  );
}
