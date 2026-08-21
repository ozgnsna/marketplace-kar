/**
 * N11 anlaşmalı kargo (Özel Kargo Kampanyası, 21.08.2026).
 * Kaynak tutarlar KDV / posta hizmet bedeli / SMS hariçtir → formda × 1,20.
 */

import {
  calculateN11ShippingFee,
  N11_KARGO_CARRIER_LABELS,
  type N11KargoCarrier,
} from "@/data/n11KargoFiyatlari";

export const N11_CARGO_NOTE =
  "Kaynak: n11 Özel Kargo Kampanyası (21 Ağustos 2026). Tablo KDV, posta hizmet bedeli ve SMS hariçtir; kargo alanına KDV dahil yazılır.";

export const N11_CARGO_CARRIERS = (
  Object.keys(N11_KARGO_CARRIER_LABELS) as N11KargoCarrier[]
).map((id) => ({ id, label: N11_KARGO_CARRIER_LABELS[id] }));

export type N11CarrierId = N11KargoCarrier;

const AVG_CARRIERS: N11KargoCarrier[] = [
  "aras",
  "surat",
  "ptt",
  "yurtici",
  "kolayGelsin",
  "dhl",
];

/** PDF/kampanya KDV hariç → formda KDV dahil (+%20) */
export function n11KargoToInclVat(excl: number): number {
  return Math.round(excl * 1.2 * 100) / 100;
}

export function getN11KargoExclVat(desi: number, carrier: N11CarrierId): number | null {
  return calculateN11ShippingFee(desi, carrier);
}

export function n11AverageKargoInclVat(desi: number): number | null {
  const vals: number[] = [];
  for (const c of AVG_CARRIERS) {
    const ex = getN11KargoExclVat(desi, c);
    if (ex != null) vals.push(n11KargoToInclVat(ex));
  }
  if (vals.length === 0) return null;
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 100) / 100;
}
