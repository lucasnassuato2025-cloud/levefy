import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://levefy-mu.vercel.app"),
  title: "Levefy | Rotina saudável com IA",
  description: "Planos, receitas, hábitos e check-ins em um só lugar. Comece grátis com o Levefy.",
  applicationName: "Levefy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Levefy" },
  icons: { icon: "/favicon.ico", apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    title: "Levefy | Rotina saudável com IA",
    description: "Organize sua alimentação com planos, receitas e hábitos em um só lugar.",
    url: "https://levefy-mu.vercel.app",
    siteName: "Levefy",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Levefy - Rotina saudável com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Levefy | Rotina saudável com IA",
    description: "Planos, receitas, hábitos e check-ins em um só lugar.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function isValidTrackingId(value?: string) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== "null" && normalized !== "undefined" && normalized !== "";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID?.trim();

  return (
    <html lang="pt-BR">
      <head>
        {isValidTrackingId(metaPixelId) && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${metaPixelId}');fbq('track','PageView');
          ` }} />
        )}
        {isValidTrackingId(ga4Id) && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
          </>
        )}
      </head>
      <body>
        {isValidTrackingId(metaPixelId) && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}` }} />
      </body>
    </html>
  );
}
