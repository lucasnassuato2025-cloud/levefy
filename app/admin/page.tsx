import AppShell from "@/components/AppShell";
import { Users, UtensilsCrossed, Trophy, TrendingUp, Plus } from "lucide-react";

export default function Admin() {
  const stats = [
    { l: "Total users", v: "12,438", icon: Users, d: "+8.2% this month" },
    { l: "Active recipes", v: "186", icon: UtensilsCrossed, d: "12 new" },
    { l: "Challenges", v: "9", icon: Trophy, d: "3 running" },
    { l: "MRR", v: "$24,820", icon: TrendingUp, d: "+12.4%" },
  ];
  const recipes = [
    { name: "Green protein bowl", cat: "Lunch", kcal: 420, status: "Published" },
    { name: "Lemon herb salmon", cat: "Dinner", kcal: 480, status: "Published" },
    { name: "Oat & banana bowl", cat: "Breakfast", kcal: 340, status: "Draft" },
  ];
  const users = [
    { n: "Sara K.", e: "sara@email.com", plan: "Premium" },
    { n: "Daniel R.", e: "daniel@email.com", plan: "VIP" },
    { n: "Mia L.", e: "mia@email.com", plan: "Free" },
  ];
  return (
    <AppShell title="Admin">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s=>(
          <div key={s.l} className="card p-5">
            <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center"><s.icon className="w-5 h-5"/></span>
            <p className="mt-3 text-2xl font-bold">{s.v}</p>
            <p className="text-sm text-slate-500">{s.l}</p>
            <p className="text-xs text-brand-700 mt-2">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recipes</h2>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700"><Plus className="w-4 h-4"/> New</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500"><tr><th className="py-2">Name</th><th>Category</th><th>Kcal</th><th>Status</th></tr></thead>
            <tbody>
              {recipes.map(r=>(
                <tr key={r.name} className="border-t border-slate-100">
                  <td className="py-3 font-medium">{r.name}</td><td>{r.cat}</td><td>{r.kcal}</td>
                  <td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status==="Published"?"bg-brand-50 text-brand-700":"bg-slate-100 text-slate-600"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Challenges</h2>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700"><Plus className="w-4 h-4"/> New</button>
          </div>
          <ul className="space-y-3">
            {[
              { n: "21-Day Reset", users: 1840, status: "Running" },
              { n: "Hydration Boost", users: 920, status: "Running" },
              { n: "Sugar Detox", users: 460, status: "Draft" },
            ].map(c=>(
              <li key={c.n} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div><p className="font-medium">{c.n}</p><p className="text-xs text-slate-500">{c.users} users</p></div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status==="Running"?"bg-brand-50 text-brand-700":"bg-slate-100 text-slate-600"}`}>{c.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Recent users</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500"><tr><th className="py-2">Name</th><th>Email</th><th>Plan</th><th></th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.e} className="border-t border-slate-100">
                  <td className="py-3 font-medium">{u.n}</td><td className="text-slate-600">{u.e}</td>
                  <td><span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">{u.plan}</span></td>
                  <td className="text-right"><button className="text-sm text-slate-500 hover:text-slate-900">Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
