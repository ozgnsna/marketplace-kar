/**
 * Hepsiburada anlaşmalı kargo (PDF: 10 Ağustos 2026 itibarıyla).
 * Tutarlar KDV hariç (₺). Uygulamada KDV dahil maliyet için × 1,20 kullanılır.
 */

export const HEPSIBURADA_CARGO_NOTE =
  "Kaynak: Hepsiburada güncel kargo fiyatları PDF (10 Ağustos 2026). Tablo KDV hariçtir; kargo alanına KDV dahil yazılır.";

export const HEPSIBURADA_CARGO_CARRIERS = [
  { id: "aras", label: "Aras" },
  { id: "dhl", label: "DHL" },
  { id: "hepsiJet", label: "HepsiJet" },
  { id: "kolayGelsin", label: "Kolay Gelsin" },
  { id: "ptt", label: "PTT" },
  { id: "surat", label: "Sürat" },
  { id: "yurtici", label: "Yurtiçi" },
  { id: "cevaTedarik", label: "CEVA Tedarik" },
  { id: "ceva", label: "CEVA Lojistik" },
  { id: "hepsiJetXl", label: "HepsiJet XL" },
  { id: "horoz", label: "Horoz" },
] as const;

export type HepsiburadaCarrierId = (typeof HEPSIBURADA_CARGO_CARRIERS)[number]["id"];

type Row = Record<HepsiburadaCarrierId, number>;

function row(
  aras: number,
  dhl: number,
  hepsiJet: number,
  kolayGelsin: number,
  ptt: number,
  surat: number,
  yurtici: number,
  cevaTedarik: number,
  ceva: number,
  hepsiJetXl: number,
  horoz: number
): Row {
  return {
    aras,
    dhl,
    hepsiJet,
    kolayGelsin,
    ptt,
    surat,
    yurtici,
    cevaTedarik,
    ceva,
    hepsiJetXl,
    horoz,
  };
}

