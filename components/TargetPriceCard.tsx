"use client";

import { useMemo, useState } from "react";
import {
  requiredListPriceForMarginOnCost,
  requiredListPriceForTargetNet,
} from "@/lib/requiredListPrice";
import type { MarketplacePlatform, ProfitInputs } from "@/types/profit";
import { NumberField } from "@/components/NumberField";

const tryCurrency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PLATFORM_LABEL: Record<MarketplacePlatform, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
};

const QUICK_MARGINS = [10, 20, 30, 50, 100] as const;

type TargetMode = "netTry" | "marginOnCost";

interface TargetPriceCardProps {
  inputs: ProfitInputs;
  /** Zarar veya düşük kârda hedef kartını vurgular */
  emphasize?: boolean;
}

export function TargetPriceCard({ inputs, emphasize = false }: TargetPriceCardProps) {
  const [targetMode, setTargetMode] = useState<TargetMode>("marginOnCost");
  const [targetNet, setTargetNet] = useState(0);
  const [marginOnCost, setMarginOnCost] = useState(30);

  const solved = useMemo(() => {
    if (targetMode === "marginOnCost") {
      if (inputs.calculationMode !== "sheet") {
        return requiredListPriceForTargetNet(
          inputs,
          (inputs.purchasePrice * marginOnCost) / 100
        );
      }
      return requiredListPriceForMarginOnCost(inputs, marginOnCost);
    }
    return requiredListPriceForTargetNet(inputs, targetNet);
  }, [inputs, targetMode, targetNet, marginOnCost]);

  const sheet = inputs.calculationMode === "sheet";

  const comparison = useMemo(() => {
    if (!solved) return null;
    const current = Math.max(0, inputs.salePrice);
    const suggested = solved.listPrice;
    const diff = suggested - current;
    if (current <= 0) {
      return { kind: "no_current" as const, suggested, diff };
    }
    const meets = current + 0.5 >= suggested;
    return { kind: "ok" as const, current, suggested, diff, meets };
  }, [solved, inputs.salePrice]);

  return (
    <div
      className={`relative rounded-3xl border bg-white p-7 shadow-premium sm:p-8 ${
        emphasize
          ? "border-amber-300/90 ring-2 ring-amber-400/35"
          : "border-slate-200/70"
      }`}
    >
      {emphasize ? (
        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200/80">
          Önerilen fiyat
        </span>
      ) : null}

      <h3
        className={`text-lg font-bold text-[#0B1F3B] ${emphasize ? "pr-24 sm:pr-32" : ""}`}
      >
        Hedef kâr için önerilen satış fiyatı
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Belirlediğiniz kâr oranına ulaşmak için önerilen minimum liste fiyatı. Üstteki maliyet ve
        kesintilerle tutarlıdır ({PLATFORM_LABEL[inputs.platform]}).
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTargetMode("marginOnCost")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            targetMode === "marginOnCost"
              ? "bg-[#22C55E] text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Hedef kâr oranı %
        </button>
        <button
          type="button"
          onClick={() => setTargetMode("netTry")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            targetMode === "netTry"
              ? "bg-[#22C55E] text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Sabit net kâr (₺)
        </button>
      </div>

      <div className="mt-5">
        {targetMode === "marginOnCost" ? (
          <>
            <p className="mb-2 text-xs font-medium text-slate-600">Hızlı hedef marj</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {QUICK_MARGINS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMarginOnCost(m);
                    setTargetMode("marginOnCost");
                  }}
                  className={`min-h-[36px] min-w-[3rem] rounded-full px-3 text-sm font-semibold transition ${
                    marginOnCost === m
                      ? "bg-[#0B1F3B] text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  %{m}
                </button>
              ))}
            </div>
            <NumberField
              id="marginOnCost"
              label="Hedef kâr oranı (maliyet üzerinden)"
              suffix="%"
              value={marginOnCost}
              onChange={(v) => setMarginOnCost(v)}
              hint={
                sheet
                  ? "Liste fiyatı modunda net kâr ≈ alış × bu oran olacak şekilde liste hesaplanır."
                  : "İndirimli satış modunda hedef net kâr = alış × bu oran kabul edilir."
              }
            />
          </>
        ) : (
          <NumberField
            id="targetNetProfit"
            label="Hedef net kâr (birim)"
            suffix="₺"
            value={targetNet}
            onChange={(v) => setTargetNet(v)}
          />
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-5 py-5">
        {solved ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
              Önerilen minimum liste fiyatı
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-[#0B1F3B]">
              {tryCurrency.format(solved.listPrice)}
            </p>
            {targetMode === "marginOnCost" ? (
              <p className="mt-2 text-sm font-medium text-emerald-900/90">
                Hedef kâr oranı: %{marginOnCost}
              </p>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Bu fiyatın altında kalırsanız hedef marja tek başına bu girdilerle ulaşamazsınız.
            </p>
            {!sheet && solved.effectiveSalePrice !== solved.listPrice ? (
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Kampanya sonrası müşteri fiyatı: {tryCurrency.format(solved.effectiveSalePrice)}
              </p>
            ) : null}

            {comparison && comparison.kind === "ok" ? (
              <>
                <div className="mt-4 space-y-1.5 border-t border-emerald-200/60 pt-4 text-sm">
                  <div className="flex justify-between gap-2 text-slate-600">
                    <span>Mevcut liste fiyatı</span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {tryCurrency.format(comparison.current)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 text-slate-600">
                    <span>Önerilen liste fiyatı</span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {tryCurrency.format(comparison.suggested)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-emerald-200/50 pt-2 font-medium text-slate-800">
                    <span>Fark (önerilen − mevcut)</span>
                    <span
                      className={`tabular-nums ${
                        comparison.diff > 0.5 ? "text-amber-800" : "text-emerald-800"
                      }`}
                    >
                      {comparison.diff >= 0 ? "+" : ""}
                      {tryCurrency.format(comparison.diff)}
                    </span>
                  </div>
                </div>
                <div
                  className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium leading-relaxed ${
                    comparison.meets
                      ? "bg-emerald-100/80 text-emerald-950"
                      : "bg-amber-100/80 text-amber-950"
                  }`}
                  role="status"
                >
                  {comparison.meets
                    ? "Mevcut satış fiyatınız bu hedef kârı karşılıyor."
                    : "Mevcut satış fiyatınız bu hedefin altında kalıyor."}
                </div>
              </>
            ) : comparison && comparison.kind === "no_current" ? (
              <p className="mt-4 text-xs text-slate-500">
                Karşılaştırma için üstte liste / satış fiyatını girin.
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-amber-800" role="alert">
            Bu kombinasyonla çözülemiyor: oranların toplamı %100&apos;ü aşmamalıdır.
          </p>
        )}
      </div>
    </div>
  );
}
