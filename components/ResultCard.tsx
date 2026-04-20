"use client";

import { useMemo } from "react";
import { enrichBreakdown, sourceLabel, type EnrichedBreakdownRow } from "@/lib/enrichBreakdown";
import type { MarketplacePlatform, ProfitInputs, ProfitResult } from "@/types/profit";
import { getProfitStatus } from "@/lib/getProfitStatus";

const PLATFORM_LABEL: Record<MarketplacePlatform, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
};

const tryCurrency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const tryWhole = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

const pct = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

function buildShareText(salePrice: number, netProfit: number): string {
  const p = tryWhole.format(salePrice);
  if (netProfit >= 0) {
    const n = tryWhole.format(netProfit);
    return `${p}₺'ye sattığım ürün bana aslında ₺${n} kazandırıyor.`;
  }
  const loss = tryWhole.format(Math.abs(netProfit));
  return `${p}₺'ye sattığım ürün bu koşullarda bana ₺${loss} zarar yazıyor.`;
}

interface ResultCardProps {
  platform: MarketplacePlatform;
  result: ProfitResult;
  inputs: ProfitInputs;
  /** Satış ve maliyet girildiğinde anlamlı sonuç */
  hasCalculation?: boolean;
  /** Hesap detayı satırları — açıklama ve kaynak etiketi */
  breakdownEnriched?: EnrichedBreakdownRow[];
}

