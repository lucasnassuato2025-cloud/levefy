import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 text-xl font-extrabold"
      aria-label="Levefy"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl gradient-brand shadow-lg shadow-brand-600/25 ring-1 ring-white/30 transition-transform group-hover:scale-105">
        <span className="absolute inset-0 bg-white/10" />
        <Leaf className="relative h-6 w-6 text-white" strokeWidth={2.5} />
      </span>
      <span className={light ? "text-white" : "text-slate-900"}>Levefy</span>
    </Link>
  );
}
