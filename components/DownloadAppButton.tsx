"use client";
import { useEffect, useState, useRef } from "react";
import { Download, X, Smartphone, Monitor, Share, MoreHorizontal, Plus } from "lucide-react";

type Device = "android" | "ios" | "desktop";

function detectDevice(): Device {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return "ios";
  return "desktop";
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
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    setDevice(detectDevice());
    const onBIP = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Se o navegador suporta instalação nativa (Android Chrome), usa ela
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      try { await deferredPrompt.current.userChoice; } catch {}
      deferredPrompt.current = null;
      setCanInstall(false);
      return;
    }
    // Caso contrário, mostra o modal com instruções
    setShowModal(true);
  };

  const base = "group relative z-10 inline-flex items-center gap-2 font-semibold rounded-full transition-all duration-200 select-none focus:outline-none focus:ring-4 focus:ring-brand-200";
  const sizes = variant === "compact" ? "px-4 py-2 text-sm" : "px-6 py-3 text-sm lg:text-base";
  const wide = fullWidth ? "w-full justify-center" : "";

  const variantClass =
    variant === "ghost"
      ? "border border-slate-200 text-slate-700 hover:border-brand-600 hover:text-brand-700 bg-white/70 backdrop-blur"
      : variant === "white"
      ? "bg-white text-brand-700 hover:bg-brand-50 shadow-lg shadow-black/10"
      : variant === "compact"
      ? "bg-white text-brand-700 hover:bg-brand-50 shadow-lg shadow-black/10 border border-white/20"
      : "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 hover:shadow-lg hover:-translate-y-0.5";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${base} ${sizes} ${variantClass} ${wide} ${className}`}
        aria-label="Instalar app Levefy"
      >
        <Download className="w-4 h-4" />
        <span>{label ?? "Baixar App"}</span>
        <span className="ml-1 hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
          PWA
        </span>
      </button>

      {showModal && (
        <InstallModal device={device} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function InstallModal({ device, onClose }: { device: Device; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.78)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden animate-fade-in border border-white/80">
        {/* Header */}
        <div className="gradient-brand p-6 relative">
          <button type="button" onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow">
              🌿
            </div>
            <div className="text-white">
              <p className="font-extrabold text-xl">Levefy</p>
              <p className="text-white/80 text-sm">Instale o app gratuitamente</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6">
          {device === "ios" ? <IosInstructions /> : device === "android" ? <AndroidInstructions /> : <DesktopInstructions />}

          <button type="button" onClick={onClose}
            className="mt-6 w-full btn-primary">
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}

function IosInstructions() {
  return (
    <div>
      <h3 className="font-extrabold text-lg mb-1">Instalar no iPhone / iPad</h3>
      <p className="text-sm text-slate-500 mb-5">Siga os 3 passos abaixo no Safari:</p>
      <div className="space-y-4">
        <Step num={1} icon={<Share className="w-5 h-5 text-blue-500" />} bgColor="bg-blue-50">
          <p className="font-semibold text-sm">Toque no botão Compartilhar</p>
          <p className="text-xs text-slate-500 mt-0.5">Ícone de caixa com seta para cima, na barra inferior do Safari</p>
        </Step>
        <Step num={2} icon={<Plus className="w-5 h-5 text-green-600" />} bgColor="bg-green-50">
          <p className="font-semibold text-sm">Selecione "Adicionar à Tela Inicial"</p>
          <p className="text-xs text-slate-500 mt-0.5">Role a lista de opções e toque nesta opção</p>
        </Step>
        <Step num={3} icon={<span className="text-lg">✅</span>} bgColor="bg-brand-50">
          <p className="font-semibold text-sm">Toque em "Adicionar" e pronto!</p>
          <p className="text-xs text-slate-500 mt-0.5">O Levefy aparecerá na sua tela inicial como um app nativo</p>
        </Step>
      </div>
      <div className="mt-5 p-3 rounded-2xl bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-700 font-medium">⚠️ Abra este site no <strong>Safari</strong> para que a instalação funcione corretamente no iPhone.</p>
      </div>
    </div>
  );
}

function AndroidInstructions() {
  return (
    <div>
      <h3 className="font-extrabold text-lg mb-1">Instalar no Android</h3>
      <p className="text-sm text-slate-500 mb-5">Siga os passos abaixo no Chrome:</p>
      <div className="space-y-4">
        <Step num={1} icon={<MoreHorizontal className="w-5 h-5 text-slate-600" />} bgColor="bg-slate-50">
          <p className="font-semibold text-sm">Toque nos 3 pontos no canto superior direito</p>
          <p className="text-xs text-slate-500 mt-0.5">Menu do Chrome, canto superior direito da tela</p>
        </Step>
        <Step num={2} icon={<Plus className="w-5 h-5 text-green-600" />} bgColor="bg-green-50">
          <p className="font-semibold text-sm">Selecione "Adicionar à tela inicial"</p>
          <p className="text-xs text-slate-500 mt-0.5">Ou "Instalar app" se aparecer essa opção</p>
        </Step>
        <Step num={3} icon={<span className="text-lg">✅</span>} bgColor="bg-brand-50">
          <p className="font-semibold text-sm">Confirme e pronto!</p>
          <p className="text-xs text-slate-500 mt-0.5">O Levefy será instalado como app nativo no seu Android</p>
        </Step>
      </div>
    </div>
  );
}

function DesktopInstructions() {
  return (
    <div>
      <h3 className="font-extrabold text-lg mb-1">Instalar no computador</h3>
      <p className="text-sm text-slate-500 mb-5">Disponível no Chrome e Edge:</p>
      <div className="space-y-4">
        <Step num={1} icon={<Monitor className="w-5 h-5 text-blue-500" />} bgColor="bg-blue-50">
          <p className="font-semibold text-sm">Clique no ícone de instalação</p>
          <p className="text-xs text-slate-500 mt-0.5">Ícone de computador/seta na barra de endereço do Chrome</p>
        </Step>
        <Step num={2} icon={<Plus className="w-5 h-5 text-green-600" />} bgColor="bg-green-50">
          <p className="font-semibold text-sm">Clique em "Instalar"</p>
          <p className="text-xs text-slate-500 mt-0.5">Uma janela aparecerá perguntando se deseja instalar o Levefy</p>
        </Step>
        <Step num={3} icon={<span className="text-lg">✅</span>} bgColor="bg-brand-50">
          <p className="font-semibold text-sm">App instalado com sucesso!</p>
          <p className="text-xs text-slate-500 mt-0.5">Acesse pelo atalho criado na área de trabalho ou menu iniciar</p>
        </Step>
      </div>
      <div className="mt-5 p-3 rounded-2xl bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-700 font-medium">💡 Se não aparecer o ícone de instalação, use o menu do Chrome → "Salvar e compartilhar" → "Instalar página como app".</p>
      </div>
    </div>
  );
}

function Step({ num, icon, bgColor, children }: { num: number; icon: React.ReactNode; bgColor: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-2xl ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
          {num}
        </span>
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
