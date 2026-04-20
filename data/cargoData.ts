import type { MarketplacePlatform } from "@/types/profit";

/**
 * Kargo: desi → KDV dahil ₺ (örnek / placeholder).
 * Trendyol anlaşmalı fiyatlar: lib/trendyolKargo.ts (PDF tablosu).
 * Hepsiburada: aşağıdaki tablolar güncellenecek.
 * TODO: Hepsiburada gerçek anlaşmalı kargo tabloları buraya işlenecek.
 */
export type CargoCarrierTables = Record<string, Record<number, number>>;

export const cargoData: Record<MarketplacePlatform, CargoCarrierTables> = {
  trendyol: {
    /** UI’da “ortalama” etiketi; gerçek değer getCargoPrice() içinde hesaplanır */
    average: {},
  },
  hepsiburada: {
    average: {
      1: 95,
      2: 95,
      3: 110,
      4: 120,
      5: 130,
    },
    aras: { 1: 92, 2: 92, 3: 108, 4: 118, 5: 128 },
    dhl: { 1: 100, 2: 102, 3: 115, 4: 125, 5: 135 },
    hepsiJet: { 1: 88, 2: 90, 3: 105, 4: 115, 5: 125 },
    kolayGelsin: { 1: 94, 2: 96, 3: 110, 4: 120, 5: 130 },
    ptt: { 1: 85, 2: 87, 3: 100, 4: 110, 5: 120 },
    surat: { 1: 90, 2: 92, 3: 106, 4: 116, 5: 126 },
    yurtici: { 1: 98, 2: 100, 3: 114, 4: 124, 5: 134 },
  },
};
