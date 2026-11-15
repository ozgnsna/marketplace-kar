import type { ExpenseBreakdownItem } from "@/types/profit";

/** Satır ayırıcı. Eski paylaşım linkleri için. */
const ROW = "|";
/** Etiket ile tutar ayırıcı. Eski paylaşım linkleri için. */
const KV = "~";

const PLATFORM_LIST = ["trendyol", "hepsiburada", "shopier", "n11", "pttavm"] as const;
const PLATFORMS = new Set<string>(PLATFORM_LIST);
const CODE_LIST = ["c", "t", "s", "r", "h", "k", "km", "p", "l", "w", "o", "i", "a"] as const;

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

function pushVarint(out: number[], value: number) {
  let n = Math.max(0, Math.floor(value));
  for (let i = 0; i < 8; i++) {
    const byte = n % 128;
    n = Math.floor(n / 128);
    if (n === 0) {
      out.push(byte);
      return;
    }
    out.push(byte + 128);
  }
}

function readVarint(bytes: Uint8Array, pos: { i: number }): number | null {
  let n = 0;
  let mul = 1;
  for (let k = 0; k < 8; k++) {
    if (pos.i >= bytes.length) return null;
    const byte = bytes[pos.i];
    pos.i += 1;
    n += (byte & 127) * mul;
    if ((byte & 128) === 0) return n;
    mul *= 128;
  }
  return null;
}

function zigzag(n: number): number {
  const v = Math.trunc(n);
  return v < 0 ? -v * 2 - 1 : v * 2;
}

function unzigzag(n: number): number {
  return n % 2 === 1 ? -Math.floor(n / 2) - 1 : n / 2;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(token: string): Uint8Array {
  const pad = token.length % 4 === 0 ? "" : "=".repeat(4 - (token.length % 4));
  const binary = atob(token.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Paylaşım adresindeki tek kod. Sayfa bunu tekrar kâr ve gider dökümüne çevirir. */
export function encodeShareToken(input: {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
}): string {
  const platform = PLATFORMS.has(input.platform) ? input.platform : "trendyol";
  const platformIndex = PLATFORM_LIST.indexOf(platform as (typeof PLATFORM_LIST)[number]);
  const bytes: number[] = [(1 << 4) | platformIndex];
  pushVarint(bytes, Math.round(Math.max(0, input.salePrice)));
  pushVarint(bytes, zigzag(Math.round(input.netProfit)));
  const tenths = Math.round((Number.isFinite(input.marginPercent) ? input.marginPercent : 0) * 10);
  pushVarint(bytes, zigzag(tenths));
  for (const row of input.breakdown) {
    const code = LABEL_CODE[row.label];
    if (!code || !Number.isFinite(row.amount)) continue;
    const value = kurus(row.amount);
    if (value === 0 && code !== "km") continue;
    const index = CODE_LIST.indexOf(code);
    if (index < 0) continue;
    bytes.push(index);
    pushVarint(bytes, Math.max(0, value));
  }
  return bytesToBase64Url(Uint8Array.from(bytes));
}

export function decodeShareToken(token: string): {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
} | null {
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return null;
  let bytes: Uint8Array;
  try {
    bytes = base64UrlToBytes(token);
  } catch {
    return null;
  }
  if (bytes.length < 2 || bytes[0] >> 4 !== 1) return null;
  const platformIndex = bytes[0] & 0x0f;
  if (platformIndex >= PLATFORM_LIST.length) return null;
  const pos = { i: 1 };
  const sale = readVarint(bytes, pos);
  const profit = readVarint(bytes, pos);
  const margin = readVarint(bytes, pos);
  if (sale == null || profit == null || margin == null) return null;
  const breakdown: ExpenseBreakdownItem[] = [];
  while (pos.i < bytes.length) {
    const code = CODE_LIST[bytes[pos.i]];
    pos.i += 1;
    const value = readVarint(bytes, pos);
    if (!code || value == null) return null;
    breakdown.push({ label: CODE_LABEL[code], amount: value / 100 });
  }
  return {
    platform: PLATFORM_LIST[platformIndex],
    netProfit: unzigzag(profit),
    marginPercent: unzigzag(margin) / 10,
    salePrice: sale,
    breakdown,
  };
}

export function buildSharePath(input: {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
}): string {
  return `/s/${encodeShareToken(input)}`;
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
