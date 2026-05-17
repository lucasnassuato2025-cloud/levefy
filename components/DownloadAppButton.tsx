"use client";
import { useEffect, useState, useRef } from "react";
import { Download, Smartphone, Apple, ChevronDown } from "lucide-react";

/**
 * Links de download — ajuste quando publicar nas lojas.
 * Enquanto não existirem, tudo cai no PWA (`/dashboard`).
 */
const LINKS = {
  playStore: "", // ex: "https://play.google.com/store/apps/details?id=app.levefy"
  appStore: "",  // ex: "https://apps.apple.com/app/levefy/id000000"
  apk: "",       // ex: "/downloads/levefy.apk"
  pwa: "/dashboard",
};

type Device = "android" | "ios" | "desktop";

function detectDevice(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  return "desktop";
}

function primaryHrefFor(device: Device) {
  if (device === "android") return LINKS.apk || LINKS.playStore || LINKS.pwa;
  if (device === "ios") return LINKS.appStore || LINKS.pwa;
  return LINKS.pwa;
}

function primaryLabelFor(device: Device) {
  if (device === "android") return LINKS.apk ? "Baixar APK" : LINKS.playStore ? "Google Play" : "Instalar PWA";
  if (device === "ios") return LINKS.appStore ? "App Store" : "Instalar PWA";
  return "Baixar App";
}

export interface DownloadAppButtonProps {
  variant?: "primary" | "ghost" | "white" | "compact";
  className?: string;
  fullWidth?: boolean;
  label?: string;
}

export default function DownloadAppButton({
  variant = "primary",
  className = "",
  fullWidth = false,
  label,
}: DownloadAppButtonProps) {
  const [device, setDevice] = useState<Device>("desktop");
  const [canInstall, setCanInstall] = useState(false);
  const [open, setOpen] = useState(false);
  const deferredPrompt = useRef<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDevice(detectDevice());
    const onBIP = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const triggerPwaInstall = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      try { await deferredPrompt.current.userChoice; } catch {}
      deferredPrompt.current = null;
      setCanInstall(false);
    } else {
      window.location.href = LINKS.pwa;
    }
  };

  const base =
    "group relative inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-200 select-none";
  const sizes = variant === "compact" ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm lg:text-base";
  const wide = fullWidth ? "w-full justify-center" : "";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 hover:-translate-y-0.5",
    ghost:
      "border border-slate-200 text-slate-700 hover:border-brand-600 hover:text-brand-700 bg-white/70 backdrop-blur",
    white:
      "bg-white text-brand-700 hover:bg-brand-50 shadow-lg shadow-black/10",
    compact:
      "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 hover:shadow-lg hover:-translate-y-0.5",
  };

  const primaryHref = primaryHrefFor(device);
  const primaryLabel = label ?? primaryLabelFor(device);

  const handlePrimary = (e: React.MouseEvent) => {
    if (primaryHref === LINKS.pwa && canInstall) {
      e.preventDefault();
      triggerPwaInstall();
    }
  };

  return (
    <div ref={ref} className={`relative inline-flex ${fullWidth ? "w-full" : ""} ${className}`}>
      <a
        href={primaryHref}
        onClick={handlePrimary}
        className={`${base} ${sizes} ${variants[variant]} ${wide} rounded-r-none pr-3`}
        aria-label={`${primaryLabel} — Levefy`}
      >
        <Download className="w-4 h-4" aria-hidden />
        <span>{primaryLabel}</span>
        <span className="ml-1 hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
          PWA
        </span>
      </a>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mais opções de download"
        aria-expanded={open}
        className={`${base} ${sizes} ${variants[variant]} rounded-l-none border-l border-white/20 px-3`}
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 p-2 animate-fade-in">
          <DownloadRow
            icon={<Smartphone className="w-4 h-4" />}
            title="Android"
            sub={LINKS.apk ? "APK direto" : LINKS.playStore ? "Google Play" : "Instalar como PWA"}
            href={LINKS.apk || LINKS.playStore || LINKS.pwa}
            highlight={device === "android"}
            onClick={(e) => {
              if (!LINKS.apk && !LINKS.playStore && canInstall) {
                e.preventDefault();
                triggerPwaInstall();
              }
            }}
          />
          <DownloadRow
            icon={<Apple className="w-4 h-4" />}
            title="iPhone / iPad"
            sub={LINKS.appStore ? "App Store" : "Instalar como PWA"}
            href={LINKS.appStore || LINKS.pwa}
            highlight={device === "ios"}
          />
          <DownloadRow
            icon={<Download className="w-4 h-4" />}
            title="Web App (PWA)"
            sub="Abre no navegador"
            href={LINKS.pwa}
            highlight={device === "desktop"}
            onClick={(e) => {
              if (canInstall) {
                e.preventDefault();
                triggerPwaInstall();
              }
            }}
          />
          <p className="px-3 py-2 text-[11px] text-slate-400 leading-snug">
            Detectamos seu dispositivo automaticamente para a melhor experiência.
          </p>
        </div>
      )}
    </div>
  );
}

function DownloadRow({
  icon, title, sub, href, highlight, onClick,
}: {
  icon: React.ReactNode; title: string; sub: string; href: string;
  highlight?: boolean; onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition ${
        highlight ? "bg-brand-50" : "hover:bg-slate-50"
      }`}
    >
      <span className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${
        highlight ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
      }`}>{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-slate-800">{title}</span>
        <span className="block text-xs text-slate-500">{sub}</span>
      </span>
      {highlight && (
        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
          Você
        </span>
      )}
    </a>
  );
}
