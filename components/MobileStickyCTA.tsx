"use client";
import { useEffect, useState } from "react";
import DownloadAppButton from "./DownloadAppButton";

/**
 * Sticky CTA "Baixar App" só no mobile, fora do dashboard
 * (dashboard já tem MobileNav fixo embaixo).
 */
export default function MobileStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 bg-gradient-to-t from-white via-white/95 to-white/0 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <DownloadAppButton variant="primary" fullWidth />
    </div>
  );
}
