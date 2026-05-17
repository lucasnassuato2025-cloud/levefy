// lib/prisma.ts
// Singleton pattern prevents "too many connections" in dev with hot reload.
// At build time (no DATABASE_URL), prisma is a no-op proxy so Next.js doesn't crash.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // During Next.js static build, DATABASE_URL may not be set.
  // Return a proxy that throws only when actually called at runtime.
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
        return new Proxy(
          {},
          {
            get() {
              return () => {
                throw new Error(
                  "[Levefy] DATABASE_URL is not set. Please configure your Neon PostgreSQL connection."
                );
              };
            },
          }
        );
      },
    });
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
