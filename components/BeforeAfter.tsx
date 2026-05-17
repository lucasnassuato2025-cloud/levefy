"use client";
import { useState, useRef, useCallback } from "react";

interface Props {
  before: string;
  after: string;
  alt?: string;
}

export default function BeforeAfter({ before, after, alt = "Transformação real Levefy" }: Props) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-square overflow-hidden rounded-3xl select-none cursor-ew-resize shadow-2xl shadow-brand-900/20 ring-1 ring-white/40"
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
      onTouchEnd={() => (dragging.current = false)}
      onTouchMove={(e) => dragging.current && move(e.touches[0].clientX)}
      role="img"
      aria-label={alt}
    >
      <img
        src={after}
        alt={`${alt} — depois`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={`${alt} — antes`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-slate-700 shadow">
        ANTES
      </span>
      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold shadow">
        DEPOIS
      </span>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        style={{ left: `calc(${pos}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center ring-2 ring-brand-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L3 12L9 18M15 6L21 12L15 18" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
