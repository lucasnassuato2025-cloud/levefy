import AppShell from "@/components/AppShell";
import { Check } from "lucide-react";

const plans = [
  { name: "Grátis", price: "R$ 0", per: "para sempre", features: ["Receitas básicas", "Controle de peso", "Acesso à comunidade"], cta: "Plano atual" },
  { name: "Premium", price: "R$ 49", per: "/mês", features: ["Todas as receitas", "Desafios de 21 dias", "Análise de progresso", "Planejador de refeições"], cta: "Assinar Premium", featured: true },
  { name: "VIP", price: "R$ 149", per: "/mês", features: ["Tudo do Premium", "Chat com coach", "Planos alimentares personalizados", "Suporte prioritário"], cta: "Ir para o VIP" },
];

export default function Membership() {
  return (
    <AppShell title="Área Premium">
      <p className="text-slate-600 mb-8 max-w-xl">Escolha o plano que combina com seus objetivos. Faça upgrade ou cancele quando quiser.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(p=>(
          <div key={p.name} className={`card p-7 relative ${p.featured?"ring-2 ring-brand-600":""}`}>
            {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-semibold">Mais popular</span>}
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="mt-2"><span className="text-4xl font-bold">{p.price}</span><span className="text-slate-500">{p.per}</span></p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map(f=>(<li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-brand-600"/>{f}</li>))}
            </ul>
            <button className={`mt-7 w-full ${p.featured?"btn-primary":"btn-ghost"}`}>{p.cta}</button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
