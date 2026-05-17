"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Search, Heart } from "lucide-react";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Smoothies"];
const RECIPES = [
  { name: "Green protein bowl", kcal: 420, cat: "Lunch", emoji: "🥗", time: "15 min" },
  { name: "Avocado toast plus", kcal: 310, cat: "Breakfast", emoji: "🥑", time: "8 min" },
  { name: "Lemon herb salmon", kcal: 480, cat: "Dinner", emoji: "🐟", time: "25 min" },
  { name: "Berry power smoothie", kcal: 220, cat: "Smoothies", emoji: "🍓", time: "5 min" },
  { name: "Oat & banana bowl", kcal: 340, cat: "Breakfast", emoji: "🍌", time: "10 min" },
  { name: "Chicken quinoa plate", kcal: 510, cat: "Lunch", emoji: "🍗", time: "20 min" },
  { name: "Veggie stir-fry", kcal: 390, cat: "Dinner", emoji: "🥦", time: "18 min" },
  { name: "Greek yogurt cup", kcal: 180, cat: "Snacks", emoji: "🥄", time: "3 min" },
];

export default function Recipes() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<string[]>([]);
  const filtered = RECIPES.filter(r =>
    (cat === "All" || r.cat === cat) && r.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <AppShell title="Recipes">
      <div className="card p-4 flex items-center gap-3 mb-5">
        <Search className="w-4 h-4 text-slate-400"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search recipes..." className="flex-1 outline-none text-sm bg-transparent"/>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat===c?"gradient-brand text-white":"bg-white border border-slate-200 text-slate-600 hover:border-brand-600"}`}>{c}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500">No recipes match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(r=>{
            const fav = favs.includes(r.name);
            return (
              <div key={r.name} className="card overflow-hidden">
                <div className="aspect-[4/3] gradient-brand flex items-center justify-center text-7xl relative">
                  {r.emoji}
                  <button onClick={()=>setFavs(f=>fav?f.filter(x=>x!==r.name):[...f,r.name])} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center">
                    <Heart className={`w-4 h-4 ${fav?"fill-red-500 text-red-500":"text-slate-600"}`}/>
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs text-brand-700 font-semibold">{r.cat}</p>
                  <h3 className="mt-1 font-semibold">{r.name}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 py-2"><p className="text-xs text-slate-500">Kcal</p><p className="font-semibold text-sm">{r.kcal}</p></div>
                    <div className="rounded-lg bg-slate-50 py-2"><p className="text-xs text-slate-500">Time</p><p className="font-semibold text-sm">{r.time}</p></div>
                    <div className="rounded-lg bg-slate-50 py-2"><p className="text-xs text-slate-500">Protein</p><p className="font-semibold text-sm">28g</p></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
