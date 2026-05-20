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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none">
      <div className="relative mx-3 mb-2 mobile-safe-bottom pointer-events-auto">
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sair"
          title="Sair"
          className="absolute -top-12 right-1 flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white/95 text-slate-400 shadow-[0_12px_35px_-18px_rgba(15,23,42,0.7)] backdrop-blur-xl transition hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
        <div className="rounded-[26px] bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.55)] px-1.5 py-1.5">
          <div className="grid grid-cols-5 gap-0.5">
            {items.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-200 ${
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
          </div>
        </div>
      </div>
    </nav>
  );
}
