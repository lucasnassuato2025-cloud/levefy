import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import DownloadAppButton from "@/components/DownloadAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import BeforeAfter from "@/components/BeforeAfter";
import {
  Check, Flame, HeartPulse, Salad, Trophy, LineChart, ArrowRight,
  Star, Sparkles, Smartphone, Heart, Zap, Leaf, Users,
} from "lucide-react";

const benefits = [
  { icon: Salad, title: "Comida de verdade, resultados reais", desc: "Receitas simples que qualquer um consegue fazer — sem dietas restritivas." },
  { icon: HeartPulse, title: "Feito para o seu corpo", desc: "Planos que se adaptam às suas metas, rotina e preferências." },
  { icon: Trophy, title: "Desafios de 21 dias", desc: "Mantenha a consistência com rotinas gamificadas e estruturadas." },
  { icon: LineChart, title: "Acompanhe seu progresso real", desc: "Peso, água, sequências e calorias — tudo em um só lugar." },
];

const steps = [
  { n: "01", title: "Defina sua meta", desc: "Informe seu peso atual, peso desejado e prazo." },
  { n: "02", title: "Receba seu plano", desc: "Receitas, rotinas e um desafio de 21 dias personalizado." },
  { n: "03", title: "Acompanhe e vença", desc: "Registre o progresso diariamente e veja a sequência crescer." },
];

const recipes = [
  { name: "Bowl de frutas vermelhas", kcal: 320, tag: "Café da Manhã", img: "/images/recipes-fruit.webp" },
  { name: "Meal prep equilibrado", kcal: 480, tag: "Almoço", img: "/images/meal-prep.webp" },
  { name: "Salada power com frango", kcal: 410, tag: "Jantar", img: "/images/meal-prep.webp" },
  { name: "Vitamina antioxidante", kcal: 220, tag: "Lanche", img: "/images/recipes-fruit.webp" },
];

const plans = [
  { name: "Grátis", price: "R$ 0", per: "para sempre", features: ["Receitas básicas", "Controle de peso", "Acesso à comunidade"], cta: "Começar Agora" },
  { name: "Premium", price: "R$ 49", per: "/mês", features: ["Todas as receitas", "Desafios de 21 dias", "Análise de progresso", "Planejador de refeições"], cta: "Assinar Premium", featured: true },
  { name: "VIP", price: "R$ 149", per: "/mês", features: ["Tudo do Premium", "Chat com coach 1:1", "Planos personalizados", "Suporte prioritário"], cta: "Ir para o VIP" },
];

