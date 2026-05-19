"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, Shield, LogOut, Brain } from "lucide-react";
import Logo from "./Logo";
import DownloadAppButton from "./DownloadAppButton";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Painel",        icon: LayoutDashboard },
  { href: "/meal-ai",   label: "Meal AI",        icon: Brain },
  { href: "/recipes",   label: "Receitas",        icon: UtensilsCrossed },
  { href: "/challenge", label: "Desafio 21 Dias", icon: Trophy },
  { href: "/profile",   label: "Perfil",          icon: User },
  { href: "/membership",label: "Área Premium",    icon: Crown },
  { href: "/admin",     label: "Admin",           icon: Shield },
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-100 bg-white h-screen sticky top-0">
      {/* Logo area */}
      <div className="px-6 py-5 border-b border-slate-100">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "gradient-brand text-white shadow-md shadow-brand-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}>
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? "" : "group-hover:scale-110"}`} />
              <span>{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* PWA Block */}
      <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100">
        <p className="text-xs font-bold text-brand-700 mb-1">📲 Instale o App</p>
        <p className="text-xs text-slate-500 mb-3 leading-snug">Acesse offline, sem navegador.</p>
        <DownloadAppButton variant="compact" fullWidth />
      </div>

      {/* Sign out */}
      <div className="px-3 pb-4">
        <button onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 w-full text-left transition-all duration-150">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </aside>
  );
}
