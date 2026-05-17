"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown } from "lucide-react";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/recipes", icon: UtensilsCrossed, label: "Receitas" },
  { href: "/challenge", icon: Trophy, label: "Desafio" },
  { href: "/profile", icon: User, label: "Perfil" },
  { href: "/membership", icon: Crown, label: "Premium" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-5">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-brand-700" : "text-slate-500"}`}>
            <Icon className="w-5 h-5" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
