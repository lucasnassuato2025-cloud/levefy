"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, LogOut, Brain } from "lucide-react";
import { auth } from "@/lib/auth";

const items = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Painel" },
  { href: "/meal-ai",     icon: Brain,           label: "Meal AI" },
  { href: "/recipes",     icon: UtensilsCrossed, label: "Receitas" },
  { href: "/challenge",   icon: Trophy,          label: "Desafio" },
  { href: "/profile",     icon: User,            label: "Perfil" },
  { href: "/membership",  icon: Crown,           label: "Planos" },
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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="relative mx-auto mb-1 w-[calc(100%-1rem)] max-w-xl mobile-safe-bottom pointer-events-auto sm:w-[calc(100%-2rem)]">
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sair"
          title="Sair"
          className="absolute -top-10 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white/95 text-slate-400 shadow-[0_12px_35px_-18px_rgba(15,23,42,0.7)] backdrop-blur-xl transition hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
        </button>
        <div className="rounded-[24px] border border-slate-100 bg-white/[0.92] px-1 py-1 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <div className="grid grid-cols-6 gap-0.5">
            {items.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-[18px] px-0.5 py-1.5 transition-all duration-200 ${
                    active ? "text-brand-700" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-200 ${
                      active ? "gradient-brand shadow-brand scale-105" : ""
                    }`}
                  >
                    <Icon className={`h-[17px] w-[17px] ${active ? "text-white" : ""}`} />
                  </div>
                  <span className={`max-w-full truncate text-[9px] font-bold leading-none tracking-normal sm:text-[10px] ${active ? "text-brand-700" : "text-slate-400"}`}>
                    {label}
                  </span>
                  {active && (
                    <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
