import AppShell from "@/components/AppShell";

async function getProfileData() {
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let dbUser = null;
    if (authUser?.email) {
      const { prisma } = await import("@/lib/prisma");
      dbUser = await prisma.user.findUnique({ where: { email: authUser.email } }).catch(() => null);
    }
    return { authUser, dbUser };
  } catch {
    return { authUser: null, dbUser: null };
  }
}

export default async function Profile() {
  const { authUser, dbUser } = await getProfileData();

  const displayName =
    dbUser?.name ??
    authUser?.user_metadata?.full_name ??
    authUser?.email?.split("@")[0] ??
    "Usuário";

  const displayEmail = authUser?.email ?? "";
  const avatar = dbUser?.avatar ?? authUser?.user_metadata?.avatar_url ?? null;
  const currentWeight = dbUser?.currentWeight ?? null;
  const goalWeight = dbUser?.goalWeight ?? null;

  return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-1 text-center">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={displayName} className="w-24 h-24 rounded-full mx-auto object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full gradient-brand mx-auto flex items-center justify-center text-white text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="mt-4 font-bold text-xl">{displayName}</h2>
          <p className="text-sm text-slate-500">{displayEmail}</p>
          <p className="mt-4 inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">Membro grátis</p>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold">Metas</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { l: "Atual", v: currentWeight ? `${currentWeight} kg` : "—" },
              { l: "Meta", v: goalWeight ? `${goalWeight} kg` : "—" },
              { l: "Prazo", v: "12 sem." },
            ].map(x => (
              <div key={x.l} className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">{x.l}</p>
                <p className="font-bold text-lg mt-1">{x.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-3">
          <h3 className="font-semibold">Preferências</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {[
              { l: "Nível de atividade", v: "Moderado" },
              { l: "Alimentação", v: "Equilibrada" },
              { l: "Alergias", v: "Nenhuma" },
              { l: "Calorias diárias", v: "1.800 kcal" },
            ].map(x => (
              <div key={x.l} className="flex justify-between items-center p-4 rounded-xl bg-slate-50">
                <span className="text-sm text-slate-600">{x.l}</span>
                <span className="font-semibold">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-3">
          <h3 className="font-semibold">Configurações de progresso</h3>
          <div className="mt-4 space-y-3">
            {[
              { t: "Lembretes diários", d: "Receba um aviso para registrar seu progresso." },
              { t: "Resumo semanal", d: "Receba um e-mail com seu progresso da semana." },
              { t: "Perfil público", d: "Compartilhe seu progresso com a comunidade." },
            ].map((x, i) => (
              <div key={x.t} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div><p className="font-medium">{x.t}</p><p className="text-sm text-slate-500">{x.d}</p></div>
                <div className={`w-12 h-7 rounded-full p-0.5 ${i !== 2 ? "bg-brand-600" : "bg-slate-300"}`}>
                  <div className={`w-6 h-6 rounded-full bg-white transition ${i !== 2 ? "translate-x-5" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
