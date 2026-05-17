"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Trophy, User, Crown, Shield, LogOut } from "lucide-react";
import Logo from "./Logo";
import { auth } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/challenge", label: "21-Day Challenge", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/membership", label: "Membership", icon: Crown },
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
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 w-full text-left"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>
    </aside>
  );
}
