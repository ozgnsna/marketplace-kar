/**
 * PttAVM komisyon kategorileri.
 *
 * Kaynak dosya: `data/pttavm-commission-source.tsv`
 * Üretilen JSON: `data/pttavmCommissionCategories.generated.json`
 * Kaynak: PttAVM Tedarikçi Platformu → Hesap Yönetimi → "Güncel Komisyonlar"
 * (merchant.pttavm.com, satıcı girişi gerektirir) — indirilen "PttAVM
 * Kategori Bazlı Komisyon Listesi" PDF'i, 21.08.2026 itibarıyla (5034 kategori,
 * 2-7 seviye arası değişen bir ağaç).
 *
 * Güncelleme akışı:
 * 1. Tedarikçi panelinden PDF'i yeniden indir, TSV'yi güncelle (ya da tabloyu
 *    elle düzenle)
 * 2. `npm run generate:pttavm-commission` (package.json'a eklenmeli:
 *    `node scripts/build-pttavm-commission-from-tsv.mjs`)
 *
 * PttAVM'e özgü: diğer platformlardan farklı olarak SADECE yaprak
 * kategorilerin değil, ağaçtaki HER seviyenin kendi komisyon oranı var (ör.
 * "Elektronik" kendi başına %25, altındaki "Bilgisayar & Tablet" %20, onun
 * altındaki daha spesifik kategoriler kendi oranlarını taşıyor). Bir ürün en
 * spesifik kategoriye mi yoksa genel kategoriye mi atanacak, seçime bağlı.
 */

import generated from "./pttavmCommissionCategories.generated.json";

export type PttavmCommissionCategoryRaw = {
  id: string;
  platform: "pttavm";
  mainCategory: string;
  subCategory: string;
  fullPath: string;
  keywords: string[];
  commissionRate: number;
  commissionLabel: string;
};

export const PTTAVM_COMMISSION_CATEGORIES = generated as PttavmCommissionCategoryRaw[];
