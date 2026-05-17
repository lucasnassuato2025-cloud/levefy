import Link from "next/link";
import { Leaf } from "lucide-react";
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
      <span className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white">
        <Leaf className="w-5 h-5" />
      </span>
      <span className={light ? "text-white" : "text-slate-900"}>Levefy</span>
    </Link>
  );
}
