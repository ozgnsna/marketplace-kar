"use client";

interface PsychologyCardProps {
  onCta: () => void;
}

export function PsychologyCard({ onCta }: PsychologyCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-premium sm:p-7">
      <p className="text-sm font-medium leading-relaxed text-[#0B1F3B]">
        Çoğu satıcı kâr ettiğini sanıyor, aslında zarar ediyor.
      </p>
      <button
        type="button"
        onClick={onCta}
        className="mt-4 w-full rounded-2xl border-2 border-[#22C55E] bg-white py-3.5 text-sm font-semibold text-[#22C55E] transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2"
      >
        Ücretsiz Hesapla
      </button>
    </div>
  );
}
