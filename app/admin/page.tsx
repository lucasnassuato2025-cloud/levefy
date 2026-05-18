"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Users, Crown, Zap, TrendingUp, DollarSign, ChefHat } from "lucide-react";

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  startUsers: number;
  totalMeals: number;
  mrr: number;
  recentUsers: Array<{ id: string; email: string; name: string | null; plan: string; createdAt: string; xp: number }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(d => { setStats(d); setLoading(false); });
  }, []);

  const planBadge = (plan: string) => ({
    premium: "bg-brand-100 text-brand-700",
    start:   "bg-blue-100 text-blue-700",
    free:    "bg-slate-100 text-slate-600",
  }[plan] ?? "bg-slate-100 text-slate-600");

  if (loading) return <AppShell title="Admin"><div className="card p-8 text-center text-slate-400">Carregando...</div></AppShell>;

  return (
    <AppShell title="Admin — Analytics">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Users,    label: "Total usuários", value: stats?.totalUsers ?? 0,    color: "text-blue-600",  bg: "bg-blue-50"  },
          { icon: Crown,    label: "Premium",        value: stats?.premiumUsers ?? 0,  color: "text-brand-600", bg: "bg-brand-50" },
          { icon: Zap,      label: "START",          value: stats?.startUsers ?? 0,    color: "text-purple-600", bg: "bg-purple-50" },
          { icon: ChefHat,  label: "Planos gerados", value: stats?.totalMeals ?? 0,   color: "text-amber-600", bg: "bg-amber-50" },
          { icon: DollarSign, label: "MRR",          value: `R$${stats?.mrr ?? 0}`,   color: "text-green-600", bg: "bg-green-50" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100"><h3 className="font-semibold">Usuários recentes</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>{["Email","Nome","Plano","XP","Criado em"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.recentUsers?.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planBadge(u.plan)}`}>{u.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.xp}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
