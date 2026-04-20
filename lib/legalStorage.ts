/**
 * localStorage anahtarı — kullanım onayı.
 * Sürüm değişince eski anahtar yok sayılır; metin güncellemesinde herkes yeniden onaylar.
 */
export const LEGAL_ACCEPTED_KEY = "pazarkarLegalConsent.v2";

export function readLegalAccepted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LEGAL_ACCEPTED_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeLegalAccepted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEGAL_ACCEPTED_KEY, "true");
  } catch {
    /* yoksay */
  }
}
