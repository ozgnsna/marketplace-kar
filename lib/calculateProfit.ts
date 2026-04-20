import type { ProfitInputs, ProfitResult, VatDetailEstimate } from "@/types/profit";
import { vatFromGross } from "@/lib/vatFromGross";

function clampNumber(value: number, fallback = 0): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return fallback;
  return value;
}

function buildVatDetail(
  inputs: ProfitInputs,
  salePrice: number,
  purchasePrice: number,
  kargo: number,
  commission: number
): VatDetailEstimate | undefined {
  const vatRate = Math.max(0, clampNumber(inputs.vatRate));
  if (vatRate <= 0) return undefined;

  const saleVat = vatFromGross(salePrice, vatRate);
  const purchaseVat = vatFromGross(purchasePrice, vatRate);
  const shippingVat = vatFromGross(kargo, vatRate);
  const commissionVat = vatFromGross(commission, vatRate);

  const netVatPositionEstimate = saleVat - purchaseVat - shippingVat;

  return {
    vatRate,
    saleVat,
    purchaseVat,
    shippingVat,
    commissionVat,
    netVatPositionEstimate,
  };
}

function roiAndMargin(netProfit: number, purchasePrice: number, saleBase: number) {
  const marginOnCostPercent =
    purchasePrice > 0 ? (netProfit / purchasePrice) * 100 : 0;
  const profitMarginPercent = saleBase > 0 ? (netProfit / saleBase) * 100 : 0;
  const roiOnCostPercent = marginOnCostPercent;
  return { profitMarginPercent, marginOnCostPercent, roiOnCostPercent };
}

