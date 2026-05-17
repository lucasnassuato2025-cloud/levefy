import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Levefy — Lose weight without impossible diets",
  description: "Premium weight loss & healthy lifestyle SaaS. Simple routines, healthy recipes, 21-day challenges and real accountability.",
  applicationName: "Levefy",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Levefy",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Levefy — Lose weight without impossible diets",
    description: "Healthy lifestyle SaaS with recipes, routines and 21-day challenges.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
