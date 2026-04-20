import { NextResponse } from "next/server";
import { calculateProfit } from "@/lib/calculateProfit";
import type { ProfitInputs } from "@/types/profit";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseInputs(body: unknown): ProfitInputs | null {
  if (!isRecord(body)) return null;

  const platform = body.platform === "hepsiburada" ? "hepsiburada" : "trendyol";
  const commissionCategoryId =
    typeof body.commissionCategoryId === "string" ? body.commissionCategoryId : "";
  const calculationMode =
    body.calculationMode === "cashflow" ? "cashflow" : "sheet";
  const feePercentBase =
    body.feePercentBase === "listPrice" ? "listPrice" : "discountedPrice";

  const num = (key: string): number | null => {
    const v = body[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const optNum = (key: string, fallback: number): number => {
    const v = num(key);
    return v !== null ? v : fallback;
  };

  const purchasePrice = num("purchasePrice");
  const salePrice = num("salePrice");
  const commissionRate = num("commissionRate");
  const kargo = num("kargo");
  const paketleme = num("paketleme");
  const hizmetBedeli = num("hizmetBedeli");
  const stopajRate = num("stopajRate");
  const discountRate = num("discountRate");
  const returnRate = num("returnRate");

  if (
    purchasePrice === null ||
    salePrice === null ||
    commissionRate === null ||
    kargo === null ||
    paketleme === null ||
    hizmetBedeli === null ||
    stopajRate === null ||
    discountRate === null ||
    returnRate === null
  ) {
    return null;
  }

  const fourForThree = Boolean(body.fourForThree);
  const customerPaysShipping = Boolean(body.customerPaysShipping);

  return {
    platform,
    commissionCategoryId,
    calculationMode,
    feePercentBase,
    purchasePrice,
    salePrice,
    commissionRate,
    kargo,
    paketleme,
    hizmetBedeli,
    stopajRate,
    advertisingRate: optNum("advertisingRate", 0),
    paymentFeeRate: optNum("paymentFeeRate", 0),
    otherFixed: optNum("otherFixed", 0),
    listingFee: optNum("listingFee", 0),
    warehouseShippingFee: optNum("warehouseShippingFee", 0),
    customerPaysShipping,
    discountRate,
    fourForThree,
    returnRate,
    vatRate: optNum("vatRate", 20),
  };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON gövdesi" }, { status: 400 });
  }

  const inputs = parseInputs(json);
  if (!inputs) {
    return NextResponse.json(
      { error: "Eksik veya geçersiz alanlar" },
      { status: 422 }
    );
  }

  const result = calculateProfit(inputs);
  return NextResponse.json({ inputs, result });
}
