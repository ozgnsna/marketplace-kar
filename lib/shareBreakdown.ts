import type { ExpenseBreakdownItem } from "@/types/profit";

/** Satır ayırıcı. Eski paylaşım linkleri için. */
const ROW = "|";
/** Etiket ile tutar ayırıcı. Eski paylaşım linkleri için. */
const KV = "~";

const PLATFORMS = new Set(["trendyol", "hepsiburada", "shopier", "n11", "pttavm"]);

/** Uzun kodlar önce denenir (`km`, `k`'dan önce). */
const CODES = ["km", "c", "t", "s", "r", "h", "k", "p", "l", "w", "o", "i", "a"] as const;

type ShareCode = (typeof CODES)[number];

const CODE_LABEL: Record<ShareCode, string> = {
  c: "Komisyon",
  t: "Tahsilat yönetim bedeli",
  s: "Stopaj",
  r: "Reklam / görünürlük",
  h: "Hizmet bedeli",
  k: "Kargo bedeli",
  km: "Kargo (müşteri ödüyor)",
  p: "Paketleme",
  l: "Listeleme / vitrin",
  w: "Depoya gönderim",
  o: "Diğer sabit giderler",
  i: "İade / risk payı (liste üzerinden)",
  a: "Alış (KDV dahil)",
};

const LABEL_CODE: Record<string, ShareCode> = {
  "Komisyon tutarı": "c",
  Komisyon: "c",
  "Tahsilat yönetim bedeli": "t",
  "Tahsilat yönetim / işlem": "t",
  "MP stopaj": "s",
  Stopaj: "s",
  "Reklam / görünürlük": "r",
  "Hizmet bedeli": "h",
  "Kargo bedeli": "k",
  "Kargo (müşteri ödüyor)": "km",
  Paketleme: "p",
  "Listeleme / vitrin bedeli": "l",
  "Listeleme / vitrin": "l",
  "Depoya gönderim": "w",
  "Diğer sabit": "o",
  "Diğer sabit giderler": "o",
  "İade / risk payı (liste üzerinden)": "i",
  "Alış (KDV dahil)": "a",
  "Alış fiyatı (KDV dahil)": "a",
};

function kurus(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Gider kalemlerini kısa koda çevirir. Sıfır tutarlar yazılmaz.
 * Örnek: `c104858t8250k12514a650000` → komisyon 1.048,58 ₺, tahsilat 82,50 ₺, …
 */
export function encodeCompactBreakdown(rows: ExpenseBreakdownItem[]): string {
  const parts: string[] = [];
  for (const row of rows) {
    const code = LABEL_CODE[row.label];
    if (!code || !Number.isFinite(row.amount)) continue;
    const value = kurus(row.amount);
    if (value === 0 && code !== "km") continue;
    parts.push(`${code}${value}`);
  }
  return parts.join("") || "0";
}

export function decodeCompactBreakdown(raw: string | undefined): ExpenseBreakdownItem[] {
  if (!raw || raw === "0") return [];
  const rows: ExpenseBreakdownItem[] = [];
  let index = 0;
  while (index < raw.length) {
    const code = CODES.find((item) => raw.startsWith(item, index));
    if (!code) break;
    index += code.length;
    const start = index;
    while (index < raw.length && raw.charCodeAt(index) >= 48 && raw.charCodeAt(index) <= 57) {
      index += 1;
    }
    if (index === start) break;
    const value = Number(raw.slice(start, index));
    if (!Number.isFinite(value)) break;
    rows.push({ label: CODE_LABEL[code], amount: value / 100 });
  }
  return rows;
}

export function buildSharePath(input: {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
}): string {
  const platform = PLATFORMS.has(input.platform) ? input.platform : "trendyol";
  const profit = String(Math.round(input.netProfit));
  const margin = (Number.isFinite(input.marginPercent) ? input.marginPercent : 0).toFixed(1);
  const sale = String(Math.round(Math.max(0, input.salePrice)));
  const details = encodeCompactBreakdown(input.breakdown);
  return `/s/${platform}/${profit}/${margin}/${sale}/${details}`;
}

export function parseShareRoute(parts: {
  platform: string;
  profit: string;
  margin: string;
  sale: string;
  details?: string;
}): {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
} {
  const profit = Number(parts.profit);
  const margin = Number(parts.margin);
  const sale = Number(parts.sale);
  return {
    platform: PLATFORMS.has(parts.platform) ? parts.platform : "trendyol",
    netProfit: Number.isFinite(profit) ? profit : 0,
    marginPercent: Number.isFinite(margin) ? margin : 0,
    salePrice: Number.isFinite(sale) ? sale : 0,
    breakdown: decodeCompactBreakdown(parts.details),
  };
}

/**
 * Eski paylaşım URL'si (`?bd=Komisyon tutarı~825.00|...`).
 * Yeni linkler bunu kullanmaz.
 */
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
