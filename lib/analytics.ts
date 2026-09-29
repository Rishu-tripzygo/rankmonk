// Client-side analytics helpers. Safe to call when GA4 is not configured.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "rm_attribution";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * First-touch attribution: the first UTM-tagged landing within 90 days is kept in
 * localStorage and attached to demo requests. The URL itself is never modified.
 */
export function captureUtm(search: string): void {
  const params = new URLSearchParams(search);
  const utm: Utm = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 200);
  }
  if (!Object.keys(utm).length) return;
  try {
    const existing = readStored();
    if (existing) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ utm, landing: location.pathname, ts: Date.now() }));
  } catch {
    // Storage unavailable (private mode / blocked): attribution is best-effort.
  }
}

function readStored(): { utm: Utm; landing: string; ts: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { utm: Utm; landing: string; ts: number };
    if (Date.now() - v.ts > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

export function getAttribution(): { utm: Utm; landing?: string } {
  const v = readStored();
  return v ? { utm: v.utm, landing: v.landing } : { utm: {} };
}
