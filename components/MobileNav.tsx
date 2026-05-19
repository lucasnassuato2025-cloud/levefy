"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/recipes",   icon: UtensilsCrossed, label: "Receitas" },
  { href: "/challenge", icon: Trophy,           label: "Desafio" },
  { href: "/profile",   icon: User,             label: "Perfil" },
  { href: "/membership",icon: Crown,            label: "Premium" },
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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-6 px-1 py-1">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all ${
                active ? "text-brand-700" : "text-slate-400"
              }`}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                active ? "gradient-brand shadow-sm shadow-brand-600/30" : ""
              }`}>
                <Icon className={`w-4 h-4 ${active ? "text-white" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-brand-700" : "text-slate-400"}`}>{label}</span>
            </Link>
          );
        })}
        <button onClick={handleSignOut}
          className="flex flex-col items-center gap-1 py-2 px-1 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium">Sair</span>
        </button>
      </div>
    </nav>
  );
}
