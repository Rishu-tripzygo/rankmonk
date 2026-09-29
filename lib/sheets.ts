// Server-only: appends form submissions to a Google Sheet through the Apps Script
// web app in integrations/google-sheets/Code.gs. The URL and shared secret never
// reach the browser.

export type SheetName = "Demo requests" | "Newsletter";

function config() {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.GOOGLE_SHEETS_SECRET?.trim();
  return url && secret ? { url, secret } : null;
}

export const sheetsConfigured = () => config() !== null;

/**
 * Appends one row. `row` keys become column headers (created on first use), so
 * adding a field here adds a column in the sheet. Throws on any failure.
 */
export async function appendRow(sheet: SheetName, row: Record<string, string>): Promise<{ duplicate: boolean }> {
  const c = config();
  if (!c) throw new Error("Google Sheets is not configured");
  const res = await fetch(c.url, {
    method: "POST",
    // text/plain avoids a CORS preflight on Apps Script and is parsed as JSON there.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: c.secret, sheet, row }),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; duplicate?: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) throw new Error(`Sheets append failed: ${res.status} ${data?.error ?? "invalid response"}`);
  return { duplicate: !!data.duplicate };
}

/** Timestamp in India time, e.g. "2026-09-29 15:42:07 IST". */
export function istNow(): string {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }) + " IST";
}
