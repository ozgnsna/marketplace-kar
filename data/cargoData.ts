import type { MarketplacePlatform } from "@/types/profit";

/**
 * Kargo: desi → KDV dahil ₺.
 * Trendyol / Hepsiburada: lib/*Kargo.ts
 * Shopier: anlaşmalı tablo yok; kargo elle girilir.
 */
export type CargoCarrierTables = Record<string, Record<number, number>>;

export const cargoData: Record<MarketplacePlatform, CargoCarrierTables> = {
  trendyol: {
    average: {},
  },
  hepsiburada: {
    average: {},
  },
  shopier: {
    average: {},
  },
};
