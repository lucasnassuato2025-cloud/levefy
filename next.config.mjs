/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Render deployment
  output: "standalone",

  // Security headers ajustados para permitir Auth externa
  async headers() {
    return [
      {\n        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // Mudado de DENY para SAMEORIGIN
          { key: "Referrer-Policy", value: "no-referrer-when-downgrade" }, // Permite o callback do Google
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;