/** Desi/KG → KDV hariç ₺ (0–33 PDF satırlarına uyumlu) */
export const HEPSIBURADA_KARGO_EXCL_VAT: Record<number, Row> = {
  0: row(89.92, 100.99, 78.5, 100.91, 93.95, 97.55, 135.08, 465.0, 723.86, 675.51, 685.84),
  1: row(89.92, 100.99, 78.5, 100.91, 93.95, 97.55, 135.08, 465.0, 723.86, 675.51, 685.84),
  2: row(92.34, 100.99, 78.5, 100.91, 93.95, 97.55, 138.51, 465.0, 723.86, 675.51, 685.84),
  3: row(100.55, 110.99, 94.0, 111.65, 115.09, 110.05, 147.26, 465.0, 723.86, 675.51, 685.84),
  4: row(108.91, 126.99, 101.84, 123.47, 115.09, 120.0, 150.21, 465.0, 723.86, 675.51, 685.84),
  5: row(116.23, 137.99, 108.66, 133.15, 119.79, 125.99, 167.73, 465.0, 723.86, 675.51, 685.84),
  6: row(126.37, 153.99, 117.72, 143.89, 126.83, 138.57, 173.59, 465.0, 723.86, 675.51, 685.84),
  7: row(133.77, 162.99, 125.6, 153.57, 133.87, 147.83, 196.04, 465.0, 723.86, 675.51, 685.84),
  8: row(142.47, 172.99, 132.71, 164.31, 147.97, 157.24, 204.4, 465.0, 723.86, 675.51, 685.84),
  9: row(150.41, 182.99, 141.39, 173.98, 162.07, 166.64, 216.55, 465.0, 723.86, 675.51, 685.84),
  10: row(160.62, 192.99, 149.12, 185.81, 183.21, 175.9, 226.24, 465.0, 723.86, 675.51, 685.84),
  11: row(168.79, 203.99, 155.75, 196.55, 192.6, 187.76, 248.21, 465.0, 723.86, 675.51, 685.84),
  12: row(174.5, 214.99, 162.48, 208.37, 201.99, 195.66, 264.79, 465.0, 723.86, 675.51, 685.84),
  13: row(181.9, 224.99, 177.0, 219.12, 211.39, 203.56, 275.08, 465.0, 723.86, 675.51, 685.84),
  14: row(188.46, 234.99, 181.0, 230.94, 220.78, 211.47, 296.52, 465.0, 723.86, 675.51, 685.84),
  15: row(195.02, 249.99, 191.5, 242.76, 230.18, 219.23, 315.03, 465.0, 723.86, 675.51, 685.84),
  16: row(205.21, 286.99, 201.5, 254.58, 239.58, 227.41, 323.77, 465.0, 723.86, 675.51, 685.84),
  17: row(215.36, 301.99, 208.5, 266.41, 248.97, 239.4, 342.31, 465.0, 723.86, 675.51, 685.84),
  18: row(225.55, 321.99, 220.15, 278.23, 258.37, 251.39, 355.04, 465.0, 723.86, 675.51, 685.84),
  19: row(235.74, 346.99, 235.3, 290.05, 267.76, 263.51, 365.26, 465.0, 723.86, 675.51, 685.84),
  20: row(239.78, 364.99, 242.17, 301.87, 277.16, 275.5, 376.53, 465.0, 723.86, 675.51, 685.84),
  21: row(251.52, 378.99, 251.2, 313.69, 286.55, 287.9, 395.06, 465.0, 723.86, 675.51, 685.84),
  22: row(262.21, 386.99, 279.65, 325.51, 293.6, 298.94, 413.6, 465.0, 723.86, 675.51, 685.84),
  23: row(272.95, 413.99, 288.35, 337.34, 303.0, 309.98, 421.33, 465.0, 723.86, 675.51, 685.84),
  24: row(282.38, 440.99, 296.75, 349.16, 312.39, 321.01, 431.17, 465.0, 723.86, 675.51, 685.84),
  25: row(291.78, 467.99, 305.65, 360.98, 321.78, 332.05, 464.25, 465.0, 723.86, 675.51, 685.84),
  26: row(305.2, 494.99, 314.14, 372.8, 331.18, 342.68, 513.54, 465.0, 723.86, 675.51, 685.84),
  27: row(317.41, 521.99, 322.84, 384.62, 340.57, 353.44, 532.06, 465.0, 723.86, 675.51, 685.84),
  28: row(328.36, 548.99, 331.54, 396.44, 349.97, 364.07, 546.72, 465.0, 723.86, 675.51, 685.84),
  29: row(340.86, 575.99, 340.44, 408.26, 359.36, 374.7, 552.55, 465.0, 723.86, 675.51, 685.84),
  30: row(350.4, 602.99, 360.31, 420.08, 368.75, 385.32, 573.05, 465.0, 723.86, 675.51, 685.84),
  31: row(361.46, 638.98, 410.44, 431.34, 720.28, 460.95, 589.18, 480.5, 731.75, 675.51, 685.84),
  32: row(372.51, 674.97, 421.7, 442.6, 737.65, 474.3, 605.73, 496.0, 739.82, 675.51, 685.84),
  33: row(383.57, 710.96, 432.45, 453.86, 755.02, 487.79, 621.82, 511.5, 747.91, 675.51, 685.84),
};

export function getHepsiburadaKargoExclVat(
  desi: number,
  carrier: HepsiburadaCarrierId
): number | null {
  const d = Math.round(desi);
  const rowData = HEPSIBURADA_KARGO_EXCL_VAT[d];
  if (!rowData) return null;
  const v = rowData[carrier];
  return typeof v === "number" ? v : null;
}

/** PDF KDV hariç → formda kullanılan KDV dahil (+%20) */
export function hepsiburadaKargoToInclVat(excl: number): number {
  return Math.round(excl * 1.2 * 100) / 100;
}
