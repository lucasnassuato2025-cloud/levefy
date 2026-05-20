"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, Shield, LogOut, Brain } from "lucide-react";
import Logo from "./Logo";
import DownloadAppButton from "./DownloadAppButton";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/dashboard",  label: "Painel",          icon: LayoutDashboard, emoji: "📊" },
  { href: "/meal-ai",    label: "Meal AI",         icon: Brain,           emoji: "🧠" },
  { href: "/recipes",    label: "Receitas",        icon: UtensilsCrossed, emoji: "🍽️" },
  { href: "/challenge",  label: "Desafio 21 Dias", icon: Trophy,          emoji: "🏆" },
  { href: "/profile",    label: "Perfil",          icon: User,            emoji: "👤" },
  { href: "/membership", label: "Área Premium",    icon: Crown,           emoji: "👑" },
  { href: "/admin",      label: "Admin",           icon: Shield,          emoji: "🛡️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0"
      style={{
        background: "linear-gradient(180deg, #0d1117 0%, #0f1923 50%, #0a1a0f 100%)",
        borderRight: "1px solid rgba(34,197,94,0.12)",
      }}
    >
      {/* Glow top */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="px-6 py-6 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-green-900/40">
            <span className="text-lg">🌿</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">Levefy</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "rgba(34,197,94,0.5)" }}>
          Menu
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active ? "" : ""
              }`}
              style={active ? {
                background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#4ade80",
                boxShadow: "0 0 20px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
              } : {
                color: "rgba(255,255,255,0.55)",
                border: "1px solid transparent",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200"
                style={active ? {
                  background: "rgba(34,197,94,0.2)",
                } : {
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </span>
              <span className="tracking-tight">{label}</span>
              {active && (
                <span className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }} />
              )}
              {/* Hover effect */}
              {!active && (
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* PWA Block */}
      <div className="mx-3 mb-3 p-4 rounded-2xl"
        style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.18)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">📲</span>
          <p className="text-xs font-bold" style={{ color: "#4ade80" }}>Instale o App</p>
        </div>
        <p className="text-[11px] mb-3 leading-snug" style={{ color: "rgba(255,255,255,0.4)" }}>
          Acesse offline, com performance nativa.
        </p>
        <DownloadAppButton variant="compact" fullWidth />
      </div>

      {/* Sign out */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium w-full text-left transition-all duration-200 mt-3 group"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl group-hover:bg-red-500/10 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
          </span>
          <span className="group-hover:text-red-400 transition-colors">Sair</span>
        </button>
        <p className="mt-3 px-2 text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.18)" }}>
          Lucas Nassuato da Silva
          <br />
          CNPJ 35.593.116/0001-66
        </p>
      </div>
    </aside>
  );
}
