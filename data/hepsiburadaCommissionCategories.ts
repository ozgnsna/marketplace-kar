/**
 * Hepsiburada komisyon kategorileri.
 *
 * Kaynak dosya: `data/hepsiburada-commission-source.tsv`
 * Üretilen JSON: `data/hepsiburadaCommissionCategories.generated.json`
 *
 * Güncelleme akışı:
 * 1. TSV’yi düzenle
 * 2. `npm run generate:hepsiburada-commission`
 *
 * Mevcut TS dizisini TSV’ye aktarmak için (bir kerelik veya senkron):
 * `npm run export:hepsiburada-commission-tsv`
 */

import generated from "./hepsiburadaCommissionCategories.generated.json";

export type HbCommissionCategoryRaw = {
  id: string;
  platform: "hepsiburada";
  fullPath: string;
  commissionRate: number;
  commissionLabel: string;
};

export const HB_COMMISSION_CATEGORIES = generated as HbCommissionCategoryRaw[];
