"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/recipes",   icon: UtensilsCrossed, label: "Receitas" },
  { href: "/challenge", icon: Trophy,          label: "Desafio" },
  { href: "/profile",   icon: User,            label: "Perfil" },
  { href: "/membership",icon: Crown,           label: "Premium" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-6">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href}
            className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-brand-700" : "text-slate-500"}`}>
            <Icon className="w-5 h-5" /> {label}
          </Link>
        );
      })}
      <button onClick={handleSignOut}
        className="flex flex-col items-center gap-1 py-2.5 text-xs text-slate-500 hover:text-red-500 transition">
        <LogOut className="w-5 h-5" /> Sair
      </button>
    </nav>
  );
}
