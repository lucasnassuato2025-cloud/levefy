// lib/env.ts
// Validates required environment variables at runtime.
// Returns empty strings during Next.js static build so the build passes.
// Real validation happens at runtime when the user actually hits the app.

const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_PHASE === "phase-export";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (isBuildTime) {
      // During build: return placeholder so TS/Next doesn't crash
      return "";
    }
    throw new Error(
      `[Levefy] Missing required environment variable: ${key}\n` +
      `Please set it in your .env.local (dev) or Render dashboard (production).\n` +
      `See .env.example for the full list.`
    );
  }
  return value;
}

// Called lazily (on first request) so Next.js static build steps
// don't fail before the runtime environment is available.
export function getSupabaseConfig() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getDatabaseUrl() {
  return requireEnv("DATABASE_URL");
}
