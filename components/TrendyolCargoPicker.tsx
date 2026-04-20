"use client";

import { useState } from "react";
import {
  TRENDYOL_CARGO_CARRIERS,
  TRENDYOL_CARGO_NOTE,
  getTrendyolKargoExclVat,
  trendyolKargoToInclVat,
  type TrendyolCarrierId,
} from "@/lib/trendyolKargo";

interface TrendyolCargoPickerProps {
  onApplyKargoInclVat: (value: number) => void;
}

const DESI_OPTIONS = Array.from({ length: 34 }, (_, i) => i);

export function TrendyolCargoPicker({ onApplyKargoInclVat }: TrendyolCargoPickerProps) {
  const [desi, setDesi] = useState(2);
  const [carrier, setCarrier] = useState<TrendyolCarrierId>("aras");

  const excl = getTrendyolKargoExclVat(desi, carrier);
  const incl = excl != null ? trendyolKargoToInclVat(excl) : null;

  return (
    <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
      <p className="mb-3 text-xs font-medium text-orange-950">
        Trendyol anlaşmalı kargo (PDF, KDV hariç tablo → forma KDV dahil yazılır)
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Desi / KG</span>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            value={desi}
            onChange={(e) => setDesi(Number(e.target.value))}
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
            value={carrier}
            onChange={(e) => setCarrier(e.target.value as TrendyolCarrierId)}
          >
            {TRENDYOL_CARGO_CARRIERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {incl != null && excl != null ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-600">
            KDV hariç <span className="tabular-nums font-medium">{excl.toFixed(2)}</span> ₺ → KDV
            dahil{" "}
            <span className="tabular-nums font-semibold text-slate-900">{incl.toFixed(2)}</span> ₺
          </span>
          <button
            type="button"
            onClick={() => onApplyKargoInclVat(incl)}
            className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            Kargo alanına yaz
          </button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-amber-800">Bu desi için tablo yok; kargoyu elle girin.</p>
      )}
      <p className="mt-2 text-[11px] leading-snug text-slate-500">{TRENDYOL_CARGO_NOTE}</p>
    </div>
  );
}
