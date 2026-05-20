"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, X, Monitor, Share, MoreHorizontal, Plus, CheckCircle2, Smartphone } from "lucide-react";

type Device = "android" | "ios" | "desktop";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function detectDevice(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  return "desktop";
}

function isStandaloneApp() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
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
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [installed, setInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setMounted(true);
    setDevice(detectDevice());
    setInstalled(isStandaloneApp());

    const onBIP = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredPrompt.current = null;
      setCanInstall(false);
      setInstalled(true);
      setShowModal(false);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [showModal]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (installed) {
      setShowModal(true);
      return;
    }

    // Chrome/Edge/Android com suporte real ao prompt de instalação.
    if (deferredPrompt.current) {
      try {
        await deferredPrompt.current.prompt();
        const choice = await deferredPrompt.current.userChoice;
        if (choice.outcome === "accepted") {
          setInstalled(true);
        }
      } catch {
        setShowModal(true);
      } finally {
        deferredPrompt.current = null;
        setCanInstall(false);
      }
      return;
    }

    // iOS/Safari e navegadores sem prompt nativo: mostra instruções por cima da tela.
    setShowModal(true);
  };

  const buttonLabel = installed ? "App instalado" : label ?? "Baixar App";

  const base = "group relative inline-flex items-center gap-2 font-extrabold rounded-full transition-all duration-200 select-none focus:outline-none focus:ring-4 focus:ring-emerald-300/40 disabled:cursor-default";
  const sizes = variant === "compact" ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-sm lg:text-base";
  const wide = fullWidth ? "w-full justify-center" : "";

  const variantClass =
    variant === "ghost"
      ? "border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 bg-white/80 backdrop-blur shadow-sm"
      : variant === "white"
      ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg shadow-black/10"
      : variant === "compact"
      ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-700 text-white shadow-lg shadow-emerald-950/30 hover:brightness-110"
      : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-600/25 hover:shadow-lg hover:-translate-y-0.5";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${base} ${sizes} ${variantClass} ${wide} ${className}`}
        aria-label={installed ? "Levefy já instalado" : "Instalar app Levefy"}
      >
        {installed ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        <span>{buttonLabel}</span>
        {!installed && (
          <span className="ml-1 hidden sm:inline-flex items-center gap-1 rounded-full bg-white/18 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white/95">
            PWA
          </span>
        )}
      </button>

      {mounted && showModal
        ? createPortal(
            <InstallModal
              device={device}
              canInstall={canInstall}
              installed={installed}
              onClose={() => setShowModal(false)}
              onInstall={async () => {
                if (!deferredPrompt.current) return;
                await deferredPrompt.current.prompt();
                const choice = await deferredPrompt.current.userChoice;
                deferredPrompt.current = null;
                setCanInstall(false);
                if (choice.outcome === "accepted") {
                  setInstalled(true);
                  setShowModal(false);
                }
              }}
            />,
            document.body
          )
        : null}
    </>
  );
}

