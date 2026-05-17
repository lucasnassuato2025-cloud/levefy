import Image from "next/image";
import AppShell from "@/components/AppShell";
import DownloadAppButton from "@/components/DownloadAppButton";
import { Droplets, Flame, TrendingDown, Check, Trophy, Quote, Smartphone, Sparkles } from "lucide-react";

async function getUser() {
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const user = await getUser();

  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split("@")[0]
    ?? "você";

  const checklist = [
    { t: "Beber 2L de água", done: true },
    { t: "Caminhada de 30 min", done: true },
    { t: "Registrar café da manhã", done: true },
    { t: "Registrar jantar", done: false },
    { t: "Dormir antes das 23h", done: false },
  ];

  return (
    <AppShell>
      {/* Hero saudação com imagem motivacional */}
      <div className="relative rounded-3xl overflow-hidden text-white mb-6 shadow-premium">
        <div className="absolute inset-0 gradient-brand"/>
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/transform-65.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover object-top"
          />
        </div>
        <div className="relative p-7 lg:p-9 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-white/80 text-sm">Bom dia, {displayName} 👋</p>
            <h1 className="mt-1 text-2xl lg:text-3xl font-bold leading-tight">
              Você está em uma sequência de 14 dias. Continue assim!
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur font-semibold">🔥 14 dias</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur font-semibold">-3,6kg total</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur font-semibold">Dia 14/21</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner: instalar App PWA */}
      <div className="mb-6 rounded-2xl border border-brand-100 gradient-brand-soft p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-600/30">
          <Smartphone className="w-5 h-5"/>
        </span>
        <div className="flex-1">
          <p className="font-semibold text-slate-900 flex items-center gap-2">
            Instale o Levefy no seu celular <Sparkles className="w-4 h-4 text-brand-600"/>
          </p>
          <p className="text-sm text-slate-600 mt-0.5">
            Acesso rápido, funciona offline e abre direto da tela inicial — sem ocupar espaço.
          </p>
        </div>
        <DownloadAppButton variant="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Progresso de peso</h2>
            <span className="text-sm text-brand-700 font-semibold">-3,6 kg no total</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-4xl font-bold">72,4<span className="text-base font-medium text-slate-500"> kg</span></p>
            <span className="text-sm text-brand-700 inline-flex items-center"><TrendingDown className="w-4 h-4 mr-1"/>1,4 kg esta semana</span>
          </div>
          <div className="mt-6 h-48 flex items-end gap-1.5">
            {[60,55,68,52,58,45,50,42,46,38,40,32].map((h,i)=>(
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-300" style={{height:`${h}%`}}/>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Sequência</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-brand text-white flex items-center justify-center text-2xl font-bold">14</div>
            <div>
              <p className="text-sm text-slate-600">dias seguidos</p>
              <p className="text-xs text-slate-400 mt-1">Recorde: 21 dias</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {Array.from({length:14}).map((_,i)=>(
              <div key={i} className="aspect-square rounded-md gradient-brand opacity-80" />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Droplets className="w-4 h-4 text-brand-600"/> Água</h2>
          <p className="mt-3 text-3xl font-bold">2,1<span className="text-base text-slate-500"> / 3L</span></p>
          <div className="mt-4 grid grid-cols-8 gap-1">
            {Array.from({length:8}).map((_,i)=>(<div key={i} className={`h-8 rounded-md ${i<6?"bg-brand-500":"bg-slate-100"}`}/>))}
          </div>
          <button className="mt-5 btn-ghost w-full text-sm">+ Adicionar copo</button>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Flame className="w-4 h-4 text-brand-600"/> Calorias</h2>
          <p className="mt-3 text-3xl font-bold">1.640<span className="text-base text-slate-500"> / 1.800</span></p>
          <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full gradient-brand" style={{width:"91%"}}/>
          </div>
          <ul className="mt-4 text-sm text-slate-600 space-y-1">
            <li className="flex justify-between"><span>Café da manhã</span><span>420</span></li>
            <li className="flex justify-between"><span>Almoço</span><span>680</span></li>
            <li className="flex justify-between"><span>Lanches</span><span>240</span></li>
            <li className="flex justify-between"><span>Jantar</span><span>300</span></li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-brand-600"/> Desafio</h2>
          <p className="mt-2 text-sm text-slate-600">Dia 14 de 21</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full gradient-brand" style={{width:"66%"}}/></div>
          <p className="mt-4 text-xs text-slate-500">7 dias para completar o desafio.</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold">Checklist diário</h2>
          <ul className="mt-4 space-y-2.5">
            {checklist.map(c=>(
              <li key={c.t} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center ${c.done?"gradient-brand text-white":"border border-slate-300"}`}>
                  {c.done && <Check className="w-3.5 h-3.5"/>}
                </span>
                <span className={c.done?"line-through text-slate-400":"text-slate-700"}>{c.t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Receita do dia com imagem */}
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/recipes-fruit.webp"
              alt="Receita destaque do dia"
              fill
              sizes="(max-width: 1024px) 100vw, 360px"
              loading="lazy"
              className="object-cover"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-700">
              Receita do dia
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-semibold">Bowl de frutas vermelhas</h3>
            <p className="text-xs text-slate-500 mt-1">320 kcal · 12g proteína</p>
          </div>
        </div>

        <div className="card p-6 lg:col-span-3 gradient-brand text-white">
          <Quote className="w-6 h-6 opacity-80"/>
          <p className="mt-3 text-xl font-semibold leading-snug">&ldquo;Pequenos passos todos os dias valem mais do que grandes saltos de vez em quando.&rdquo;</p>
          <p className="mt-2 text-white/80 text-sm">— Seu coach Levefy</p>
        </div>
      </div>
    </AppShell>
  );
}
