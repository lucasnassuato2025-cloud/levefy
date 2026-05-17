"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, Shield, LogOut } from "lucide-react";
import Logo from "./Logo";
import DownloadAppButton from "./DownloadAppButton";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/recipes", label: "Receitas", icon: UtensilsCrossed },
  { href: "/challenge", label: "Desafio 21 Dias", icon: Trophy },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/membership", label: "Área Premium", icon: Crown },
  { href: "/admin", label: "Admin", icon: Shield },
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0 p-6">
      <Logo />
      <nav className="mt-8 flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>

      {/* Download App CTA */}
      <div className="mb-4 rounded-2xl p-4 gradient-brand-soft border border-brand-100">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">App PWA</p>
        <p className="mt-1 text-sm text-slate-700 leading-snug">
          Instale o Levefy no celular e abra direto da tela inicial.
        </p>
        <div className="mt-3">
          <DownloadAppButton variant="compact" fullWidth />
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 w-full text-left"
      >
        <LogOut className="w-4 h-4" /> Sair
      </button>
    </aside>
  );
}
