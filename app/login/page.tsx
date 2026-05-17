"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { GoogleButton } from "@/components/GoogleButton";
import { auth } from "@/lib/auth";
import { syncCurrentUser } from "@/app/actions/sync-user";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

type Mode = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await auth.signInWithEmail(form.email, form.password);
        await syncCurrentUser();
        router.push("/dashboard");
      } else if (mode === "register") {
        await auth.signUp(form.name, form.email, form.password);
        setSuccess("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      } else {
        await auth.sendPasswordReset(form.email);
        setSuccess("Link de redefinição enviado! Cheque sua caixa de entrada.");
        setMode("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative gradient-brand">
        <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
          <Logo light />
          <div>
            <h2 className="text-4xl font-bold leading-tight">Emagreça sem dietas impossíveis.</h2>
            <p className="mt-4 text-white/85">Bem-vindo de volta. Sua sequência está esperando.</p>
          </div>
          <p className="text-sm text-white/70">© Levefy</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-3xl font-bold">
            {mode === "login" && "Bem-vindo de volta"}
            {mode === "register" && "Crie sua conta"}
            {mode === "forgot" && "Redefina sua senha"}
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            {mode === "login" && "Entre para continuar sua jornada."}
            {mode === "register" && "Comece seu estilo de vida saudável hoje."}
            {mode === "forgot" && "Vamos enviar um link de redefinição."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}
            {mode === "register" && (
              <Field icon={<User className="w-4 h-4"/>} label="Nome completo" type="text" placeholder="Maria Silva"
                value={form.name} onChange={v=>setForm({...form, name: v})}/>
            )}
            <Field icon={<Mail className="w-4 h-4"/>} label="E-mail" type="email" placeholder="voce@email.com"
              value={form.email} onChange={v=>setForm({...form, email: v})}/>
            {mode !== "forgot" && (
              <Field icon={<Lock className="w-4 h-4"/>} label="Senha" type="password" placeholder="••••••••"
                value={form.password} onChange={v=>setForm({...form, password: v})}/>
            )}
            {mode === "login" && (
              <button type="button" onClick={()=>setMode("forgot")} className="text-sm text-brand-700 font-semibold">Esqueceu a senha?</button>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "Aguarde..." :
                mode === "login" ? "Entrar" :
                mode === "register" ? "Criar conta" : "Enviar link de redefinição"}
            </button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="flex items-center gap-3 my-6 text-xs text-slate-400">
                <div className="h-px bg-slate-200 flex-1"/> OU <div className="h-px bg-slate-200 flex-1"/>
              </div>
              <div className="space-y-2">
                <GoogleButton />
                <button className="btn-ghost w-full">Continuar com Apple</button>
              </div>
            </>
          )}

          <p className="mt-8 text-sm text-slate-600 text-center">
            {mode === "login" && (<>Novo aqui? <button onClick={()=>setMode("register")} className="text-brand-700 font-semibold">Criar conta</button></>)}
            {mode === "register" && (<>Já tem uma conta? <button onClick={()=>setMode("login")} className="text-brand-700 font-semibold">Entrar</button></>)}
            {mode === "forgot" && (<button onClick={()=>setMode("login")} className="text-brand-700 font-semibold">Voltar para o login</button>)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, type, placeholder, value, onChange }: {
  icon: React.ReactNode; label: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
        <span className="text-slate-400">{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
          className="flex-1 outline-none text-sm bg-transparent" />
      </div>
    </label>
  );
}