function InstallModal({
  device,
  canInstall,
  installed,
  onClose,
  onInstall,
}: {
  device: Device;
  canInstall: boolean;
  installed: boolean;
  onClose: () => void;
  onInstall: () => Promise<void>;
}) {
  const title = useMemo(() => {
    if (installed) return "Levefy já está instalado";
    if (device === "ios") return "Instalar no iPhone";
    if (device === "android") return "Instalar no Android";
    return "Instalar no computador";
  }, [device, installed]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{
        zIndex: 2147483647,
        background: "rgba(2, 6, 23, 0.76)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_100px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-800" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
          aria-label="Fechar modal de instalação"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative px-6 pb-6 pt-7 sm:px-7">
          <div className="flex items-center gap-4 pb-7 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-xl">
              🌿
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/75">Levefy PWA</p>
              <h2 id="install-modal-title" className="mt-1 text-2xl font-black leading-tight">
                {title}
              </h2>
              <p className="mt-1 text-sm font-medium text-white/80">
                Acesso rápido, tela cheia e experiência de app.
              </p>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/10">
            {installed ? (
              <InstalledMessage />
            ) : canInstall ? (
              <NativeInstall onInstall={onInstall} />
            ) : device === "ios" ? (
              <IosInstructions />
            ) : device === "android" ? (
              <AndroidInstructions />
            ) : (
              <DesktopInstructions />
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              {installed ? "Entendi" : "Fechar instruções"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NativeInstall({ onInstall }: { onInstall: () => Promise<void> }) {
  return (
    <div>
      <div className="mb-5 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-100">
        <Smartphone className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h3 className="font-black">Instalação disponível agora</h3>
          <p className="mt-1 text-sm text-emerald-800/80">
            Seu navegador permite instalar o Levefy como app em um toque.
          </p>
        </div>
      </div>
      <button
        onClick={onInstall}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-110"
      >
        <Download className="h-5 w-5" />
        Instalar Levefy agora
      </button>
    </div>
  );
}

function InstalledMessage() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-black text-slate-900">Tudo certo!</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        O Levefy já está rodando em modo app. Use o atalho criado no celular ou computador para abrir mais rápido.
      </p>
    </div>
  );
}

function IosInstructions() {
  return (
    <div>
      <h3 className="mb-1 text-lg font-black text-slate-900">Instalar no iPhone / iPad</h3>
      <p className="mb-5 text-sm text-slate-500">No iOS, a instalação precisa ser feita pelo Safari:</p>
      <div className="space-y-4">
        <Step num={1} icon={<Share className="h-5 w-5 text-blue-500" />} bgColor="bg-blue-50">
          <p className="text-sm font-bold text-slate-900">Toque no botão Compartilhar</p>
          <p className="mt-0.5 text-xs text-slate-500">Ícone da caixa com seta para cima, na barra inferior do Safari.</p>
        </Step>
        <Step num={2} icon={<Plus className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Escolha “Adicionar à Tela Inicial”</p>
          <p className="mt-0.5 text-xs text-slate-500">Role a lista de opções até encontrar essa ação.</p>
        </Step>
        <Step num={3} icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Toque em “Adicionar”</p>
          <p className="mt-0.5 text-xs text-slate-500">O Levefy vai aparecer na tela inicial como app.</p>
        </Step>
      </div>
      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-3">
        <p className="text-xs font-semibold text-amber-800">⚠️ Se estiver no Chrome do iPhone, abra esta página no Safari para instalar.</p>
      </div>
    </div>
  );
}

function AndroidInstructions() {
  return (
    <div>
      <h3 className="mb-1 text-lg font-black text-slate-900">Instalar no Android</h3>
      <p className="mb-5 text-sm text-slate-500">Use o Chrome para adicionar o Levefy como app:</p>
      <div className="space-y-4">
        <Step num={1} icon={<MoreHorizontal className="h-5 w-5 text-slate-600" />} bgColor="bg-slate-50">
          <p className="text-sm font-bold text-slate-900">Toque nos 3 pontos</p>
          <p className="mt-0.5 text-xs text-slate-500">Menu no canto superior direito do Chrome.</p>
        </Step>
        <Step num={2} icon={<Plus className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Selecione “Instalar app”</p>
          <p className="mt-0.5 text-xs text-slate-500">Também pode aparecer como “Adicionar à tela inicial”.</p>
        </Step>
        <Step num={3} icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Confirme a instalação</p>
          <p className="mt-0.5 text-xs text-slate-500">Depois abra pelo ícone criado na tela inicial.</p>
        </Step>
      </div>
    </div>
  );
}

function DesktopInstructions() {
  return (
    <div>
      <h3 className="mb-1 text-lg font-black text-slate-900">Instalar no computador</h3>
      <p className="mb-5 text-sm text-slate-500">Funciona melhor no Chrome ou Edge:</p>
      <div className="space-y-4">
        <Step num={1} icon={<Monitor className="h-5 w-5 text-blue-500" />} bgColor="bg-blue-50">
          <p className="text-sm font-bold text-slate-900">Procure o ícone de instalação</p>
          <p className="mt-0.5 text-xs text-slate-500">Ele aparece no canto direito da barra de endereço.</p>
        </Step>
        <Step num={2} icon={<Plus className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Clique em “Instalar”</p>
          <p className="mt-0.5 text-xs text-slate-500">O Levefy abre em tela própria, sem cara de site comum.</p>
        </Step>
        <Step num={3} icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} bgColor="bg-emerald-50">
          <p className="text-sm font-bold text-slate-900">Use o atalho criado</p>
          <p className="mt-0.5 text-xs text-slate-500">Ele ficará na área de trabalho ou menu iniciar.</p>
        </Step>
      </div>
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs font-semibold text-blue-800">💡 Se não aparecer o ícone, abra o menu do Chrome → Salvar e compartilhar → Instalar página como app.</p>
      </div>
    </div>
  );
}

function Step({
  num,
  icon,
  bgColor,
  children,
}: {
  num: number;
  icon: React.ReactNode;
  bgColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${bgColor}`}>{icon}</div>
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-black text-white">
          {num}
        </span>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
