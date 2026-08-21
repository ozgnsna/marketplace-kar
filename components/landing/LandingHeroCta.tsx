"use client";

/** A/B: "Gerçek kârını gör" */
const HERO_CTA_LABEL = "Kâr mı zarar mı? Hemen öğren";

/** Hero CTA — sadece buton client; H1 LCP’si JS beklemez. */
export function LandingHeroCta() {
  function onPrimaryCta() {
    document.getElementById("hesaplama-basla")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="mt-8 flex w-full flex-col items-center text-center">
      <p className="mb-2 w-full text-[10px] font-medium uppercase tracking-[0.14em] text-white/55 sm:text-[11px]">
        Ücretsiz analiz
      </p>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", "cta_click", {
              event_category: "engagement",
              event_label: "hero_cta",
            });
          }
          onPrimaryCta();
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
  );
}
