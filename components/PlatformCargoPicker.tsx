"use client";

import { getCargoPrice, listCargoCarriers, MAX_DESI_OPTION } from "@/lib/cargoPrice";
import { TRENDYOL_CARGO_NOTE } from "@/lib/trendyolKargo";
import type { MarketplacePlatform } from "@/types/profit";

const DESI_OPTIONS = Array.from({ length: MAX_DESI_OPTION + 1 }, (_, i) => i);

type PlatformCargoPickerProps = {
  platform: MarketplacePlatform;
  desi: number;
  carrierKey: string;
  onDesiChange: (desi: number) => void;
  onCarrierChange: (carrierKey: string) => void;
};

export function PlatformCargoPicker({
  platform,
  desi,
  carrierKey,
  onDesiChange,
  onCarrierChange,
}: PlatformCargoPickerProps) {
  const carriers = listCargoCarriers(platform);
  const preview = getCargoPrice(platform, carrierKey, desi);
  const border =
    platform === "trendyol"
      ? "border-orange-100 bg-orange-50/60"
      : "border-violet-100 bg-violet-50/60";

  return (
    <div className={`mb-4 rounded-xl border p-4 ${border}`}>
      <p className="mb-3 text-xs font-medium text-slate-800">
        {platform === "trendyol"
          ? "Trendyol anlaşmalı kargo — desi ve firmaya göre tahmini maliyet (KDV dahil)"
          : "Hepsiburada — desi ve firmaya göre örnek kargo (KDV dahil)"}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Desi / KG</span>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={desi}
            onChange={(e) => onDesiChange(Number(e.target.value))}
          >
            {DESI_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Kargo firması</span>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={carrierKey}
            onChange={(e) => onCarrierChange(e.target.value)}
          >
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {preview != null ? (
        <p className="mt-3 text-sm text-slate-700">
          Tahmini kargo (KDV dahil):{" "}
          <span className="font-semibold tabular-nums text-slate-900">{preview.toFixed(2)}</span> ₺
        </p>
      ) : (
        <p className="mt-2 text-xs text-amber-800">Bu kombinasyon için tablo yok; kargoyu elle girin.</p>
      )}
      {platform === "trendyol" ? (
        <p className="mt-2 text-[11px] leading-snug text-slate-500">{TRENDYOL_CARGO_NOTE}</p>
      ) : (
        <p className="mt-2 text-[11px] leading-snug text-slate-500">
          Hepsiburada için firma seçimi isteğe bağlıdır; ücret desi üzerinden hesaplanır. İsterseniz
          kargo tutarını aşağıdan doğrudan girebilirsiniz.
        </p>
      )}
    </div>
  );
}
