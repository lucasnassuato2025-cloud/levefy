import AppShell from "@/components/AppShell";
import { Check, Lock, Flame } from "lucide-react";

const MESSAGES = [
  "Dia 1: Hoje você começa. Essa é a parte mais difícil.",
  "Dia 7: Uma semana inteira — seu hábito está se formando.",
  "Dia 14: Você é mais forte do que suas desculpas.",
  "Dia 21: Você conseguiu. Este é o novo você.",
];

export default function Challenge() {
  const completed = 14;
  const total = 21;
  const pct = Math.round((completed / total) * 100);
  return (
    <AppShell title="Desafio 21 Dias">
      <div className="card p-7 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-brand-700 font-semibold">PROGRESSO ATUAL</p>
            <p className="text-3xl font-bold mt-1">Dia {completed} de {total}</p>
            <p className="text-sm text-slate-500 mt-1">{total-completed} dias para concluir</p>
          </div>
          <div className="w-32 h-32 rounded-full grid place-items-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="10" fill="none"/>
              <circle cx="50" cy="50" r="42" stroke="#16a34a" strokeWidth="10" fill="none" strokeDasharray={`${pct*2.64} 999`} strokeLinecap="round"/>
            </svg>
            <span className="absolute font-bold text-xl">{pct}%</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({length: total}).map((_,i)=>{
            const day = i+1;
            const done = day <= completed;
            const today = day === completed + 1;
            return (
              <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold ${done?"gradient-brand text-white":today?"bg-brand-50 text-brand-700 border-2 border-brand-600":"bg-slate-50 text-slate-400"}`}>
                {done ? <Check className="w-4 h-4"/> : today ? <Flame className="w-4 h-4"/> : <Lock className="w-3 h-3"/>}
                <span className="mt-0.5">D{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {MESSAGES.map((m,i)=>(
          <div key={i} className="card p-6">
            <Flame className="w-5 h-5 text-brand-600"/>
            <p className="mt-3 font-semibold">{m}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-xl mt-10 mb-4">Tarefas de hoje</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { t: "Hidratação matinal", d: "Beba 500ml de água nos primeiros 30 min após acordar." },
          { t: "Movimente o corpo", d: "20 minutos de caminhada ou exercício." },
          { t: "Refeição saudável", d: "Prepare uma receita Levefy hoje." },
          { t: "Noite consciente", d: "10 min de alongamento + dormir antes das 23h." },
        ].map(x=>(
          <div key={x.t} className="card p-5 flex gap-4">
            <span className="w-10 h-10 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0"><Check className="w-5 h-5"/></span>
            <div><p className="font-semibold">{x.t}</p><p className="text-sm text-slate-600 mt-1">{x.d}</p></div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
