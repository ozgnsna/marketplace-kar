import type { ProfitInputs } from "@/types/profit";

function clampNumber(value: number, fallback = 0): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return fallback;
  return value;
}

export interface RequiredListPriceResult {
  listPrice: number;
  effectiveSalePrice: number;
}

function fixedOperating(inputs: ProfitInputs): number {
  const kargoInput = Math.max(0, clampNumber(inputs.kargo));
  const kargo = inputs.customerPaysShipping ? 0 : kargoInput;
  const paketleme = Math.max(0, clampNumber(inputs.paketleme));
  const hizmetBedeli = Math.max(0, clampNumber(inputs.hizmetBedeli));
  const otherFixed = Math.max(0, clampNumber(inputs.otherFixed));
  const listingFee = Math.max(0, clampNumber(inputs.listingFee));
  const warehouseShippingFee = Math.max(0, clampNumber(inputs.warehouseShippingFee));
  return kargo + paketleme + hizmetBedeli + otherFixed + listingFee + warehouseShippingFee;
}

/**
 * E-tablo modu: L*(1-R) - purchase - fixed = T
 * R = komisyon+stopaj+tahsilat+reklam+iade/risk (hepsi liste üzerinden)
 */
export function requiredListPriceSheet(
  inputs: ProfitInputs,
  targetNetProfit: number
): RequiredListPriceResult | null {
  const T = clampNumber(targetNetProfit);
  const purchasePrice = Math.max(0, clampNumber(inputs.purchasePrice));
  const fixedOps = fixedOperating(inputs);

  const commissionRate = Math.max(0, clampNumber(inputs.commissionRate));
  const stopajRate = Math.max(0, clampNumber(inputs.stopajRate));
  const advertisingRate = Math.max(0, clampNumber(inputs.advertisingRate));
  const paymentFeeRate = Math.max(0, clampNumber(inputs.paymentFeeRate));
  const returnRate = Math.min(100, Math.max(0, clampNumber(inputs.returnRate)));

  const R =
    (commissionRate + stopajRate + advertisingRate + paymentFeeRate + returnRate) /
    100;

  if (R >= 1) return null;

  const L = (T + purchasePrice + fixedOps) / (1 - R);

  if (!Number.isFinite(L) || L < 0) return null;

  return {
    listPrice: L,
    effectiveSalePrice: L,
  };
}

/** Hedef: maliyet üzerinden % net kâr */
export function requiredListPriceForMarginOnCost(
  inputs: ProfitInputs,
  marginOnCostPercent: number
): RequiredListPriceResult | null {
  const purchasePrice = Math.max(0, clampNumber(inputs.purchasePrice));
  const m = Math.max(0, clampNumber(marginOnCostPercent));
  const targetNet = purchasePrice * (m / 100);
  return requiredListPriceSheet(inputs, targetNet);
}

/**
 * Cashflow: % kesintiler efektif satış üzerinden (eski ters formül).
 */
export function requiredListPriceCashflow(
  inputs: ProfitInputs,
  targetNetProfit: number
): RequiredListPriceResult | null {
  const T = clampNumber(targetNetProfit);
  const purchasePrice = Math.max(0, clampNumber(inputs.purchasePrice));
  const kargoInput = Math.max(0, clampNumber(inputs.kargo));
  const kargo = inputs.customerPaysShipping ? 0 : kargoInput;
  const paketleme = Math.max(0, clampNumber(inputs.paketleme));
  const hizmetBedeli = Math.max(0, clampNumber(inputs.hizmetBedeli));
  const otherFixed = Math.max(0, clampNumber(inputs.otherFixed));

  const listingFee = Math.max(0, clampNumber(inputs.listingFee));
  const warehouseShippingFee = Math.max(0, clampNumber(inputs.warehouseShippingFee));
  const fixed =
    purchasePrice +
    kargo +
    paketleme +
    hizmetBedeli +
    otherFixed +
    listingFee +
    warehouseShippingFee;

  const commissionRate = Math.max(0, clampNumber(inputs.commissionRate));
  const stopajRate = Math.max(0, clampNumber(inputs.stopajRate));
  const advertisingRate = Math.max(0, clampNumber(inputs.advertisingRate));
  const paymentFeeRate = Math.max(0, clampNumber(inputs.paymentFeeRate));

  const R =
    (commissionRate + stopajRate + advertisingRate + paymentFeeRate) / 100;

  if (R >= 1) return null;

  const returnRate = Math.min(100, Math.max(0, clampNumber(inputs.returnRate)));
  const ret = returnRate / 100;
  if (ret >= 1) return null;

  const discountRate = Math.max(0, clampNumber(inputs.discountRate));
  const discountFactor = 1 - discountRate / 100;
  const fourFactor = inputs.fourForThree ? 0.75 : 1;
  const listToEffective = discountFactor * fourFactor;

  if (listToEffective <= 0) return null;

  const netBeforeReturns = T / (1 - ret);
  const E = (netBeforeReturns + fixed) / (1 - R);
  const listPrice = E / listToEffective;

  if (!Number.isFinite(listPrice) || listPrice < 0) return null;

  const priceAfterDiscount =
    discountRate > 0 ? listPrice * (1 - discountRate / 100) : listPrice;
  const effectiveSalePrice = inputs.fourForThree
    ? priceAfterDiscount * 0.75
    : priceAfterDiscount;

  return {
    listPrice,
    effectiveSalePrice,
  };
}

export function requiredListPriceForTargetNet(
  inputs: ProfitInputs,
  targetNetProfit: number
): RequiredListPriceResult | null {
  if (inputs.calculationMode === "sheet") {
    return requiredListPriceSheet(inputs, targetNetProfit);
  }
  return requiredListPriceCashflow(inputs, targetNetProfit);
}
