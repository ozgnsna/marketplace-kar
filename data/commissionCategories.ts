import type { MarketplacePlatform } from "@/types/profit";
import generated from "./commissionCategories.generated.json";
import {
  HB_COMMISSION_CATEGORIES,
  type HbCommissionCategoryRaw,
} from "./hepsiburadaCommissionCategories";
import { SHOPIER_COMMISSION_CATEGORIES } from "./shopierCommissionTiers";

/**
 * Komisyon kategorileri:
 * - Trendyol: `trendyol-commission-source.tsv` → `commissionCategories.generated.json`
 * - Hepsiburada: `hepsiburada-commission-source.tsv` → `hepsiburadaCommissionCategories.generated.json`
 * - Shopier: `shopierCommissionTiers.ts` (aylık ciro dilimleri; kategori komisyonu yok)
 */

export type CommissionCategoryRow = {
  id: string;
  platform: MarketplacePlatform;
  mainCategory: string;
  subCategory: string;
  fullPath: string;
  keywords: string[];
  commissionRate: number;
  commissionLabel?: string;
};

function keywordsFromHbPath(fullPath: string): string[] {
  return [
    ...new Set(
      fullPath
        .split(/[,>&/|]+|\s+/)
        .map((x) => x.trim().toLocaleLowerCase("tr-TR"))
        .filter((w) => w.length > 1 && !["ve", "veya", "ile", "icin", "için"].includes(w))
    ),
  ].slice(0, 100);
}

function mapHbRawToRow(raw: HbCommissionCategoryRaw): CommissionCategoryRow {
  const parts = raw.fullPath
    .split(/\s*>\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const mainCategory = parts[0] ?? "";
  const subCategory = parts.length > 1 ? parts[parts.length - 1]! : mainCategory;
  return {
    id: raw.id,
    platform: "hepsiburada",
    mainCategory,
    subCategory,
    fullPath: raw.fullPath,
    keywords: keywordsFromHbPath(raw.fullPath),
    commissionRate: raw.commissionRate,
    commissionLabel: raw.commissionLabel,
  };
}

const ty = generated.trendyol as CommissionCategoryRow[];
const hb = HB_COMMISSION_CATEGORIES.map(mapHbRawToRow);
const shopier = SHOPIER_COMMISSION_CATEGORIES as CommissionCategoryRow[];

export const COMMISSION_CATEGORIES: Record<MarketplacePlatform, CommissionCategoryRow[]> = {
  trendyol: ty,
  hepsiburada: hb,
  shopier,
};

const BY_ID = new Map<string, CommissionCategoryRow>();
for (const row of [...ty, ...hb, ...shopier]) {
  BY_ID.set(row.id, row);
}

export function getCategoriesForPlatform(platform: MarketplacePlatform): CommissionCategoryRow[] {
  return COMMISSION_CATEGORIES[platform];
}

export function findCommissionCategory(
  platform: MarketplacePlatform,
  id: string
): CommissionCategoryRow | undefined {
  const row = BY_ID.get(id.trim());
  if (!row || row.platform !== platform) return undefined;
  return row;
}
