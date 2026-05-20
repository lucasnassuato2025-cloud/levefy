"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, LogOut, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";

const items = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Painel" },
  { href: "/onboarding", icon: Sparkles,        label: "Quiz" },
  { href: "/challenge",  icon: Trophy,           label: "Desafio" },
  { href: "/profile",    icon: User,             label: "Perfil" },
  { href: "/membership", icon: Crown,            label: "Premium" },
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
    <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40">
      <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.18)] px-1.5 py-1.5">
        <div className="grid grid-cols-6">
          {items.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all duration-200 ${
                  active ? "text-brand-700" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                    active ? "gradient-brand shadow-brand scale-105" : ""
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${active ? "text-white" : ""}`} />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${active ? "text-brand-700" : "text-slate-400"}`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600" />
                )}
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 py-2 px-1 rounded-2xl text-slate-400 hover:text-red-500 transition-all duration-200"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-2xl">
              <LogOut className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[10px] font-semibold">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
