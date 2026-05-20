// lib/env.ts

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    console.warn(
      `[Levefy] Variável ausente: ${key}`
    );
    return "";
  }

  return value;
}

export function getSupabaseConfig() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getDatabaseUrl() {
  return getEnv("DATABASE_URL");
}
