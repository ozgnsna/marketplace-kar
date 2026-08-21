/**
 * PttAVM anlaşmalı kargo fiyatları (desi/kg başına).
 *
 * Kaynak dosya: `data/pttavm-kargo-fiyatlari-source.tsv`
 * Üretilen JSON: `data/pttavmKargoFiyatlari.generated.json`
 * Kaynak: PttAVM Tedarikçi Platformu → Hesap Yönetimi → Entegrasyon Bilgileri
 * (merchant.pttavm.com/account-management/integration-information, satıcı
 * girişi gerektirir) — "PttAVM Kargo Fiyatları" PDF'i, 21.08.2026 itibarıyla.
 *
 * N11'den farklı olarak PttAVM'in kargo tablosu tek bir taşıyıcı firma
 * içindir (PttAVM lojistiği) — kademe başına birden çok firma sütunu yok.
 *
 * 0-100 kg/desi aralığı kaynak PDF'ten (sayfa 1-2) doğrudan transkribe
 * edildi. 101-1000 aralığı, PDF'in taranmış/görüntü tabanlı sayfalarından
 * (metin katmanı yok) örneklenen noktalarla doğrulanmış iki doğrusal
 * formülle üretildi — bkz. `scripts/build-pttavm-kargo-from-tsv.mjs` başındaki
 * not (satır 300 ve 642'deki kaynak-PDF anomalileri dahil).
 *
 * Güncelleme akışı:
 * 1. Tedarikçi panelinden PDF'i yeniden indir, TSV'yi güncelle
 * 2. `npm run generate:pttavm-kargo` (package.json'a eklenmeli:
 *    `node scripts/build-pttavm-kargo-from-tsv.mjs`)
 */

import generated from "./pttavmKargoFiyatlari.generated.json";

export type PttavmKargoFiyatRow = {
  /** Kaynak PDF'teki kademe etiketi, ör. "1,01-2 Kg/Desi" ya da "101.0" */
  tier: string;
  /** Kademenin kg cinsinden alt sınırı (dahil) */
  minKg: number;
  /** Kademenin kg cinsinden üst sınırı (dahil) */
  maxKg: number;
  /** TL cinsinden fiyat (KDV vb. ek ücretler hariç olabilir, kaynağa bakınız) */
  price: number;
};

export const PTTAVM_KARGO_FIYATLARI = generated as PttavmKargoFiyatRow[];

/**
 * Verilen desi/kg değeri için PttAVM anlaşmalı kargo ücretini döner.
 * Tablo 0 ile 1000 desi/kg arasını kapsar; 1000'in üzerindeki değerler
 * için kaynak PDF'te veri yok, `null` döner (formülü elle dışa
 * ekstrapole etmek istenirse segment B'nin eğimi 8.25 TL/desi'dir).
 */
export function calculatePttavmShippingFee(desiKg: number): number | null {
  if (!Number.isFinite(desiKg) || desiKg < 0) return null;
  if (desiKg > 1000) return null;

  const row = PTTAVM_KARGO_FIYATLARI.find((r) => desiKg <= r.maxKg && desiKg >= r.minKg);
  if (row) return row.price;

  // Kademeler arası (ör. tam sayı olmayan 101.4 gibi bir desi değeri, 101-1000
  // bandında) — bir üst tam kademeye yuvarlayarak en yakın satırı bul.
  const rounded = Math.ceil(desiKg);
  const ceilRow = PTTAVM_KARGO_FIYATLARI.find((r) => r.minKg === rounded && r.maxKg === rounded);
  return ceilRow?.price ?? null;
}
