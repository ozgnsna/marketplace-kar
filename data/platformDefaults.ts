import type { MarketplacePlatform } from "@/types/profit";

/** Sabit ₺ ve % oranları — formda otomatik doldurma için başlangıç profili */
export type PlatformDefaultProfile = {
  serviceFee: number;
  packaging: number;
  stopajRate: number;
  paymentFeeRate: number;
  advertisingRate: number;
  listingFee: number;
  warehouseShippingFee: number;
  otherFixed: number;
};

/** Platform varsayılan gider profili (panel / sözleşmeye göre güncellenir). */
export const platformDefaults: Record<MarketplacePlatform, PlatformDefaultProfile> = {
  trendyol: {
    /** Sipariş bazlı platform hizmet bedeli */
    serviceFee: 13.19,
    packaging: 0,
    stopajRate: 1,
    paymentFeeRate: 1.2,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
  hepsiburada: {
    serviceFee: 12.6,
    packaging: 2.5,
    stopajRate: 1,
    paymentFeeRate: 1.5,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
  shopier: {
    /** 0,49 TL işlem bedeli + %20 KDV */
    serviceFee: 0.59,
    packaging: 0,
    stopajRate: 1,
    /** Shopier işlem ücretine dahil; ayrı tahsilat oranı yok */
    paymentFeeRate: 0,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
  n11: {
    serviceFee: 0,
    packaging: 0,
    stopajRate: 1,
    /** Pazaryeri Hizmet Bedeli %0,67 + KDV → formda KDV dahil */
    paymentFeeRate: Math.round(0.67 * 1.2 * 1000) / 1000,
    /** Pazarlama Hizmet Bedeli varsayılan %1 + KDV (kategori seçince güncellenir) */
    advertisingRate: Math.round(1 * 1.2 * 1000) / 1000,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
  pttavm: {
    serviceFee: 0,
    packaging: 0,
    stopajRate: 1,
    paymentFeeRate: 1.2,
    advertisingRate: 0,
    listingFee: 0,
    warehouseShippingFee: 0,
    otherFixed: 0,
  },
};
