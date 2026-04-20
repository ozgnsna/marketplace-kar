"use client";

import { useId, useState } from "react";
import { Modal } from "@/components/Modal";
import { writeLegalAccepted } from "@/lib/legalStorage";

type LegalConsentModalProps = {
  /** Modal kapanır (ör. üst bileşen onayı state’e işler) */
  onAccept: () => void;
};

const BODY_TEXT = `Bu platformda sunulan hesaplamalar bilgilendirme amaçlıdır.
Komisyon oranları, kargo ücretleri ve diğer giderler pazaryerlerine, ürün kategorilerine ve satıcı sözleşmelerine göre değişiklik gösterebilir.

Pazarkar, sunulan verilerin doğruluğunu garanti etmez ve oluşabilecek mali kayıplardan sorumlu tutulamaz.

Bu platform Trendyol ve Hepsiburada ile resmi bir iş ortaklığı içinde değildir.

Kullanıcılar, nihai satış kararlarını kendi ticari değerlendirmelerine göre vermelidir.`;

export function LegalConsentModal({ onAccept }: LegalConsentModalProps) {
  const titleId = useId();
  const descId = useId();
  const [accepted, setAccepted] = useState(false);

  function handleContinue() {
    if (!accepted) return;
    writeLegalAccepted();
    onAccept();
  }

  return (
    <Modal
      open
      zIndexClass="z-[500]"
      backdropClassName="bg-slate-900/50 backdrop-blur-md"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="pointer-events-auto flex max-h-[min(90vh,720px)] w-full flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <h2
            id={titleId}
            className="text-lg font-bold leading-snug text-[#0B1F3B] sm:text-xl"
          >
            Bilgilendirme ve Kullanım Onayı
          </h2>
          <div
            id={descId}
            className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600"
          >
            {BODY_TEXT.split("\n\n").map((block, i) => (
              <p key={i}>{block.trim()}</p>
            ))}
          </div>
        </div>

        <div className="shrink-0 space-y-4 border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3.5 transition hover:bg-slate-100/90">
            <input
              id="pazarkar-legal-consent"
              name="pazarkar-legal-consent"
              type="checkbox"
              autoComplete="off"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#0B1F3B] focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-0"
              checked={accepted}
              onChange={(e) => setAccepted(e.currentTarget.checked)}
            />
            <span className="text-sm leading-snug text-slate-800 select-none">
              Okudum ve kabul ediyorum
            </span>
          </label>

          <button
            type="button"
            disabled={!accepted}
            onClick={handleContinue}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:shadow-lg disabled:cursor-not-allowed ${
              accepted
                ? "bg-[#0B1F3B] text-white shadow-md ring-2 ring-[#22C55E]/25 hover:bg-slate-800"
                : "bg-slate-200 text-slate-500 opacity-60 shadow-none"
            }`}
          >
            Devam Et
          </button>
        </div>
      </div>
    </Modal>
  );
}
