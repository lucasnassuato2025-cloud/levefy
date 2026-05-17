import AppShell from "@/components/AppShell";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", per: "forever", features: ["Basic recipes", "Weight tracker", "Community access"], cta: "Current plan" },
  { name: "Premium", price: "$9", per: "/month", features: ["All recipes", "21-day challenges", "Progress analytics", "Meal planner"], cta: "Upgrade", featured: true },
  { name: "VIP", price: "$29", per: "/month", features: ["Everything in Premium", "1:1 coach chat", "Custom meal plans", "Priority support"], cta: "Go VIP" },
];

export default function Membership() {
  return (
    <AppShell title="Membership">
      <p className="text-slate-600 mb-8 max-w-xl">Pick the plan that fits your goals. Upgrade or cancel anytime.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(p=>(
          <div key={p.name} className={`card p-7 relative ${p.featured?"ring-2 ring-brand-600":""}`}>
            {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-semibold">Most popular</span>}
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
