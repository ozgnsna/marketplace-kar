"use client";

import { getCargoPrice, listCargoCarriers, maxDesiForPlatform } from "@/lib/cargoPrice";
import { HEPSIBURADA_CARGO_NOTE } from "@/lib/hepsiburadaKargo";
import { SHOPIER_CARGO_NOTE } from "@/lib/shopierKargo";
import { TRENDYOL_CARGO_NOTE } from "@/lib/trendyolKargo";
import type { MarketplacePlatform } from "@/types/profit";

type PlatformCargoPickerProps = {
  platform: MarketplacePlatform;
  desi: number;
  carrierKey: string;
  onDesiChange: (desi: number) => void;
  onCarrierChange: (carrierKey: string) => void;
};

function cargoBorder(platform: MarketplacePlatform): string {
  if (platform === "trendyol") return "border-orange-100 bg-orange-50/60";
  if (platform === "hepsiburada") return "border-violet-100 bg-violet-50/60";
  return "border-rose-100 bg-rose-50/60";
}

function cargoTitle(platform: MarketplacePlatform): string {
  if (platform === "trendyol") return "Trendyol anlaşmalı kargo (KDV dahil)";
  if (platform === "hepsiburada") return "Hepsiburada anlaşmalı kargo (KDV dahil)";
  return "Shopier anlaşmalı kargo";
}

function cargoNote(platform: MarketplacePlatform): string {
  if (platform === "trendyol") return TRENDYOL_CARGO_NOTE;
  if (platform === "hepsiburada") return HEPSIBURADA_CARGO_NOTE;
  return SHOPIER_CARGO_NOTE;
}

export function PlatformCargoPicker({
  platform,
  desi,
  carrierKey,
  onDesiChange,
  onCarrierChange,
}: PlatformCargoPickerProps) {
  const carriers = listCargoCarriers(platform);
  const maxDesi = maxDesiForPlatform(platform);
  const desiOptions = Array.from({ length: maxDesi + 1 }, (_, i) => i);
  const safeDesi = Math.min(Math.max(0, desi), maxDesi);
  const preview = getCargoPrice(platform, carrierKey, safeDesi);

  return (
    <div className={`mb-4 rounded-xl border p-4 ${cargoBorder(platform)}`}>
      <p className="mb-3 text-xs font-medium text-slate-800">{cargoTitle(platform)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Desi / KG</span>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={safeDesi}
            onChange={(e) => onDesiChange(Number(e.target.value))}
          >
            {desiOptions.map((d) => (
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
          Tablo tahmini:{" "}
          <span className="font-semibold tabular-nums text-slate-900">{preview.toFixed(2)}</span> ₺
          <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
            Aşağıdaki kargo alanına yazılır; istersen elle değiştir.
          </span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-amber-800">Bu kombinasyon için tablo yok; kargoyu elle girin.</p>
      )}
      <p className="mt-2 text-[11px] leading-snug text-slate-500">{cargoNote(platform)}</p>
    </div>
  );
}