const faqs = [
  { q: "Preciso de academia?", a: "Não. O Levefy foca em nutrição e rotinas simples que você pode fazer em casa." },
  { q: "É realmente sustentável?", a: "Sim — sem dietas impossíveis. Comida de verdade, hábitos simples, progresso gradual." },
  { q: "Posso cancelar quando quiser?", a: "Com certeza. Gerencie ou cancele seu plano em um clique pelo seu perfil." },
  { q: "Tem período de teste grátis?", a: "O plano Grátis permite explorar a experiência principal sem limite de tempo." },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#transform" className="hover:text-slate-900 transition">Transformações</a>
            <a href="#benefits" className="hover:text-slate-900 transition">Benefícios</a>
            <a href="#how" className="hover:text-slate-900 transition">Como funciona</a>
            <a href="#pricing" className="hover:text-slate-900 transition">Planos</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline text-sm font-semibold text-slate-700 px-3 py-2 hover:text-slate-900">
              Entrar
            </Link>
            <DownloadAppButton variant="compact" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-noise">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-300/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 animate-slide-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-brand-100 text-brand-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> +12.000 pessoas emagrecendo do jeito certo
            </span>
            <h1 className="mt-6 text-[2.5rem] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02] text-slate-900">
              Pequenas escolhas, <span className="text-gradient">grandes transformações.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              O Levefy combina rotinas leves, receitas saudáveis e o Desafio de 21 dias para você criar hábitos
              que duram — sem dietas impossíveis.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <DownloadAppButton variant="primary" />
              <Link href="/dashboard" className="btn-ghost">
                Ver app online <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-5 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {["bg-brand-300","bg-brand-400","bg-brand-500","bg-brand-600"].map((c,i)=>(
                  <span key={i} className={`w-9 h-9 rounded-full border-2 border-white ${c}`} />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current" />))}
                  <span className="ml-2 text-slate-700 font-semibold">4,9/5</span>
                </div>
                <p className="text-xs text-slate-500">Mais de 2.800 membros ativos</p>
              </div>
            </div>
          </div>

          {/* Hero visual: app preview + transformation peek */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-5 gap-4">
              <div className="col-span-3 relative animate-float">
                <Image
                  src="/images/transform-65.webp"
                  alt="Mulher de 65 anos em transformação real com Levefy"
                  width={900}
                  height={900}
                  priority
                  sizes="(max-width: 1024px) 60vw, 400px"
                  className="rounded-3xl shadow-premium ring-1 ring-white/60 object-cover w-full aspect-square"
                />
                <div className="absolute -bottom-4 -left-4 card-glass px-4 py-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-current" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Esta semana</p>
                    <p className="font-bold text-slate-900">-1,4 kg</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-4">
                <Image
                  src="/images/recipes-fruit.webp"
                  alt="Bowl de frutas saudável"
                  width={500}
                  height={500}
                  sizes="(max-width: 1024px) 40vw, 260px"
                  className="rounded-2xl shadow-lg object-cover aspect-square w-full"
                  loading="lazy"
                  decoding="async"
                />
                <div className="card-glass p-4">
                  <p className="text-xs text-slate-500">Sequência</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold text-gradient">14</p>
                    <p className="text-sm text-slate-500">dias</p>
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {Array.from({length: 7}).map((_,i)=>(
                      <div key={i} className="aspect-square rounded-sm gradient-brand opacity-80"/>
                    ))}
                  </div>
                </div>
                <div className="card-glass p-4">
                  <div className="flex items-center gap-2 text-brand-700">
                    <Zap className="w-4 h-4"/>
                    <p className="text-xs font-semibold">Mais energia</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-700 font-medium leading-snug">
                    Pra viver bem todos os dias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-slate-100/80">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { k: "+12k", v: "Membros ativos" },
              { k: "4,9★", v: "Avaliação média" },
              { k: "21 dias", v: "Desafio guiado" },
              { k: "100%", v: "Comida de verdade" },
            ].map((s)=>(
              <div key={s.k}>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">{s.k}</p>
                <p className="text-xs text-slate-500">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations */}
      <section id="transform" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
              <Leaf className="w-4 h-4" /> Transformações reais
            </span>
            <h2 className="mt-3 text-3xl lg:text-5xl font-bold tracking-tight">
              Histórias que <span className="text-gradient">inspiram</span>.
            </h2>
            <p className="mt-4 text-slate-600">
              Membros reais que mudaram a vida com pequenas escolhas diárias. Arraste para comparar.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { age: "65 anos", img: "/images/transform-65.webp", text: "Mais autoestima, mais disposição e hábitos saudáveis." },
              { age: "50 anos", img: "/images/transform-50.webp", text: "Mais energia para viver bem com acompanhamento real." },
              { age: "150 → leveza", img: "/images/transform-150kg.webp", text: "Transformação real com saúde, equilíbrio e leveza." },
            ].map((t)=>(
              <div key={t.age} className="card-glass overflow-hidden flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={t.img}
                    alt={`Transformação Levefy — ${t.age}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    loading="lazy"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold uppercase tracking-wider text-brand-700">
                    Nova fase
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{t.age}</p>
                  <p className="mt-2 text-slate-700 leading-relaxed">{t.text}</p>
                  <div className="mt-4 flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current" />))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive before/after */}
          <div className="mt-16 grid lg:grid-cols-2 gap-10 items-center">
            <BeforeAfter
              before="/images/transform-150kg.webp"
              after="/images/transform-50.webp"
              alt="Comparativo antes e depois Levefy"
            />
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">
                Veja a diferença. <span className="text-gradient">Sinta a leveza.</span>
              </h3>
              <p className="mt-4 text-slate-600 text-lg">
                Não é mágica — é método. Receitas que cabem na rotina, exercícios possíveis e
                acompanhamento profissional para você manter o resultado de verdade.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Alimentação equilibrada, sem culpa",
                  "Exercícios que cabem na sua rotina",
                  "Acompanhamento profissional",
                  "Mais energia e bem-estar",
                ].map((t)=>(
                  <li key={t} className="flex items-center gap-3 text-slate-700">
                    <span className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3}/>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <DownloadAppButton variant="primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Por que o Levefy funciona
            </h2>
            <p className="mt-3 text-slate-600">Criado por pessoas que emagreceram e mantiveram o resultado.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({icon:Icon,title,desc})=>(
              <div key={title} className="card-glass p-6 hover:-translate-y-1 transition-transform">
                <span className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center shadow-md shadow-brand-600/30">
                  <Icon className="w-5 h-5"/>
                </span>
                <h3 className="mt-4 font-semibold text-lg">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Como funciona</h2>
            <p className="mt-3 text-slate-600">Três passos simples. Resultados que duram.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5 relative">
            {steps.map(s=>(
              <div key={s.n} className="card-glass p-7 relative">
                <p className="text-gradient font-extrabold text-4xl">{s.n}</p>
                <h3 className="mt-3 font-semibold text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App preview / Download big CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand-soft" />
        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5"/> App PWA
            </span>
            <h2 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight">
              Leve o Levefy <span className="text-gradient">no bolso</span>.
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Instale o app no Android, iPhone ou como atalho no celular. Funciona offline, é leve e abre
              em segundos — direto na sua tela inicial.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <DownloadAppButton variant="primary" />
              <Link href="/dashboard" className="btn-ghost">Abrir no navegador</Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Detectamos seu dispositivo (Android, iPhone, desktop) e oferecemos a melhor opção automaticamente.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-white/40 blur-3xl rounded-full"/>
            <div className="relative card-glass p-6 lg:p-8 shadow-premium">
              <div className="flex items-center justify-between">
                <Logo />
                <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-wider">PWA</span>
              </div>
              <div className="mt-6 rounded-2xl gradient-brand text-white p-5">
                <p className="text-white/80 text-xs">Bom dia, Sara 👋</p>
                <p className="mt-1 font-bold text-lg leading-snug">Sequência de 14 dias. Continue assim!</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-[10px] text-slate-500 uppercase tracking-wider">Peso</p><p className="font-bold text-lg">72,4kg</p></div>
                <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-[10px] text-slate-500 uppercase tracking-wider">Água</p><p className="font-bold text-lg">2,1L</p></div>
                <div className="rounded-xl bg-white p-3 shadow-sm"><p className="text-[10px] text-slate-500 uppercase tracking-wider">Kcal</p><p className="font-bold text-lg">1.640</p></div>
              </div>
              <div className="mt-4 h-24 flex items-end gap-1.5">
                {[40,55,48,70,62,78,90,72,85].map((h,i)=>(
                  <div key={i} className="flex-1 rounded-t-md gradient-brand opacity-90" style={{height: `${h}%`}} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Receitas que você vai querer fazer</h2>
              <p className="mt-3 text-slate-600">Frescas, rápidas e criadas para o emagrecimento.</p>
            </div>
            <Link href="/recipes" className="text-brand-700 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recipes.map((r,i)=>(
              <div key={r.name+i} className="card-glass overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={r.img}
                    alt={r.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-brand-700 font-bold uppercase tracking-wider">{r.tag}</p>
                  <h3 className="mt-1 font-semibold">{r.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{r.kcal} kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="rounded-3xl overflow-hidden relative gradient-brand text-white p-10 lg:p-16 shadow-premium">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <Image src="/images/recipes-fruit.webp" alt="" fill className="object-cover" loading="lazy" />
            </div>
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5"/> Desafio de 21 dias
              </span>
              <h2 className="mt-5 text-3xl lg:text-5xl font-bold tracking-tight">Crie o hábito em 21 dias.</h2>
              <p className="mt-4 text-white/85 text-lg">
                Um plano diário guiado que torna a vida saudável automática. Pequenas conquistas, sequências diárias, mudanças reais.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/challenge" className="inline-flex items-center justify-center rounded-full bg-white text-brand-700 font-semibold px-6 py-3 hover:bg-brand-50 transition shadow-lg">
                  Participar do Desafio <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <DownloadAppButton variant="white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Amado por quem usa</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { name: "Sara K.", lost: "-8 kg em 3 meses", quote: "Finalmente algo que cabe na minha rotina real. As receitas são incríveis." },
              { name: "Daniel R.", lost: "-12 kg em 5 meses", quote: "O desafio de 21 dias mudou completamente minha mentalidade." },
              { name: "Mia L.", lost: "-6 kg em 2 meses", quote: "Simples, bonito e motivador. Fico com vontade de abrir o app todo dia." },
            ].map(t=>(
              <div key={t.name} className="card-glass p-6">
                <div className="flex items-center gap-1 text-amber-500">{[...Array(5)].map((_,i)=>(<Star key={i} className="w-4 h-4 fill-current"/>))}</div>
                <p className="mt-4 text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </span>
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-brand-700 font-semibold">{t.lost}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Preços simples e transparentes</h2>
            <p className="mt-3 text-slate-600">Comece grátis. Faça upgrade quando quiser.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {plans.map(p=>(
              <div key={p.name} className={`card-glass p-7 relative ${p.featured ? "ring-2 ring-brand-600 lg:scale-[1.04] shadow-premium" : ""}`}>
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-brand text-white text-xs font-semibold shadow-md">
                    Mais popular
                  </span>
                )}
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="mt-2"><span className="text-4xl font-bold">{p.price}</span><span className="text-slate-500">{p.per}</span></p>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map(f=>(
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-brand-600"/> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/membership" className={`mt-7 inline-flex w-full justify-center ${p.featured ? "btn-primary" : "btn-ghost"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center tracking-tight">Perguntas frequentes</h2>
          <div className="mt-10 space-y-3">
            {faqs.map(f=>(
              <details key={f.q} className="card-glass p-5 group">
                <summary className="cursor-pointer font-semibold flex justify-between items-center list-none">
                  {f.q}
                  <span className="text-brand-600 group-open:rotate-45 transition text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand"/>
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/meal-prep.webp" alt="" fill className="object-cover" loading="lazy" sizes="100vw"/>
        </div>
        <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center text-white">
          <Users className="w-10 h-10 mx-auto opacity-80"/>
          <h2 className="mt-5 text-4xl lg:text-5xl font-bold tracking-tight">
            Sua vida mais leve começa hoje.
          </h2>
          <p className="mt-4 text-white/90 text-lg">
            Junte-se a milhares de pessoas criando hábitos duradouros com o Levefy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <DownloadAppButton variant="white" />
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-6 py-3 hover:bg-white/10 transition">
              Começar grátis <ArrowRight className="w-4 h-4 ml-2"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 grid md:grid-cols-3 gap-8 items-center">
          <Logo />
          <p className="text-sm text-slate-500 text-center">
            © {new Date().getFullYear()} Levefy. Todos os direitos reservados.
          </p>
          <div className="flex md:justify-end gap-5 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition">Privacidade</a>
            <a href="#" className="hover:text-slate-900 transition">Termos</a>
            <a href="#" className="hover:text-slate-900 transition">Contato</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-light tracking-wide">
            Desenvolvido por <span className="text-slate-500 font-medium">Lucas Nassuato da Silva</span>
          </p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <MobileStickyCTA />
    </div>
  );
}
