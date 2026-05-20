interface MobileStickyCTAProps {
  href: string;
  label: string;
}

export default function MobileStickyCTA({ href, label }: MobileStickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
      style={{
        background: "linear-gradient(to top, rgba(3,7,18,0.95) 60%, transparent 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <a
        href={href}
        className="btn-brand w-full text-center block py-4 text-base font-bold rounded-2xl"
        style={{ letterSpacing: "-0.01em" }}
      >
        {label}
      </a>
      <p className="text-center text-[10px] text-slate-600 mt-2">
        Sem cartão · Resultado em 60s
      </p>
    </div>
  );
}