export function calculateProfit(inputs: ProfitInputs): ProfitResult {
  const salePrice = Math.max(0, clampNumber(inputs.salePrice));
  const discountRate = Math.max(0, clampNumber(inputs.discountRate));
  const priceAfterDiscount =
    discountRate > 0 ? salePrice * (1 - discountRate / 100) : salePrice;

  const customerPriceAfterDiscount = priceAfterDiscount;

  const effectiveSalePrice = inputs.fourForThree
    ? priceAfterDiscount * 0.75
    : priceAfterDiscount;

  const commissionRate = Math.max(0, clampNumber(inputs.commissionRate));
  const stopajRate = Math.max(0, clampNumber(inputs.stopajRate));
  const advertisingRate = Math.max(0, clampNumber(inputs.advertisingRate));
  const paymentFeeRate = Math.max(0, clampNumber(inputs.paymentFeeRate));
  const returnRate = Math.min(100, Math.max(0, clampNumber(inputs.returnRate)));

  const purchasePrice = Math.max(0, clampNumber(inputs.purchasePrice));
  const kargoInput = Math.max(0, clampNumber(inputs.kargo));
  const kargo = inputs.customerPaysShipping ? 0 : kargoInput;
  const paketleme = Math.max(0, clampNumber(inputs.paketleme));
  const hizmetBedeli = Math.max(0, clampNumber(inputs.hizmetBedeli));
  const otherFixed = Math.max(0, clampNumber(inputs.otherFixed));
  const listingFee = Math.max(0, clampNumber(inputs.listingFee));
  const warehouseShippingFee = Math.max(0, clampNumber(inputs.warehouseShippingFee));

  const kargoLabel = inputs.customerPaysShipping
    ? "Kargo (müşteri ödüyor)"
    : "Kargo bedeli";

  if (inputs.calculationMode === "sheet") {
    const baseForFees = salePrice;
    const commission = baseForFees * (commissionRate / 100);
    const stopaj = baseForFees * (stopajRate / 100);
    const advertising = baseForFees * (advertisingRate / 100);
    const paymentFee = baseForFees * (paymentFeeRate / 100);
    const returnRiskAmount = salePrice * (returnRate / 100);

    const operatingDeductions =
      commission +
      stopaj +
      advertising +
      paymentFee +
      hizmetBedeli +
      kargo +
      paketleme +
      otherFixed +
      listingFee +
      warehouseShippingFee +
      returnRiskAmount;

    const netCollection = salePrice - operatingDeductions;
    const netProfit = netCollection - purchasePrice;

    const breakdown = [
      { label: "Komisyon tutarı", amount: commission },
      { label: "Tahsilat yönetim bedeli", amount: paymentFee },
      { label: "MP stopaj", amount: stopaj },
      ...(advertising > 0 ? [{ label: "Reklam / görünürlük", amount: advertising }] : []),
      { label: "Hizmet bedeli", amount: hizmetBedeli },
      { label: kargoLabel, amount: kargo },
      { label: "Paketleme", amount: paketleme },
      ...(listingFee > 0 ? [{ label: "Listeleme / vitrin bedeli", amount: listingFee }] : []),
      ...(warehouseShippingFee > 0
        ? [{ label: "Depoya gönderim", amount: warehouseShippingFee }]
        : []),
      ...(otherFixed > 0 ? [{ label: "Diğer sabit", amount: otherFixed }] : []),
      { label: "İade / risk payı (liste üzerinden)", amount: returnRiskAmount },
      { label: "Alış (KDV dahil)", amount: purchasePrice },
    ];

    const totalExpenses = breakdown.reduce((s, r) => s + r.amount, 0);

    const { profitMarginPercent, marginOnCostPercent, roiOnCostPercent } = roiAndMargin(
      netProfit,
      purchasePrice,
      salePrice
    );

    const vatDetail = buildVatDetail(inputs, salePrice, purchasePrice, kargo, commission);

    return {
      calculationMode: "sheet",
      listPrice: salePrice,
      customerPriceAfterDiscount,
      netCollection,
      effectiveSalePrice: salePrice,
      priceAfterDiscount,
      commission,
      stopaj,
      advertising,
      paymentFee,
      returnRiskAmount,
      totalExpenses,
      breakdown,
      profitBeforeReturns: netProfit,
      netProfit,
      profitMarginPercent,
      marginOnCostPercent,
      roiOnCostPercent,
      vatDetail,
      isLoss: netProfit < 0,
    };
  }

  const baseForFees =
    inputs.feePercentBase === "listPrice" ? salePrice : effectiveSalePrice;

  const commission = baseForFees * (commissionRate / 100);
  const stopaj = baseForFees * (stopajRate / 100);
  const advertising = baseForFees * (advertisingRate / 100);
  const paymentFee = baseForFees * (paymentFeeRate / 100);

  const breakdownCore = [
    { label: "Alış fiyatı (KDV dahil)", amount: purchasePrice },
    { label: "Komisyon", amount: commission },
    { label: "Tahsilat yönetim / işlem", amount: paymentFee },
    { label: "Stopaj", amount: stopaj },
    { label: "Reklam / görünürlük", amount: advertising },
    { label: kargoLabel, amount: kargo },
    { label: "Paketleme", amount: paketleme },
    ...(listingFee > 0 ? [{ label: "Listeleme / vitrin", amount: listingFee }] : []),
    ...(warehouseShippingFee > 0
      ? [{ label: "Depoya gönderim", amount: warehouseShippingFee }]
      : []),
    { label: "Hizmet bedeli", amount: hizmetBedeli },
    { label: "Diğer sabit giderler", amount: otherFixed },
  ];

  const totalExpensesCore = breakdownCore.reduce((s, r) => s + r.amount, 0);
  const profitBeforeReturns = effectiveSalePrice - totalExpensesCore;
  const netProfit = profitBeforeReturns * (1 - returnRate / 100);

  const { profitMarginPercent, marginOnCostPercent, roiOnCostPercent } = roiAndMargin(
    netProfit,
    purchasePrice,
    effectiveSalePrice
  );

  const vatDetail = buildVatDetail(
    inputs,
    effectiveSalePrice,
    purchasePrice,
    kargo,
    commission
  );

  return {
    calculationMode: "cashflow",
    listPrice: salePrice,
    customerPriceAfterDiscount,
    netCollection: undefined,
    effectiveSalePrice,
    priceAfterDiscount,
    commission,
    stopaj,
    advertising,
    paymentFee,
    returnRiskAmount: effectiveSalePrice * (returnRate / 100),
    totalExpenses: totalExpensesCore,
    breakdown: breakdownCore,
    profitBeforeReturns,
    netProfit,
    profitMarginPercent,
    marginOnCostPercent,
    roiOnCostPercent,
    vatDetail,
    isLoss: netProfit < 0,
  };
}
