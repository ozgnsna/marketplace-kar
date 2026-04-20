import type { MarketplacePlatform } from "@/types/profit";
import generated from "./commissionCategories.generated.json";
import {
  HB_COMMISSION_CATEGORIES,
  type HbCommissionCategoryRaw,
} from "./hepsiburadaCommissionCategories";

/**
 * Komisyon kategorileri:
 * - Trendyol: `commissionCategories.generated.json` (`npm run generate:commission`, PDF).
 * - Hepsiburada: `hepsiburadaCommissionCategories.ts` (temiz, elle düzenlenen liste).
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
        .split(/[,>&]|\s+/)
        .map((x) => x.trim().toLocaleLowerCase("tr-TR"))
        .filter((w) => w.length > 1)
    ),
  ].slice(0, 45);
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

export const COMMISSION_CATEGORIES: Record<MarketplacePlatform, CommissionCategoryRow[]> = {
  trendyol: ty,
  hepsiburada: hb,
};

const BY_ID = new Map<string, CommissionCategoryRow>();
for (const row of ty) {
  BY_ID.set(row.id, row);
}
for (const row of hb) {
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
