"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, Shield, LogOut, Brain } from "lucide-react";
import Logo from "./Logo";
import DownloadAppButton from "./DownloadAppButton";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/dashboard",  label: "Painel",          icon: LayoutDashboard },
  { href: "/meal-ai",    label: "Meal AI",         icon: Brain },
  { href: "/recipes",    label: "Receitas",        icon: UtensilsCrossed },
  { href: "/challenge",  label: "Desafio 21 Dias", icon: Trophy },
  { href: "/profile",    label: "Perfil",          icon: User },
  { href: "/membership", label: "Área Premium",    icon: Crown },
  { href: "/admin",      label: "Admin",           icon: Shield },
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-100 bg-white/80 backdrop-blur-xl h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Menu
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "gradient-brand text-white shadow-brand"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white/15"
                    : "bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? "" : "group-hover:scale-110"}`} />
              </span>
              <span className="tracking-tight">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
            </Link>
          );
        })}
      </nav>

      {/* PWA Block */}
      <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-emerald-50 to-white border border-brand-100/80 shadow-soft">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">📲</span>
          <p className="text-xs font-bold text-brand-700">Instale o App</p>
        </div>
        <p className="text-[11px] text-slate-500 mb-3 leading-snug">
          Acesse offline, com performance nativa.
        </p>
        <DownloadAppButton variant="compact" fullWidth />
      </div>

      {/* Sign out */}
      <div className="px-3 pb-5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 w-full text-left transition-all duration-200"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50">
            <LogOut className="w-4 h-4" />
          </span>
          Sair
        </button>
        <p className="mt-4 px-2 text-[10px] text-slate-300 leading-relaxed">
          Lucas Nassuato da Silva
          <br />
          CNPJ 35.593.116/0001-66
        </p>
      </div>
    </aside>
  );
}
