"use client";

import { BrandLogo } from "@/components/BrandLogo";

interface LandingHeroProps {
  onPrimaryCta: () => void;
}

export function LandingHero({ onPrimaryCta }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pt-[120px] pb-[100px] sm:px-6">
      {/* Derin, sade premium gradient */}
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#050a12_0%,#0a1628_22%,#0f2440_48%,#0d2036_72%,#081418_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,rgba(56,189,248,0.08),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_100%_0%,rgba(16,185,129,0.06),transparent_50%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(0,0,0,0.35),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[800px] text-center">
        <header className="mb-8 flex flex-col items-center sm:mb-8">
          <div className="isolate flex justify-center">
            <BrandLogo
              variant="hero"
              priority
              knockoutWhiteOnDark
              className="drop-shadow-[0_2px_24px_rgba(0,0,0,0.25)]"
            />
          </div>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.32em] text-white/40 sm:text-xs">
            pazarkâr
          </p>
        </header>

        <h1 className="text-balance text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.03em] text-white sm:text-[2rem] md:text-[clamp(2.25rem,4.2vw,3rem)] md:leading-[1.14] [text-shadow:0_1px_40px_rgba(0,0,0,0.25)]">
          Zarar ettiğini fark etmeden satış yapıyor olabilirsin.
        </h1>

        <p className="mx-auto mt-4 max-w-[38rem] text-pretty text-base leading-relaxed text-white/70 md:text-lg md:leading-relaxed">
          Trendyol & Hepsiburada satışlarında gerçek NET kazancını saniyeler içinde hesapla.
        </p>

        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={onPrimaryCta}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-9 py-4 text-base font-semibold text-white shadow-[0_4px_20px_rgba(5,150,105,0.35)] ring-1 ring-white/10 transition duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(5,150,105,0.45)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            Kârımı Hesapla
          </button>

          <p className="mt-4 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[13px] leading-relaxed text-white/60 sm:text-sm">
            <span className="whitespace-nowrap">✔ 30 saniyede sonuç</span>
            <span className="whitespace-nowrap">✔ Ücretsiz</span>
            <span className="whitespace-nowrap">✔ Kayıt gerekmez</span>
          </p>

          <p className="mt-6 text-xs text-emerald-100/70 sm:text-sm">
            Bugün 124+ satıcı hesaplama yaptı
          </p>
        </div>
      </div>
    </section>
  );
}
