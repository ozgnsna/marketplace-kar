import { StatsCounter } from "@/components/StatsCounter";
import { LandingHeroCta } from "@/components/landing/LandingHeroCta";

/**
 * Hero — Server Component.
 * H1 LCP adayı; calculator / GTM bundle’ına bağlanmaz.
 * Gradient sınıfları görsel tasarımı korur (renkler/layout aynı).
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative px-5 py-8 sm:px-6 sm:py-10">
        <div
          className="absolute inset-0 bg-[linear-gradient(162deg,#02060d_0%,#0B1F3B_42%,#143d38_78%,#061612_100%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(125,211,252,0.12),transparent_55%),radial-gradient(ellipse_70%_50%_at_95%_95%,rgba(34,95,82,0.35),transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[700px] flex-col items-center px-0 text-center">
          <h1 className="w-full text-balance text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.03em] text-white sm:text-[2rem] md:text-[clamp(2.25rem,4.2vw,3rem)] md:leading-[1.14] [text-shadow:0_1px_40px_rgba(0,0,0,0.25)]">
            Pazaryeri kâr hesaplama: zararını satmadan önce gör.
          </h1>

          <p className="mt-4 w-full max-w-none text-pretty text-base leading-relaxed text-white/70 md:text-lg md:leading-relaxed">
            Trendyol, Hepsiburada, n11, PttAVM ve Shopier için net kârını saniyeler içinde hesapla.
          </p>

          <LandingHeroCta />
          <StatsCounter />
        </div>
      </div>
    </section>
  );
}
