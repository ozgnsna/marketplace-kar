"use client";

import { useEffect, useMemo, useState } from "react";

type DesiHelperProps = {
  onApplyDesi: (desi: number) => void;
  /** Seçicide görünen desi — özet satırı için */
  appliedDesi?: number;
};

export function DesiHelper({ onApplyDesi, appliedDesi }: DesiHelperProps) {
  const [helpOpen, setHelpOpen] = useState(false);
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

  useEffect(() => {
    onApplyDesi(desiRounded);
  }, [desiRounded, onApplyDesi]);

  const summaryDesi = appliedDesi ?? desiRounded;

  return (
    <div className="mb-4">
      <details className="group rounded-2xl border border-slate-200 bg-white open:bg-slate-50/50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden">
          <span>
            Paket ölçüsünden boyut bul{" "}
            <span className="font-medium text-slate-500">(isteğe bağlı)</span>
          </span>
          <span className="tabular-nums text-xs font-semibold text-[#0B1F3B]">
            {summaryDesi} desi
          </span>
        </summary>

        <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Kutu en × boy × yükseklik ve ağırlığı gir; sistem ücret için kullanılan boyutu (desi)
            otomatik seçer.
          </p>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="text-xs font-semibold text-[#0B1F3B] underline decoration-slate-300 underline-offset-2 hover:decoration-[#0B1F3B]"
          >
            Nasıl hesaplanır?
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
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

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
            <p>
              Ölçüsel desi: <span className="tabular-nums font-medium">{volumetricDesi.toFixed(2)}</span>
              {" · "}
              Ağırlık: <span className="tabular-nums font-medium">{weightDesi.toFixed(2)}</span>
            </p>
            <p className="mt-1 font-semibold text-[#0B1F3B]">
              Seçilen boyut: {desiRounded} desi (kargo seçimine uygulandı)
            </p>
          </div>
        </div>
      </details>

      {helpOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="desi-modal-title"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="desi-modal-title" className="text-lg font-bold text-[#0B1F3B]">
              Desi nasıl hesaplanır?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Firmalar ölçüsel desi ile gerçek ağırlıktan yüksek olanı kullanır.
            </p>
            <p className="mt-3 text-sm font-medium text-slate-800">
              Desi = (En × Boy × Yükseklik) ÷ 3000
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Örnek: 30 × 20 × 10 cm → 6000 ÷ 3000 = <strong>2 desi</strong>
            </p>
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
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
