"use client";

import { BrandLogo } from "@/components/BrandLogo";

/** A/B: "Gerçek kârını gör" */
const HERO_CTA_LABEL = "Kâr mı zarar mı? Hemen öğren [DEBUG]";

interface LandingHeroProps {
  onPrimaryCta: () => void;
}

export function LandingHero({ onPrimaryCta }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Tam genişlik beyaz şerit — logo hizası tek renk */}
      <div className="relative z-20 w-full border-b border-slate-200/90 bg-white">
        <div className="mx-auto flex max-w-[800px] justify-center px-5 py-0.5 sm:px-6 sm:py-1">
          <BrandLogo variant="hero" priority className="drop-shadow-none" />
        </div>
      </div>

      <div className="relative px-5 py-8 sm:px-6 sm:py-10">
        {/* Base: midnight navy */}
        <div
          className="absolute inset-0 bg-[linear-gradient(162deg,#02060d_0%,#071a24_28%,#0e2438_52%,#061612_100%)]"
          aria-hidden
        />
        {/* Üst: hafif gök mavisi — soğuk derinlik (neon değil) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_95%_58%_at_50%_-8%,rgba(125,211,252,0.11),rgba(56,189,248,0.05),transparent_56%)]"
          aria-hidden
        />
        {/* Sol: marka petrol — biraz daha belirgin */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_95%_at_8%_45%,rgba(20,61,56,0.38),transparent_58%)]"
          aria-hidden
        />
        {/* Orta: derin lacivert */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_42%,rgba(15,33,56,0.52),transparent_66%)]"
          aria-hidden
        />
        {/* Sağ üst: soğuk lacivert + hafif gök */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_62%_50%_at_90%_6%,rgba(42,72,102,0.28),rgba(56,189,248,0.04),transparent_54%)]"
          aria-hidden
        />
        {/* Sağ alt: yeşil-petrol glow — daha belirgin */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_72%_56%_at_94%_94%,rgba(34,95,82,0.42),rgba(18,72,62,0.18),rgba(12,44,38,0.06),transparent_55%)]"
          aria-hidden
        />
        {/* Alt vignette — hafif; üstteki renkler daha okunur */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_115%_62%_at_50%_108%,rgba(0,0,0,0.32),transparent_58%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[700px] flex-col items-center px-0 text-center">
          <h1 className="w-full text-balance text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.03em] text-white sm:text-[2rem] md:text-[clamp(2.25rem,4.2vw,3rem)] md:leading-[1.14] [text-shadow:0_1px_40px_rgba(0,0,0,0.25)]">
            Zarar ettiğini fark etmeden satış yapıyor olabilirsin.
          </h1>

          <p className="mt-4 w-full max-w-none text-pretty text-base leading-relaxed text-white/70 md:text-lg md:leading-relaxed">
            Trendyol & Hepsiburada satışlarında gerçek NET kazancını saniyeler içinde hesapla.
          </p>

          <div className="mt-8 flex w-full flex-col items-center text-center">
            <p className="mb-2 w-full text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 sm:text-[11px]">
              Ücretsiz analiz
            </p>
            <button
              type="button"
              onClick={() => {
                console.log("REAL CTA CLICKED");

                if (typeof window !== "undefined" && typeof window.gtag === "function") {
                  console.log("REAL GTAG EXISTS");

                  window.gtag("event", "cta_click", {
                    event_category: "engagement",
                    event_label: "hero_cta",
                    debug_mode: true,
                  });
                } else {
                  console.log("REAL GTAG YOK");
                }

                onPrimaryCta?.();
              }}
              className="mx-auto inline-flex max-w-[min(100%,22rem)] items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-6 py-3.5 text-center text-[0.9375rem] font-semibold leading-snug text-white shadow-[0_4px_22px_rgba(5,150,105,0.38)] ring-1 ring-white/10 transition-all duration-200 ease-out will-change-transform hover:scale-[1.03] hover:shadow-[0_12px_40px_-4px_rgba(5,120,85,0.55),0_6px_22px_rgba(5,150,105,0.42)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050f14] sm:max-w-none sm:px-9 sm:py-4 sm:text-base"
            >
              <span className="text-balance">{HERO_CTA_LABEL}</span>
            </button>

            <p className="mt-3 w-full text-[11px] font-medium leading-snug tracking-wide text-white/75 sm:mt-3.5 sm:text-xs">
              30 saniyede sonuç <span className="text-white/45">•</span> Ücretsiz{" "}
              <span className="text-white/45">•</span> Kayıt gerekmez
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
