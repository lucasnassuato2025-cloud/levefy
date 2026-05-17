import AppShell from "@/components/AppShell";
import { Droplets, Flame, TrendingDown, Check, Trophy, Quote } from "lucide-react";

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
    ?? "there";

  const checklist = [
    { t: "Drink 2L water", done: true },
    { t: "30-min walk", done: true },
    { t: "Log breakfast", done: true },
    { t: "Log dinner", done: false },
    { t: "Sleep before 11pm", done: false },
  ];
  return (
    <AppShell>
      <div className="rounded-3xl gradient-brand text-white p-7 lg:p-9 mb-6">
        <p className="text-white/80 text-sm">Good morning, {displayName} 👋</p>
        <h1 className="mt-1 text-2xl lg:text-3xl font-bold">You're on a 14-day streak. Keep going!</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Weight progress</h2>
            <span className="text-sm text-brand-700 font-semibold">-3.6 kg total</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-4xl font-bold">72.4<span className="text-base font-medium text-slate-500"> kg</span></p>
            <span className="text-sm text-brand-700 inline-flex items-center"><TrendingDown className="w-4 h-4 mr-1"/>1.4kg this week</span>
          </div>
          <div className="mt-6 h-48 flex items-end gap-1.5">
            {[60,55,68,52,58,45,50,42,46,38,40,32].map((h,i)=>(
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-300" style={{height:`${h}%`}}/>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Streak</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-brand text-white flex items-center justify-center text-2xl font-bold">14</div>
            <div>
              <p className="text-sm text-slate-600">days in a row</p>
              <p className="text-xs text-slate-400 mt-1">Best: 21 days</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {Array.from({length:14}).map((_,i)=>(
              <div key={i} className="aspect-square rounded-md gradient-brand opacity-80" />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Droplets className="w-4 h-4 text-brand-600"/> Water</h2>
          <p className="mt-3 text-3xl font-bold">2.1<span className="text-base text-slate-500"> / 3L</span></p>
          <div className="mt-4 grid grid-cols-8 gap-1">
            {Array.from({length:8}).map((_,i)=>(<div key={i} className={`h-8 rounded-md ${i<6?"bg-brand-500":"bg-slate-100"}`}/>))}
          </div>
          <button className="mt-5 btn-ghost w-full text-sm">+ Add glass</button>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Flame className="w-4 h-4 text-brand-600"/> Calories</h2>
          <p className="mt-3 text-3xl font-bold">1,640<span className="text-base text-slate-500"> / 1,800</span></p>
          <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full gradient-brand" style={{width:"91%"}}/>
          </div>
          <ul className="mt-4 text-sm text-slate-600 space-y-1">
            <li className="flex justify-between"><span>Breakfast</span><span>420</span></li>
            <li className="flex justify-between"><span>Lunch</span><span>680</span></li>
            <li className="flex justify-between"><span>Snacks</span><span>240</span></li>
            <li className="flex justify-between"><span>Dinner</span><span>300</span></li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold flex items-center gap-2"><Trophy className="w-4 h-4 text-brand-600"/> Challenge</h2>
          <p className="mt-2 text-sm text-slate-600">Day 14 of 21</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full gradient-brand" style={{width:"66%"}}/></div>
          <p className="mt-4 text-xs text-slate-500">7 days to complete the challenge.</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold">Daily checklist</h2>
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

        <div className="card p-6 lg:col-span-3 gradient-brand text-white">
          <Quote className="w-6 h-6 opacity-80"/>
          <p className="mt-3 text-xl font-semibold leading-snug">"Small steps every day beat giant leaps once a month."</p>
          <p className="mt-2 text-white/80 text-sm">— Your Levefy coach</p>
        </div>
      </div>
    </AppShell>
  );
}
