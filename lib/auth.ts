// Lightweight auth stub. Swap in Supabase, Auth.js, Firebase, etc. later.
// All functions are safe no-ops returning placeholder data so the UI works.

export type AuthUser = { id: string; email: string; name: string; avatar?: string };

const KEY = "levefy.user";

export const auth = {
  async signInWithEmail(email: string, _password: string): Promise<AuthUser> {
    const user: AuthUser = { id: "demo", email, name: email.split("@")[0] };
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  async signUp(name: string, email: string, _password: string): Promise<AuthUser> {
    const user: AuthUser = { id: "demo", email, name };
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  async signInWithGoogle(): Promise<AuthUser> {
    // Placeholder: wire to Google Identity Services or Supabase OAuth later.
    // Recommended: supabase.auth.signInWithOAuth({ provider: "google" })
    const user: AuthUser = { id: "google_demo", email: "you@gmail.com", name: "Google User" };
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  async signInWithApple(): Promise<AuthUser> {
    const user: AuthUser = { id: "apple_demo", email: "you@icloud.com", name: "Apple User" };
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },
  async sendPasswordReset(_email: string): Promise<void> { return; },
  async signOut(): Promise<void> {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },
  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
};
