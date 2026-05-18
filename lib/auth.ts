// FIX RENDER BUILD

import { createClient } from "@/lib/supabase";

export type AuthError = { message: string };

export const auth = {
  async signInWithEmail(email: string, password: string) {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
  },

  async signUp(name: string, email: string, password: string) {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) throw new Error(error.message);
  },

  async signInWithGoogle() {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw new Error(error.message);
  },

  async sendPasswordReset(email: string) {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/profile`,
    });

    if (error) throw new Error(error.message);
  },

  async signOut() {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    await supabase.auth.signOut();
  },

  async getUser() {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase client não inicializado");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  },
};