export function ResultCard({
  platform,
  result,
  inputs,
  hasCalculation = true,
  breakdownEnriched,
}: ResultCardProps) {
  const {
    netProfit,
    profitMarginPercent,
    marginOnCostPercent,
    roiOnCostPercent,
    effectiveSalePrice,
    calculationMode,
    netCollection,
    listPrice,
    customerPriceAfterDiscount,
    vatDetail,
    totalExpenses,
  } = result;

  const sheet = calculationMode === "sheet";

  const breakdownRows = useMemo(
    () => breakdownEnriched ?? enrichBreakdown(result, {}),
    [breakdownEnriched, result]
  );

  const revenueLabel = sheet ? "Net tahsilat" : "Efektif satış";
  const revenueAmount =
    sheet && netCollection !== undefined ? netCollection : effectiveSalePrice;

  const profitInsight = useMemo(
    () =>
      getProfitStatus({
        netProfit,
        profitMarginPercent,
      }),
    [netProfit, profitMarginPercent]
  );

  const statusStyles =
    profitInsight.status === "zarar"
      ? "bg-red-50 text-red-800 ring-1 ring-red-200/90"
      : profitInsight.status === "dusuk_kar"
        ? "bg-amber-50 text-amber-950 ring-1 ring-amber-200/90"
        : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/90";

  function handleSave() {
    console.log("Bu kârı kaydet", {
      platform,
      inputs,
      result,
      profitInsight: profitInsight.status,
      savedAt: new Date().toISOString(),
    });
  }

  function handleShare() {
    const text = buildShareText(inputs.salePrice, netProfit);
    console.log("Bu hesabı paylaş", text);
    if (typeof window !== "undefined") {
      window.alert(text);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-premium-lg sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sonuç</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {PLATFORM_LABEL[platform]}
        </span>
      </div>

      {!hasCalculation ? (
        <p
          className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-8 text-center text-sm leading-relaxed text-slate-600"
          role="status"
        >
          Henüz hesaplama yapılmadı. Değerleri girerek kârını anında gör.
        </p>
      ) : (
        <>
          <p
            className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold sm:justify-start ${statusStyles}`}
            role="status"
          >
            {profitInsight.label}
          </p>

          {netProfit < 0 ? (
            <p
              className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-4 text-center text-base font-bold leading-snug text-red-900 sm:text-left"
              role="alert"
            >
              ⚠️ Bu satış seni zarara sokar
            </p>
          ) : null}

          <p
            className={`mt-4 text-center text-5xl font-bold tabular-nums leading-none tracking-tight sm:text-left sm:text-6xl ${
              profitInsight.status === "zarar"
                ? "text-red-600"
                : profitInsight.status === "dusuk_kar"
                  ? "text-amber-700"
                  : "text-[#22C55E]"
            }`}
            aria-live="polite"
          >
            {tryCurrency.format(netProfit)}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{profitInsight.message}</p>

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {profitInsight.recommendation}
          </div>
        </>
      )}

      {hasCalculation ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {revenueLabel}
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-[#0B1F3B]">
                {tryCurrency.format(revenueAmount)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Toplam gider
              </p>
              <p className="mt-1 text-lg font-bold tabular-nums text-[#0B1F3B]">
                {tryCurrency.format(totalExpenses)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-[#0B1F3B] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2"
            >
              Bu kârı kaydet
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#22C55E] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-[#16a34a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2"
            >
              Bu hesabı paylaş
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {sheet
              ? "Liste fiyatı modu: kesintiler liste üzerinden; iade/risk liste satırı."
              : "İndirimli satış: gelir kampanyalı fiyattan; iade net kâra çarpan."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">
                {sheet ? "Marj (liste)" : "Marj (efektif)"}
              </p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
                %{pct.format(profitMarginPercent)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">Maliyete göre kâr</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">
                %{pct.format(marginOnCostPercent)}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-medium text-slate-600">Yatırım getirisi (alış üzeri)</p>
            <p className="mt-0.5 text-base font-semibold tabular-nums text-emerald-800">
              %{pct.format(roiOnCostPercent)}
            </p>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Liste: {tryCurrency.format(listPrice)}
            {sheet && customerPriceAfterDiscount !== listPrice ? (
              <> · Kampanya: {tryCurrency.format(customerPriceAfterDiscount)}</>
            ) : null}
            {!sheet ? <> · Efektif: {tryCurrency.format(effectiveSalePrice)}</> : null}
          </p>
        </>
      ) : null}

      {vatDetail && hasCalculation ? (
        <details className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-amber-950">
            KDV özeti ▼
          </summary>
          <div className="space-y-2 border-t border-amber-100/80 px-4 pb-4 pt-2 text-xs text-amber-950">
            <p className="text-[11px] leading-relaxed opacity-90">
              KDV dahil tutarlar ve %{vatDetail.vatRate} oranıyla tahmini ayrıştırma.
            </p>
            <ul className="space-y-1.5 font-medium tabular-nums">
              <li className="flex justify-between gap-2">
                <span>Satış KDV</span>
                <span>{tryCurrency.format(vatDetail.saleVat)}</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Alış KDV</span>
                <span>{tryCurrency.format(vatDetail.purchaseVat)}</span>
              </li>
              <li className="flex justify-between gap-2 font-semibold">
                <span>Net KDV (tahmini)</span>
                <span>{tryCurrency.format(vatDetail.netVatPositionEstimate)}</span>
              </li>
            </ul>
          </div>
        </details>
      ) : null}

      {hasCalculation ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[#0B1F3B]">
            {sheet ? "Hesap detayı" : "Gider dökümü"}
          </h3>
          <ul className="mt-3 space-y-3 border-t border-slate-100 pt-3">
            {breakdownRows.map((row) => (
              <li key={row.label} className="text-sm text-slate-600">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-slate-800">{row.label}</span>
                      {row.sourceTag ? (
                        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {sourceLabel(row.sourceTag)}
                        </span>
                      ) : null}
                    </div>
                    {row.description ? (
                      <p className="mt-1 text-[11px] leading-snug text-slate-500">{row.description}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-medium tabular-nums text-slate-900">
                    {tryCurrency.format(row.amount)}
                  </span>
                </div>
              </li>
            ))}
            <li className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold text-slate-900">
              <span>Toplam</span>
              <span className="tabular-nums">{tryCurrency.format(totalExpenses)}</span>
            </li>
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Bu hesaplama gerçek pazaryeri verilerine dayalı tahmini sonuçlar sunar. Nihai değerler değişiklik
        gösterebilir.
      </p>
    </div>
  );
}
