import { ProfitCalculator } from "@/components/ProfitCalculator";
import { pageMetadata } from "@/lib/seoMetadata";

export const metadata = pageMetadata({
  title: "Pazaryeri Kâr Hesaplama | Trendyol Komisyon Hesaplama",
  description:
    "Pazaryeri kâr hesaplama ve Trendyol komisyon hesaplama aracı. Komisyon, kargo, kampanya dahil net kârı Trendyol, Hepsiburada ve Shopier için saniyeler içinde hesaplayın.",
  path: "/",
  absolute: true,
  keywords: [
    "pazaryeri kar hesaplama",
    "pazaryeri kâr hesaplama",
    "trendyol komisyon hesaplama",
  ],
});

export default function Home() {
  return (
    <main id="ana-icerik" className="min-h-screen">
      <ProfitCalculator />
    </main>
  );
}
