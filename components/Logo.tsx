import Link from "next/link";
import Image from "next/image";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
      <span className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-brand-600/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
        <Image
          src="/images/logo-levefy.webp"
          alt="Levefy"
          width={40}
          height={40}
          priority
          className="w-full h-full object-cover"
        />
      </span>
      <span className={light ? "text-white" : "text-slate-900"}>Levefy</span>
    </Link>
  );
}
