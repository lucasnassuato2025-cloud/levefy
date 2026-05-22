"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import DownloadAppButton from "./DownloadAppButton";

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent || "");
}

function isStandaloneApp() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function MobileInstallBanner({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isMobileDevice() && !isStandaloneApp());
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`md:hidden rounded-[1.35rem] border border-emerald-100 bg-white p-3 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.8)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl gradient-brand text-white shadow-brand">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-950">Instale o Levefy no celular</p>
          <p className="text-[11px] leading-4 text-slate-500">Abra como app, em tela cheia e com acesso rapido.</p>
        </div>
      </div>
      <DownloadAppButton className="mt-3" variant="compact" fullWidth label="Instalar app" />
    </div>
  );
}
