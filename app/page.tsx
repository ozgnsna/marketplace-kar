import dynamic from "next/dynamic";
import { LandingHero } from "@/components/landing/LandingHero";
import { pageMetadata } from "@/lib/seoMetadata";

export const metadata = pageMetadata({
  title: "Pazaryeri Kâr Hesaplama | Trendyol Komisyon Hesaplama",
  description:
    "Pazaryeri kâr hesaplama: Trendyol, Hepsiburada, n11, PttAVM ve Shopier komisyon hesaplama aracı. Komisyon, kargo, kampanya dahil net kârı saniyeler içinde hesaplayın.",
  path: "/",
  absolute: true,
  keywords: [
    "pazaryeri kar hesaplama",
    "pazaryeri kâr hesaplama",
    "trendyol komisyon hesaplama",
    "n11 komisyon hesaplama",
    "pttavm komisyon hesaplama",
    "hepsiburada komisyon hesaplama",
    "shopier komisyon hesaplama",
  ],
});

/** Ağır calculator JS (komisyon verisi vb.) H1 boyamasını bloklamasın */
const ProfitCalculator = dynamic(
  () =>
    import("@/components/ProfitCalculator").then((m) => ({
      default: m.ProfitCalculator,
    })),
  {
    loading: () => (
      <div
        className="min-h-[70vh] bg-[#f3f5f9]"
        aria-hidden
        aria-busy="true"
      />
    ),
  }
);

export default function Home() {
  return (
    <main id="ana-icerik" className="min-h-screen">
      <LandingHero />
      <ProfitCalculator />
    </main>
  );
}
