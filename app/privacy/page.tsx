import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Política de Privacidade | Levefy",
  description: "Como o Levefy coleta, usa e protege dados pessoais.",
};

const sections = [
  {
    title: "Dados que coletamos",
    body: "Podemos coletar nome, e-mail, dados de conta, preferências informadas no onboarding, uso do produto e informações técnicas como dispositivo, navegador, cookies e eventos de navegação. Dados de pagamento são processados por provedores seguros como Stripe e Cakto, sem armazenarmos dados completos do cartão.",
  },
  {
    title: "Como usamos os dados",
    body: "Usamos os dados para criar e manter sua conta, personalizar a experiência, melhorar recomendações, processar pagamentos, prestar suporte, prevenir abuso e medir campanhas de marketing. Eventos enviados para analytics e mídia paga são tratados de forma agregada ou técnica e não incluem peso, altura, idade ou respostas sensíveis do onboarding.",
  },
  {
    title: "Cookies e anúncios",
    body: "O Levefy pode usar cookies, Meta Pixel, Google Analytics e tecnologias semelhantes para medir visitas, cadastros, checkout e desempenho de campanhas. Você pode controlar cookies pelo navegador e pelas preferências das plataformas de anúncios.",
  },
  {
    title: "Compartilhamento",
    body: "Compartilhamos dados apenas com fornecedores necessários para operar o serviço, como autenticação, banco de dados, hospedagem, pagamentos, suporte, analytics e marketing. Não vendemos dados pessoais.",
  },
  {
    title: "Seus direitos",
    body: "Você pode solicitar acesso, correção, exclusão, portabilidade ou limitação de uso dos seus dados, conforme a legislação aplicável. Também pode excluir sua conta pelos recursos disponíveis no produto ou entrando em contato.",
  },
  {
    title: "Saúde e bem-estar",
    body: "O Levefy oferece organização, acompanhamento e sugestões gerais de bem-estar. O serviço não substitui consulta com médico, nutricionista, psicólogo ou outro profissional de saúde.",
  },
];

export default function PrivacyPage() {
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
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Política de Privacidade</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Esta política explica como tratamos dados pessoais para operar o Levefy com segurança,
          transparência e foco na sua experiência.
        </p>
        <p className="mt-4 text-xs font-medium text-slate-400">Atualizada em 20 de maio de 2026.</p>

        <div className="mt-10 divide-y divide-slate-100">
          {sections.map((section) => (
            <section key={section.title} className="py-6">
              <h2 className="text-lg font-extrabold tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 border-t border-slate-100 pt-6 text-sm leading-7 text-slate-600">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Contato</h2>
          <p className="mt-3">
            Controlador: Lucas Nassuato da Silva, CNPJ 35.593.116/0001-66.
            Para dúvidas sobre privacidade, fale pelo e-mail{" "}
            <a href="mailto:contato@levefy.com.br" className="font-bold text-brand-700 hover:text-brand-800">
              contato@levefy.com.br
            </a>.
          </p>
          <p className="mt-4">
            Leia também nossos{" "}
            <Link href="/terms" className="font-bold text-brand-700 hover:text-brand-800">
              Termos de Uso
            </Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
