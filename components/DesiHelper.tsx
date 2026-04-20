"use client";

import { useMemo, useState } from "react";

type DesiHelperProps = {
  onApplyDesi: (desi: number) => void;
};

export function DesiHelper({ onApplyDesi }: DesiHelperProps) {
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState(30);
  const [boy, setBoy] = useState(20);
  const [yuk, setYuk] = useState(10);
  const [agirlik, setAgirlik] = useState(1.2);

  const { volumetricDesi, weightDesi, billing } = useMemo(() => {
    const vol = (Math.max(0, en) * Math.max(0, boy) * Math.max(0, yuk)) / 3000;
    const w = Math.max(0, agirlik);
    const b = Math.max(vol, w);
    return {
      volumetricDesi: vol,
      weightDesi: w,
      billing: b,
    };
  }, [en, boy, yuk, agirlik]);

  const desiRounded = Math.min(33, Math.max(0, Math.round(billing)));

  return (
    <div className="mb-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
      <p className="text-xs leading-relaxed text-slate-700">
        Kargo firmaları önce kutu ölçülerinden desiyi hesaplar, sonra gerçek ağırlığı kontrol eder.
        Ölçüsel desi ile gerçek ağırlıktan hangisi daha yüksekse, ücretlendirme o değer üzerinden
        yapılır.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3B] underline decoration-slate-300 underline-offset-2 hover:decoration-[#0B1F3B]"
      >
        Desi nasıl hesaplanır?
      </button>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">En (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={en || ""}
            onChange={(e) => setEn(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Boy (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={boy || ""}
            onChange={(e) => setBoy(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Yükseklik (cm)</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={yuk || ""}
            onChange={(e) => setYuk(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Gerçek ağırlık (kg)</span>
          <input
            type="number"
            inputMode="decimal"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={agirlik || ""}
            onChange={(e) => setAgirlik(parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
        <p>
          <span className="font-medium text-slate-800">Ölçüsel desi:</span>{" "}
          <span className="tabular-nums">{volumetricDesi.toFixed(2)}</span>
        </p>
        <p className="mt-1">
          <span className="font-medium text-slate-800">Ağırlık (kg) → desi karşılığı:</span>{" "}
          <span className="tabular-nums">{weightDesi.toFixed(2)}</span>
        </p>
        <p className="mt-1 font-semibold text-[#0B1F3B]">
          Ücretlendirmede esas:{" "}
          <span className="tabular-nums">{billing.toFixed(2)}</span> desi (yuvarlanmış:{" "}
          {desiRounded})
        </p>
        <button
          type="button"
          onClick={() => onApplyDesi(desiRounded)}
          className="mt-3 w-full rounded-xl bg-[#0B1F3B] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 sm:w-auto"
        >
          Bu desiyi kargo seçiminde kullan
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="desi-modal-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="desi-modal-title" className="text-lg font-bold text-[#0B1F3B]">
              Desi nasıl hesaplanır?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Kargo firmaları önce kutu ölçülerinden desiyi hesaplar, sonra gerçek ağırlığı kontrol
              eder. Ölçüsel desi ile gerçek ağırlıktan hangisi daha yüksekse, ücretlendirme o değer
              üzerinden yapılır.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-800">
              Desi = (En × Boy × Yükseklik) ÷ 3000
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Örnek: 30 × 20 × 10 cm → 6000 ÷ 3000 = <strong>2 desi</strong>
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
            >
              Kapat
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
