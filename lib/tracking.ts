"use client";

type MetaEvent = "Lead" | "CompleteRegistration" | "InitiateCheckout" | "Purchase";
type TrackingParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (command: "track" | "trackCustom", event: string, params?: TrackingParams) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

const gaEventMap: Record<MetaEvent, string> = {
  Lead: "generate_lead",
  CompleteRegistration: "sign_up",
  InitiateCheckout: "begin_checkout",
  Purchase: "purchase",
};

function cleanParams(params?: TrackingParams) {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as TrackingParams;
}

export function trackConversion(event: MetaEvent, params?: TrackingParams) {
  if (typeof window === "undefined") return;

  const payload = cleanParams(params);
  window.fbq?.("track", event, payload);
  window.gtag?.("event", gaEventMap[event], payload);
}
