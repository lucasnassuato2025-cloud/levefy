// public/sw.js — Levefy Service Worker
// Strategy: Cache-first for static assets, network-first for pages

const CACHE_NAME = "levefy-v2";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip auth, API and Supabase routes — nunca interceptar
  if (
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/api") ||
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("google.com") ||
    url.hostname.includes("accounts.google") ||
    url.search.includes("code=") ||
    url.search.includes("provider=")
  ) return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Network-first for HTML navigation (pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) =>
      cached ?? fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
    )
  );
});
