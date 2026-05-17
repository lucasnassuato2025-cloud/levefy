import AppShell from "@/components/AppShell";
export default function Profile() {
  return (
    <AppShell title="Profile">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-1 text-center">
          <div className="w-24 h-24 rounded-full gradient-brand mx-auto"/>
          <h2 className="mt-4 font-bold text-xl">Jane Doe</h2>
          <p className="text-sm text-slate-500">jane@email.com</p>
          <p className="mt-4 inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">Premium member</p>
        </div>
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold">Goals</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { l: "Current", v: "72.4 kg" },
              { l: "Goal", v: "68.0 kg" },
              { l: "Timeline", v: "12 wks" },
            ].map(x=>(
              <div key={x.l} className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">{x.l}</p>
                <p className="font-bold text-lg mt-1">{x.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-3">
          <h3 className="font-semibold">Preferences</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {[
              { l: "Height", v: "168 cm" },
              { l: "Age", v: "29" },
              { l: "Activity level", v: "Moderate" },
              { l: "Diet", v: "Balanced" },
              { l: "Allergies", v: "None" },
              { l: "Daily calories", v: "1,800 kcal" },
            ].map(x=>(
              <div key={x.l} className="flex justify-between items-center p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-600">{x.l}</span>
                <span className="font-semibold">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-3">
          <h3 className="font-semibold">Progress settings</h3>
          <div className="mt-4 space-y-3">
            {[
              { t: "Daily reminders", d: "Get a gentle push to log your progress." },
              { t: "Weekly summary", d: "Receive a weekly progress email." },
              { t: "Public profile", d: "Share your progress with the community." },
            ].map((x,i)=>(
              <div key={x.t} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div><p className="font-medium">{x.t}</p><p className="text-sm text-slate-500">{x.d}</p></div>
                <div className={`w-12 h-7 rounded-full p-0.5 ${i!==2?"bg-brand-600":"bg-slate-300"}`}>
                  <div className={`w-6 h-6 rounded-full bg-white transition ${i!==2?"translate-x-5":""}`}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
