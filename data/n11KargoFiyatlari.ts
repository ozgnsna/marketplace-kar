/**
 * N11 anlaşmalı kargo fiyatları (desi/kg başına, KDV ve Posta Hizmet Bedeli /
 * SMS gibi ek ücretler HARİÇ — kaynak sayfadaki not budur).
 *
 * Kaynak dosya: `data/n11-kargo-fiyatlari-source.tsv`
 * Üretilen JSON: `data/n11KargoFiyatlari.generated.json`
 * Kaynak sayfa: https://www.n11.com/kampanyalar/ozel-kargo-kampanyasi (21.08.2026)
 *
 * Güncelleme akışı:
 * 1. Kampanya sayfasındaki tabloyu TSV'ye yapıştır
 * 2. `npm run generate:n11-kargo` (package.json'a eklenmeli:
 *    `node scripts/build-n11-kargo-from-tsv.mjs`)
 *
 * Fiyatlar kümülatiftir, parça başına değildir: örn. 2 adet 5 desi'lik kargo
 * "5" kademesindeki fiyatın 2 katı olarak hesaplanır (PTT Kargo hariç — PTT
 * parça başına hesaplama yapıyor, kaynak sayfada ayrıca belirtiliyor).
 */

import generated from "./n11KargoFiyatlari.generated.json";

export type N11KargoCarrier = "aras" | "surat" | "ptt" | "yurtici" | "kolayGelsin" | "dhl";

export const N11_KARGO_CARRIER_LABELS: Record<N11KargoCarrier, string> = {
  aras: "Aras Kargo",
  surat: "Sürat Kargo",
  ptt: "PTT Kargo",
  yurtici: "Yurtiçi Kargo",
  kolayGelsin: "Kolay Gelsin",
  dhl: "DHL e-Commerce",
};

export type N11KargoFiyatRow = {
  /** "Dosya", "1".."100", ya da 100 üzeri birim fiyatı için "+" */
  tier: string;
} & Record<N11KargoCarrier, number | null>;

export const N11_KARGO_FIYATLARI = generated as N11KargoFiyatRow[];

/**
 * Verilen desi/kg değeri (0 = evrak/Dosya) ve kargo firması için tahmini
 * gönderim ücretini döner. 100'ün üzerindeki değerler için "+" satırındaki
 * birim fiyat, 100 kademesinin fiyatına eklenerek hesaplanır.
 */
export function calculateN11ShippingFee(
  desiKg: number,
  carrier: N11KargoCarrier
): number | null {
  if (desiKg <= 0) {
    const row = N11_KARGO_FIYATLARI.find((r) => r.tier === "Dosya");
    return row?.[carrier] ?? null;
  }

  const tierStr = String(Math.ceil(desiKg));
  const exact = N11_KARGO_FIYATLARI.find((r) => r.tier === tierStr);
  if (exact) return exact[carrier] ?? null;

  if (desiKg > 100) {
    const base = N11_KARGO_FIYATLARI.find((r) => r.tier === "100");
    const perExtra = N11_KARGO_FIYATLARI.find((r) => r.tier === "+");
    const baseVal = base?.[carrier];
    const extraVal = perExtra?.[carrier];
    if (baseVal == null || extraVal == null) return null;
    return baseVal + extraVal * (Math.ceil(desiKg) - 100);
  }

  return null;
}
