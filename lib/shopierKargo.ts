/**
 * Shopier anlaşmalı kargo (panel: Kargo Ücretleri, 15 Kasım 2026).
 * PTT Kargo, MNG (DHL eCommerce), Yurtiçi Kargo — desi 0–25.
 * Panel tutarları formda doğrudan kullanılır (gösterilen ücret).
 */

export const SHOPIER_CARGO_NOTE =
  "Kaynak: Shopier panel Kargo Ücretleri (15 Kasım 2026, PTT / MNG-DHL eCommerce / Yurtiçi). Desi 0–25; üzeri için kargoyu elle girin.";

export const SHOPIER_MAX_DESI = 25;

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

/** Desi/KG → panel ücreti ₺ (0–25) */
export const SHOPIER_KARGO: Record<number, Row> = {
  0: row(88.4, 102.9, 121.9),
  1: row(88.4, 106.9, 124.9),
  2: row(88.4, 112.4, 126.9),
  3: row(109.5, 120.8, 136.9),
  4: row(109.5, 133.9, 138.9),
  5: row(112.9, 148.9, 156.9),
  6: row(120.5, 163.2, 172.9),
  7: row(127.5, 171.6, 191.2),
  8: row(141.7, 183.9, 195.6),
  9: row(156.2, 195.3, 204.5),
  10: row(177.2, 203.4, 213.3),
  11: row(186.3, 212.6, 264.4),
  12: row(196, 223.4, 268.7),
  13: row(205.5, 235.6, 284.2),
  14: row(214.6, 248.6, 288.5),
  15: row(224, 260.9, 298.9),
  16: row(233.3, 307, 352),
  17: row(242.7, 319, 352),
  18: row(253, 338.5, 352),
  19: row(261.7, 361.7, 352),
  20: row(270.9, 384.7, 352),
  21: row(280.8, 394.8, 511),
  22: row(290, 404.9, 511),
  23: row(299.2, 430.6, 511),
  24: row(308.9, 459.3, 511),
  25: row(318.6, 486.5, 511),
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
