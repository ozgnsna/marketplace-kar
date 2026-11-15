import type { ExpenseBreakdownItem } from "@/types/profit";

/** Satır ayırıcı. Etiketlerde kullanılmaz. */
const ROW = "|";
/** Etiket ile tutar ayırıcı. */
const KV = "~";

/**
 * Paylaşım URL'sine gider kalemlerini sıkıştırır.
 * Örnek: `Komisyon tutarı~825.00|Kargo bedeli~89.90`
 */
export function encodeShareBreakdown(rows: ExpenseBreakdownItem[]): string {
  return rows
    .filter((row) => row.label.trim() && Number.isFinite(row.amount))
    .map((row) => {
      const label = row.label.replace(/[|~]/g, " ").trim();
      const amount = row.amount.toFixed(2);
      return `${label}${KV}${amount}`;
    })
    .join(ROW);
}

export function decodeShareBreakdown(raw: string | undefined): ExpenseBreakdownItem[] {
  if (!raw) return [];
  const rows: ExpenseBreakdownItem[] = [];
  for (const part of raw.split(ROW)) {
    const splitAt = part.lastIndexOf(KV);
    if (splitAt <= 0) continue;
    const label = part.slice(0, splitAt).trim();
    const amount = Number(part.slice(splitAt + 1));
    if (!label || !Number.isFinite(amount)) continue;
    rows.push({ label, amount });
  }
  return rows;
}
