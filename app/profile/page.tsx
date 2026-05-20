"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/AppShell";
import { Save, Trophy, Camera, Crown, CreditCard, AlertTriangle, CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";
import { getLevelFromXP, MEDALS } from "@/lib/gamification";

const RESTRICTIONS_OPTIONS = [
  { id: "lactose",    label: "🥛 Intolerância à Lactose" },
  { id: "gluten",     label: "🌾 Intolerância ao Glúten" },
  { id: "vegetariano",label: "🥦 Vegetariano" },
  { id: "vegano",     label: "🌱 Vegano" },
  { id: "low_carb",   label: "🥑 Low Carb" },
  { id: "frutos_mar", label: "🦐 Alergia a Frutos do Mar" },
  { id: "amendoim",   label: "🥜 Alergia a Amendoim" },
  { id: "ovos",       label: "🥚 Alergia a Ovos" },
  { id: "soja",       label: "🫘 Alergia a Soja" },
];

const HEALTH_TOGGLES = [
  { id: "fumante",    label: "Fumante",                    emoji: "🚬" },
  { id: "alcool",     label: "Consumo de álcool",          emoji: "🍷" },
  { id: "diabetes",   label: "Diabetes",                   emoji: "💉" },
  { id: "hipertensao",label: "Hipertensão",                emoji: "❤️" },
  { id: "lesoes",     label: "Lesões / limitações físicas", emoji: "🩹" },
];

const HEALTH_FLAGS = ["fumante", "alcool", "diabetes", "hipertensao", "lesoes"];

// Lê as flags de saúde e restrições alimentares do array restrictions
function parseRestrictions(raw: string[]) {
  const flags: Record<string, boolean> = {};
  HEALTH_FLAGS.forEach(f => { flags[f] = raw.includes(f); });
  const diet   = raw.filter(r => !HEALTH_FLAGS.includes(r) && !r.startsWith("med:") && !r.startsWith("obs:"));
  const medEntry = raw.find(r => r.startsWith("med:"));
  const obsEntry = raw.find(r => r.startsWith("obs:"));
  return {
    flags,
    diet,
    medicamentos: medEntry ? medEntry.replace("med:", "") : "",
    observacoes:  obsEntry ? obsEntry.replace("obs:", "") : "",
  };
}

// Serializa tudo de volta para o array restrictions
function serializeRestrictions(
  flags: Record<string, boolean>,
  diet: string[],
  medicamentos: string,
  observacoes: string
): string[] {
  return [
    ...diet,
    ...HEALTH_FLAGS.filter(f => flags[f]),
    ...(medicamentos.trim() ? [`med:${medicamentos.trim()}`] : []),
    ...(observacoes.trim()  ? [`obs:${observacoes.trim()}`]  : []),
  ];
}

export default function ProfilePage() {
  const [user, setUser]             = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [saveError, setSaveError]   = useState("");
  const [activeTab, setActiveTab]   = useState<"personal" | "health">("personal");

  // Formulário pessoal
  const [form, setForm] = useState({
    name: "", weight: "", height: "", age: "",
    gender: "feminino", goal: "emagrecimento", activityLevel: "moderate",
  });

  // Formulário saúde
  const [healthFlags, setHealthFlags]       = useState<Record<string, boolean>>({});
  const [dietRestrictions, setDietRestrictions] = useState<string[]>([]);
  const [medicamentos, setMedicamentos]     = useState("");
  const [observacoes, setObservacoes]       = useState("");

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [canceling, setCanceling]           = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Carrega dados do usuário
  const loadUser = useCallback(async () => {
    try {
      const res  = await fetch("/api/user/me");
      const data = await res.json();
      if (data.user) {
        const u = data.user;
        setUser(u);
        setForm({
          name:          u.name          ?? "",
          weight:        u.currentWeight?.toString() ?? "",
          height:        u.height?.toString()        ?? "",
          age:           u.age?.toString()            ?? "",
          gender:        u.gender        ?? "feminino",
          goal:          u.goal          ?? "emagrecimento",
          activityLevel: u.activityLevel ?? "moderate",
        });
        const parsed = parseRestrictions(u.restrictions ?? []);
        setHealthFlags(parsed.flags);
        setDietRestrictions(parsed.diet);
        setMedicamentos(parsed.medicamentos);
        setObservacoes(parsed.observacoes);
      }
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const xp      = user?.xp        ?? 0;
  const streak  = user?.streakDays ?? 0;
  const plan    = user?.plan       ?? "free";
  const level   = getLevelFromXP(xp);
  const avatar  = user?.avatar;
  const isPremium = plan === "premium";
  const isStart   = plan === "start";

  const toggleDiet = (id: string) => {
    setDietRestrictions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleHealth = (id: string) => {
    setHealthFlags(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // SALVAR — envia tudo para a API e recarrega os dados confirmados do servidor
  const save = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError("");

    const restrictions = serializeRestrictions(healthFlags, dietRestrictions, medicamentos, observacoes);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          form.name,
          weight:        form.weight,
          height:        form.height,
          age:           form.age,
          gender:        form.gender,
          goal:          form.goal,
          activityLevel: form.activityLevel,
          restrictions,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setSaveError(data.error ?? "Erro ao salvar. Tente novamente.");
        return;
      }

      // Recarrega do servidor para garantir sincronização total com o Dashboard
      await loadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setSaveError("Erro de conexão. Verifique sua internet.");
    } finally {
      setSaving(false);
    }
  };

  const cancelSubscription = async () => {
    setCanceling(true);
    const res  = await fetch("/api/stripe/cancel", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      alert("Assinatura cancelada. Você mantém o acesso até o fim do período atual.");
      setShowCancelConfirm(false);
      window.location.reload();
    } else {
      alert("Erro ao cancelar: " + data.error);
    }
    setCanceling(false);
  };

  const deleteAccount = async () => {
    setDeletingAccount(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: deleteConfirmation.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setDeleteError(data.error ?? "Erro ao excluir conta. Tente novamente.");
        return;
      }

      window.location.href = "/login?deleted=1";
    } catch {
      setDeleteError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-72 w-full lg:col-span-2" />
      </div>
    </AppShell>
  );

  return (
    <AppShell title="Perfil">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">

        {/* ── Card lateral ── */}
        <div className="card p-7 text-center relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-brand-100/40 blur-3xl pointer-events-none" />

          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {avatar ? (
              <img src={avatar} alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-full gradient-brand flex items-center justify-center text-5xl shadow-lg border-4 border-white">
                {level.emoji}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow border-2 border-white">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <p className="font-extrabold text-xl tracking-tight">{form.name || "Usuário"}</p>
          <p className="text-sm text-slate-500 mt-0.5">{level.title} · Nível {level.level}</p>

          <div className="mt-3">
            {isPremium && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full gradient-brand text-white text-[11px] font-extrabold tracking-wider uppercase shadow-brand">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            )}
            {isStart && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold tracking-wider uppercase">
                ⚡ START
              </span>
            )}
            {!isPremium && !isStart && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                Plano Free
              </span>
            )}
          </div>

          {/* XP e Streak */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-2xl font-extrabold text-brand-700">{xp}</p>
              <p className="text-[11px] text-brand-600 font-bold uppercase tracking-wider mt-0.5">XP total</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-2xl font-extrabold text-orange-600">{streak > 0 ? `${streak}🔥` : "0"}</p>
              <p className="text-[11px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">Streak</p>
            </div>
          </div>

          {/* Restrições ativas */}
          {dietRestrictions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Restrições ativas</p>
              <div className="flex flex-wrap gap-1">
                {dietRestrictions.slice(0, 4).map(r => {
                  const opt = RESTRICTIONS_OPTIONS.find(o => o.id === r);
                  return opt ? (
                    <span key={r} className="text-[10px] px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium">
                      {opt.label.split(" ").slice(0, 2).join(" ")}
                    </span>
                  ) : null;
                })}
                {dietRestrictions.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    +{dietRestrictions.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Cancelar assinatura */}
          {isPremium && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button onClick={() => setShowCancelConfirm(true)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition mx-auto font-medium">
                <CreditCard className="w-3.5 h-3.5" /> Cancelar assinatura
              </button>
            </div>
          )}
        </div>

        {/* ── Formulário com abas ── */}
        <div className="lg:col-span-2 card p-7">

          {/* Abas */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
            {[
              { id: "personal", label: "👤 Dados pessoais" },
              { id: "health",   label: "🏥 Saúde e restrições" },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === t.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Aba: Dados pessoais */}
          {activeTab === "personal" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">Dados pessoais</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mantenha seus dados atualizados para um plano mais preciso</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Nome completo</label>
                  <input type="text" placeholder="Seu nome" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="input-premium" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Peso atual (kg)</label>
                  <input type="number" placeholder="70" value={form.weight}
                    onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                    className="input-premium" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Altura (cm)</label>
                  <input type="number" placeholder="165" value={form.height}
                    onChange={e => setForm(p => ({ ...p, height: e.target.value }))}
                    className="input-premium" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Idade</label>
                  <input type="number" placeholder="30" value={form.age}
                    onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                    className="input-premium" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Sexo</label>
                  <select value={form.gender}
                    onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="input-premium bg-white">
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Objetivo</label>
                  <select value={form.goal}
                    onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
                    className="input-premium bg-white">
                    <option value="emagrecimento">🔥 Emagrecimento</option>
                    <option value="hipertrofia">💪 Hipertrofia</option>
                    <option value="manutencao">⚖️ Manutenção</option>
                    <option value="low_carb">🥑 Low Carb</option>
                    <option value="definicao">⚡ Definição</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">Nível de atividade física</label>
                  <select value={form.activityLevel}
                    onChange={e => setForm(p => ({ ...p, activityLevel: e.target.value }))}
                    className="input-premium bg-white">
                    <option value="sedentario">😴 Sedentário (sem exercícios)</option>
                    <option value="leve">🚶 Levemente ativo (1–3x/semana)</option>
                    <option value="moderate">🏃 Moderadamente ativo (3–5x/semana)</option>
                    <option value="ativo">💪 Muito ativo (6–7x/semana)</option>
                    <option value="muito_ativo">🔥 Extremamente ativo (atleta)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Aba: Saúde */}
          {activeTab === "health" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">Saúde e estilo de vida</h3>
                <p className="text-xs text-slate-500 mt-0.5">Informações confidenciais para personalizar seu plano</p>
              </div>

              {/* Toggles de saúde */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Condições</p>
                <div className="space-y-2">
                  {HEALTH_TOGGLES.map(f => (
                    <div key={f.id} onClick={() => toggleHealth(f.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        healthFlags[f.id]
                          ? "border-brand-300 bg-brand-50"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{f.emoji}</span>
                        <span className="text-sm font-semibold text-slate-700">{f.label}</span>
                      </div>
                      {/* Toggle visual */}
                      <div className={`w-11 h-6 rounded-full relative transition-all duration-200 ${
                        healthFlags[f.id] ? "bg-brand-500" : "bg-slate-200"
                      }`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                          healthFlags[f.id] ? "left-5" : "left-0.5"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pills restrições alimentares */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Restrições alimentares e alergias</p>
                <div className="flex flex-wrap gap-2">
                  {RESTRICTIONS_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => toggleDiet(opt.id)}
                      className={`px-3 py-2 rounded-full text-xs font-bold transition-all duration-200 border-2 ${
                        dietRestrictions.includes(opt.id)
                          ? "gradient-brand text-white border-transparent shadow-sm"
                          : "border-slate-200 text-slate-600 hover:border-brand-300 bg-white"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos extras */}
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">💊 Medicamentos em uso</label>
                  <input type="text" placeholder="Ex: metformina, losartana..."
                    value={medicamentos}
                    onChange={e => setMedicamentos(e.target.value)}
                    className="input-premium" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block font-medium">📝 Observações adicionais</label>
                  <textarea placeholder="Ex: tenho refluxo, dores nas articulações..."
                    value={observacoes}
                    onChange={e => setObservacoes(e.target.value)}
                    rows={3}
                    className="input-premium resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* Botão salvar + feedback */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            {saved && (
              <div className="flex items-center gap-2 text-brand-700 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-600" />
                Perfil salvo com sucesso! Dados sincronizados com o Painel.
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {saveError}
              </div>
            )}
            <button onClick={save} disabled={saving}
              className="btn-primary gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                : <><Save className="w-4 h-4" /> Salvar perfil</>}
            </button>
          </div>
        </div>

        {/* ── Medalhas ── */}
        <div className="lg:col-span-3 card p-7">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold flex items-center gap-2 tracking-tight">
              <Trophy className="w-4 h-4 text-amber-500" /> Conquistas
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {MEDALS.length} medalhas
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MEDALS.map(m => (
              <div key={m.id}
                className="text-center p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
                <div className="text-4xl mb-2">{m.emoji}</div>
                <p className="text-xs font-bold leading-tight">{m.title}</p>
                <p className="text-[11px] text-brand-600 mt-1 font-bold">+{m.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Zona de perigo */}
      <div className="mt-6 card p-6 border border-red-100 bg-red-50/40">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-extrabold uppercase tracking-wider mb-3">
              <AlertTriangle className="w-3.5 h-3.5" /> Zona de perigo
            </div>
            <h3 className="font-extrabold text-slate-900">Excluir conta definitivamente</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Isso remove seus dados do Levefy, apaga seu acesso e cancela qualquer mensalidade ativa para evitar novas cobranças.
              Essa ação não pode ser desfeita.
            </p>
          </div>
          <button
            onClick={() => {
              setDeleteError("");
              setDeleteConfirmation("");
              setShowDeleteConfirm(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition font-extrabold text-sm shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Excluir conta
          </button>
        </div>
      </div>

      {/* Modal cancelar */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-extrabold">Cancelar assinatura?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Você perderá acesso ao PREMIUM ao fim do período atual. Tem certeza?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 btn-ghost">
                Manter plano
              </button>
              <button onClick={cancelSubscription} disabled={canceling}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 disabled:opacity-60">
                {canceling ? "Cancelando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full shadow-2xl border border-red-100">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Excluir conta?</h3>
                  <p className="text-xs text-slate-500">Ação permanente</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteConfirm(false)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-800 leading-relaxed mb-4">
              <p className="font-bold mb-1">O que acontece ao confirmar:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>seus dados, progresso e check-ins serão removidos;</li>
                <li>sua mensalidade ativa será cancelada imediatamente;</li>
                <li>o login será removido do Supabase;</li>
                <li>essa ação não poderá ser desfeita.</li>
              </ul>
            </div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Digite EXCLUIR para confirmar
            </label>
            <input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="EXCLUIR"
              className="input-premium mb-3"
            />

            {deleteError && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm font-medium mb-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-ghost">
                Manter conta
              </button>
              <button
                onClick={deleteAccount}
                disabled={deletingAccount || deleteConfirmation.trim() !== "EXCLUIR"}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white font-extrabold py-3 px-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingAccount ? "Excluindo..." : "Excluir agora"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
