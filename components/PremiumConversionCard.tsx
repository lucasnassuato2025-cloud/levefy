"use client";

import Link from "next/link";
import { Brain, Crown, Lock, Sparkles, TrendingUp } from "lucide-react";
import { getProjectedWeight, getTransformationPercent, getEmotionalPremiumMessage, PREMIUM_LOCKED_TEASERS } from "@/lib/premium-conversion";

type Props = {
  user?: any;
  variant?: "dashboard" | "membership";
};

export default function PremiumConversionCard({ user, variant = "dashboard" }: Props) {
  const plan = user?.plan ?? "free";
  const isPremium = plan === "premium";
  const currentWeight = user?.currentWeight ?? null;
  const goalWeight = user?.goalWeight ?? null;
  const projected30 = getProjectedWeight(currentWeight, goalWeight, 30);
  const projected90 = getProjectedWeight(currentWeight, goalWeight, 90);
  const percent30 = getTransformationPercent(currentWeight, goalWeight, projected30);
  const emotionalMessage = getEmotionalPremiumMessage({
    name: user?.name,
    plan,
    streak: user?.streakDays,
    xp: user?.xp,
    currentWeight,
    goalWeight,
  });

  return (
    <div className="card overflow-hidden border-brand-100 shadow-premium">
      <div className="relative gradient-brand text-white p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_58%)] pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {isPremium ? "Premium ativo" : "Desbloqueie sua evolução"}
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
              {isPremium ? "Sua rota premium está em andamento" : "Sua projeção avançada já está pronta"}
            </h3>
            <p className="text-sm text-white/82 mt-2 max-w-xl">{emotionalMessage}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            {isPremium ? <Crown className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 bg-white">
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
            <p className="text-[11px] text-brand-700 font-extrabold uppercase tracking-wider">30 dias</p>
            <p className="text-2xl font-extrabold mt-1">{projected30 ? `${projected30}kg` : "Pronto"}</p>
            <p className="text-xs text-slate-500 mt-1">projeção inicial</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 relative overflow-hidden">
            {!isPremium && <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px] flex items-center justify-center"><Lock className="w-5 h-5 text-emerald-700" /></div>}
            <p className="text-[11px] text-emerald-700 font-extrabold uppercase tracking-wider">90 dias</p>
            <p className="text-2xl font-extrabold mt-1">{isPremium && projected90 ? `${projected90}kg` : "Bloq."}</p>
            <p className="text-xs text-slate-500 mt-1">rota completa</p>
          </div>
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 relative overflow-hidden">
            {!isPremium && <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px] flex items-center justify-center"><Lock className="w-5 h-5 text-orange-700" /></div>}
            <p className="text-[11px] text-orange-700 font-extrabold uppercase tracking-wider">Evolução</p>
            <p className="text-2xl font-extrabold mt-1">{isPremium && percent30 !== null ? `${percent30}%` : "IA"}</p>
            <p className="text-xs text-slate-500 mt-1">leitura premium</p>
          </div>
        </div>

        {!isPremium && (
          <div className="space-y-3">
            {PREMIUM_LOCKED_TEASERS.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{item.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-extrabold uppercase">{item.tag}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
            <Link href="/membership" className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" /> Desbloquear minha evolução
            </Link>
            <p className="text-center text-[11px] text-slate-400">Comece pelo START de R$27 ou acelere com Premium mensal.</p>
          </div>
        )}

        {isPremium && (
          <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 text-sm text-brand-800">
            <strong>Insight Premium:</strong> mantenha seu check-in diário para a IA ajustar sua rota e melhorar sua previsão semanal.
          </div>
        )}
      </div>
    </div>
  );
}
