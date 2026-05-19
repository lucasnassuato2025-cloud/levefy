export default function Footer() {
  return (
    <footer className="mt-auto pt-10 pb-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
            © {new Date().getFullYear()} Levefy · Nutrição com inteligência
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
            Desenvolvido por{" "}
            <span className="text-slate-700 font-semibold">Lucas Nassuato da Silva</span>
            <span className="mx-2 text-slate-300">·</span>
            <span className="text-slate-400">CNPJ&nbsp;35.593.116/0001-66</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
