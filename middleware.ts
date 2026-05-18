import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/meal-ai", "/recipes", "/challenge", "/profile", "/admin"];
const ADMIN_ONLY = ["/admin"];
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@levefy.com";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Rate limit for API routes (basic)
  if (pathname.startsWith("/api/ai/")) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    // In production, use upstash/redis for proper rate limiting
  }

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return res;

  const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies: any[]) => {
        cookies.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  }
);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (ADMIN_ONLY.some(p => pathname.startsWith(p)) && session.user.email !== ADMIN_EMAIL) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = { matcher: ["/((?!_next|api/auth|login|favicon|icons|manifest|sw.js|og.png).*)"] };
