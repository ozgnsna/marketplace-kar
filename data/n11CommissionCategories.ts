/**
 * N11 komisyon kategorileri.
 *
 * Kaynak dosya: `data/n11-commission-source.tsv`
 * Üretilen JSON: `data/n11CommissionCategories.generated.json`
 * Kaynak sayfa: https://magazadestek.n11.com/s/komisyon-oranlari (21.08.2026 itibarıyla, 3719 kategori)
 *
 * Güncelleme akışı:
 * 1. TSV'yi düzenle (veya komisyon oranları sayfasından yeniden çek)
 * 2. `npm run generate:n11-commission` (package.json'a Hepsiburada scriptiyle
 *    aynı desende eklenmeli: `node scripts/build-n11-commission-from-tsv.mjs`)
 *
 * N11'e özgü: komisyon oranının yanında iki ayrı kesinti daha var —
 * marketingFeePercent (Pazarlama Hizmet Bedeli, çoğunlukla %1+KDV) ve sabit
 * marketplaceFeePercent (Pazaryeri Hizmet Bedeli, %0.67+KDV, tüm kategorilerde
 * aynı). payoutDays (hakediş süresi) kategoriye göre 5-24 iş günü arasında
 * değişir. Bu üç alan diğer platformlardaki commission satırlarında yok —
 * ProfitInputs / hesaplama motoruna nasıl yansıtılacağına (ör. hizmetBedeli
 * alanına toplanarak mı, yoksa ayrı bir satır olarak mı) karar verilmeli.
 */

import generated from "./n11CommissionCategories.generated.json";

export type N11CommissionCategoryRaw = {
  id: string;
  platform: "n11";
  mainCategory: string;
  subCategory: string;
  fullPath: string;
  keywords: string[];
  commissionRate: number;
  commissionLabel: string;
  /** Pazarlama Hizmet Bedeli Oranı (%) — KDV hariç, çoğunlukla 1 */
  marketingFeePercent: number;
  /** Pazaryeri Hizmet Bedeli (%) — KDV hariç, sabit 0.67 */
  marketplaceFeePercent: number;
  /** Hakediş Hesaplama Süresi (iş günü) */
  payoutDays: number | null;
};

export const N11_COMMISSION_CATEGORIES = generated as N11CommissionCategoryRaw[];
