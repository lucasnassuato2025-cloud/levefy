interface MobileStickyCTAProps {
  href: string;
  label: string;
}

export default function MobileStickyCTA({ href, label }: MobileStickyCTAProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
      style={{
        background:
          "linear-gradient(to top, rgba(3,7,18,0.95) 60%, transparent 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <a
        href={href}
        className="btn-brand block w-full rounded-2xl py-4 text-center text-base font-bold"
        style={{ letterSpacing: "0" }}
      >
        {label}
      </a>
      <p className="mt-2 text-center text-[10px] text-slate-500">
        Sem cartão para testar
      </p>
    </div>
  );
}
