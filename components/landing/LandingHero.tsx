"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { ChartDecoration } from "@/components/landing/ChartDecoration";

interface LandingHeroProps {
  onPrimaryCta: () => void;
}

export function LandingHero({ onPrimaryCta }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
      {/* Taban: yumuşak lacivertten koyu teal-yeşile doğal geçiş */}
      <div
        className="absolute inset-0 bg-[linear-gradient(155deg,#080f1c_0%,#0f2138_28%,#143d38_58%,#0f3028_85%,#0c2822_100%)]"
        aria-hidden
      />
      {/* Üstte çok hafif ışık (parlaklığı kısar) */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,255,255,0.07),transparent_52%)]"
        aria-hidden
      />
      {/* Sağ altta sütlü yeşil yıkama — sert değil */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_95%_85%,rgba(16,185,129,0.11),transparent_55%)]"
        aria-hidden
      />
      {/* Kenarları hafif karartan vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_95%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.18)_100%)]"
        aria-hidden
      />

      <ChartDecoration />

      <div className="relative z-10 mx-auto max-w-3xl px-1 text-center lg:max-w-4xl">
        <div className="mb-8 flex justify-center sm:mb-10">
          <BrandLogo variant="hero" priority className="drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]" />
        </div>
        <h1 className="text-balance text-[1.65rem] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl sm:leading-[1.12] lg:text-[2.65rem] lg:leading-[1.08] [text-shadow:0_2px_32px_rgba(0,0,0,0.35)]">
          Trendyol & Hepsiburada satışlarında gerçek kârını hesapla
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-slate-300/95 sm:mt-7 sm:max-w-2xl sm:text-lg sm:leading-relaxed">
          Komisyon, kargo, kampanya ve iade dahil NET kârını anında gör.
        </p>
        <div className="mt-10 flex flex-col items-center sm:mt-11">
          <button
            type="button"
            onClick={onPrimaryCta}
            className="inline-flex min-h-[54px] min-w-[220px] items-center justify-center rounded-2xl bg-[#22C55E] px-12 py-3.5 text-base font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2),0_16px_40px_-10px_rgba(34,197,94,0.45)] ring-1 ring-white/15 transition hover:brightness-105 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2138]"
          >
            Ücretsiz Hesapla
          </button>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400/95">
            Zarar edip etmediğini hemen öğren.
          </p>
        </div>
      </div>
    </section>
  );
}
