import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Termos de Uso | Levefy",
  description: "Regras de uso, assinatura e limitações do Levefy.",
};

const sections = [
  {
    title: "Uso do serviço",
    body: "O Levefy é uma plataforma digital de organização, hábitos, metas e sugestões gerais de bem-estar. Ao criar conta ou usar o serviço, você concorda em fornecer informações verdadeiras, manter suas credenciais em segurança e usar a plataforma de forma lícita.",
  },
  {
    title: "Não é aconselhamento médico",
    body: "O conteúdo do Levefy não substitui avaliação, diagnóstico, prescrição ou acompanhamento de profissionais de saúde. Antes de iniciar dieta, treino, suplementação ou mudança relevante de rotina, procure orientação profissional, especialmente se você tiver condições médicas, gestação, uso de medicamentos ou histórico de transtornos alimentares.",
  },
  {
    title: "Planos, pagamentos e cancelamento",
    body: "Planos pagos podem ser cobrados por pagamento único ou assinatura, conforme informado na tela de compra. Pagamentos são processados por provedores externos como Stripe e Cakto. Assinaturas podem ser canceladas conforme os recursos disponíveis no produto ou canais de suporte, sem multa de fidelidade.",
  },
  {
    title: "Disponibilidade",
    body: "Trabalhamos para manter o Levefy disponível, mas o serviço pode passar por manutenção, instabilidade de terceiros ou atualizações. Podemos alterar recursos para melhorar segurança, desempenho, conformidade ou experiência do usuário.",
  },
  {
    title: "Uso indevido",
    body: "É proibido tentar invadir, copiar, automatizar abusivamente, revender acesso, explorar falhas, interferir na operação ou usar o Levefy para fins ilegais. Contas envolvidas em abuso podem ser limitadas, suspensas ou encerradas.",
  },
  {
    title: "Responsabilidade",
    body: "O Levefy não garante resultados específicos de peso, estética, saúde ou performance. Resultados dependem de fatores individuais, adesão, contexto e orientação profissional. A plataforma é fornecida como ferramenta de apoio e organização.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5">
          <Logo />
          <Link href="/login" className="text-sm font-bold text-brand-700 hover:text-brand-800">
            Entrar
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700">Levefy</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Termos de Uso</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Estes termos definem as regras para uso do Levefy, incluindo conta, planos pagos,
          pagamentos, limitações e responsabilidades.
        </p>
        <p className="mt-4 text-xs font-medium text-slate-400">Atualizados em 20 de maio de 2026.</p>

        <div className="mt-10 divide-y divide-slate-100">
          {sections.map((section) => (
            <section key={section.title} className="py-6">
              <h2 className="text-lg font-extrabold tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 border-t border-slate-100 pt-6 text-sm leading-7 text-slate-600">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Contato e privacidade</h2>
          <p className="mt-3">
            Responsável pelo serviço: Lucas Nassuato da Silva, CNPJ 35.593.116/0001-66.
            Para suporte, fale pelo e-mail{" "}
            <a href="mailto:contato@levefy.com.br" className="font-bold text-brand-700 hover:text-brand-800">
              contato@levefy.com.br
            </a>.
          </p>
          <p className="mt-4">
            O tratamento de dados pessoais é explicado na{" "}
            <Link href="/privacy" className="font-bold text-brand-700 hover:text-brand-800">
              Política de Privacidade
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
