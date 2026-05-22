"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { auth } from "@/lib/auth";

export default function MobileAppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="lg:hidden min-h-dvh overflow-x-hidden bg-[#f6faf8] text-[14px] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#f6faf8]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[520px] items-center justify-between px-3.5">
          <Logo />
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sair"
            title="Sair"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[520px] px-3.5 pb-24 pt-3.5">
        {title && (
          <div className="mb-3">
            <p className="text-xl font-extrabold tracking-tight text-slate-950">{title}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-1 w-8 rounded-full gradient-brand" />
              <span className="h-1 w-2 rounded-full bg-brand-200" />
            </div>
          </div>
        )}
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
