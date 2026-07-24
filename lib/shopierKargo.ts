/**
 * Shopier anlaşmalı kargo (panel: Kargo Ücretleri).
 * PTT Kargo, MNG (DHL eCommerce), Yurtiçi Kargo — desi 0–12.
 * Panel tutarları formda doğrudan kullanılır (gösterilen ücret).
 */

export const SHOPIER_CARGO_NOTE =
  "Kaynak: Shopier panel Kargo Ücretleri (PTT / MNG-DHL eCommerce / Yurtiçi). Desi 0–12; üzeri için kargoyu elle girin.";

export const SHOPIER_MAX_DESI = 12;

export const SHOPIER_CARGO_CARRIERS = [
  { id: "ptt", label: "PTT Kargo" },
  { id: "dhl", label: "MNG (DHL eCommerce)" },
  { id: "yurtici", label: "Yurtiçi Kargo" },
] as const;

export type ShopierCarrierId = (typeof SHOPIER_CARGO_CARRIERS)[number]["id"];

type Row = Record<ShopierCarrierId, number>;

function row(ptt: number, dhl: number, yurtici: number): Row {
  return { ptt, dhl, yurtici };
}

/** Desi/KG → panel ücreti ₺ (0–12) */
export const SHOPIER_KARGO: Record<number, Row> = {
  0: row(81.4, 102.9, 121.9),
  1: row(82.4, 106.9, 124.9),
  2: row(82.4, 112.4, 126.9),
  3: row(99.9, 120.8, 136.9),
  4: row(99.9, 133.9, 138.9),
  5: row(105.0, 148.9, 156.9),
  6: row(111.5, 163.2, 172.9),
  7: row(118.1, 171.6, 191.2),
  8: row(131.2, 183.9, 195.6),
  9: row(144.6, 195.3, 204.5),
  10: row(164.0, 203.4, 213.3),
  11: row(172.5, 212.6, 264.4),
  12: row(181.5, 223.4, 268.7),
};

export function getShopierKargo(desi: number, carrier: ShopierCarrierId): number | null {
  const d = Math.round(desi);
  const rowData = SHOPIER_KARGO[d];
  if (!rowData) return null;
  const v = rowData[carrier];
  return typeof v === "number" ? v : null;
}

export function shopierAverageKargo(desi: number): number | null {
  const d = Math.round(Math.max(0, desi));
  const rowData = SHOPIER_KARGO[d];
  if (!rowData) return null;
  const vals = [rowData.ptt, rowData.dhl, rowData.yurtici];
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}
