import type { Metadata } from "next";
import Link from "next/link";
import { GuideCta } from "@/components/seo/GuideCta";
import { getProfitStatus } from "@/lib/getProfitStatus";
import { SITE_URL } from "@/lib/site";

export const runtime = "edge";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  n11: "n11",
};

function num(v: string | string[] | undefined, fallback = 0): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = s ? Number(s) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function str(v: string | string[] | undefined, fallback = ""): string {
  const s = Array.isArray(v) ? v[0] : v;
  return s ?? fallback;
}

const tryFmt = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/**
 * Kullanıcının "Bu hesabı paylaş" ile ürettiği, tek bir hesaplama sonucunu
 * gösteren salt-okunur sayfa. WhatsApp/Instagram/Telegram'da paylaşılınca
 * /api/og-sonuc'un ürettiği kişiselleştirilmiş görsel link önizlemesi olarak çıkar.
 * Arama motorlarında indekslenmiyor (her kombinasyon ayrı, ince içerikli bir URL).
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const platform = str(sp.platform, "trendyol");
  const netProfit = num(sp.netProfit);
  const marginPercent = num(sp.marginPercent);
  const salePrice = num(sp.salePrice);
  const status = getProfitStatus({ netProfit, profitMarginPercent: marginPercent });
  const platformLabel = PLATFORM_LABEL[platform] ?? "Pazaryeri";

  const title = `${tryFmt.format(salePrice)} satış → ${tryFmt.format(netProfit)} net kâr | Pazarkar`;
  const description = `${platformLabel} satışında net kâr ve marj sonucu: ${status.label}. Sen de kendi ürününü ücretsiz hesapla.`;

  const ogImageUrl = new URL("/api/og-sonuc", SITE_URL);
  ogImageUrl.searchParams.set("platform", platform);
  ogImageUrl.searchParams.set("netProfit", String(netProfit));
  ogImageUrl.searchParams.set("marginPercent", String(marginPercent));
  ogImageUrl.searchParams.set("salePrice", String(salePrice));

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      title,
      description,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function SonucPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const platform = str(sp.platform, "trendyol");
  const netProfit = num(sp.netProfit);
  const marginPercent = num(sp.marginPercent);
  const salePrice = num(sp.salePrice);
  const status = getProfitStatus({ netProfit, profitMarginPercent: marginPercent });
  const platformLabel = PLATFORM_LABEL[platform] ?? "Pazaryeri";

  const statusColorClass =
    status.status === "zarar"
      ? "text-red-600"
      : status.status === "dusuk_kar"
        ? "text-amber-700"
        : "text-[#22C55E]";

  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {platformLabel} satışı · paylaşılan sonuç
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          {tryFmt.format(salePrice)}&apos;lik satış, gerçekte...
        </h1>
        <p className={`mt-4 text-5xl font-bold tabular-nums ${statusColorClass}`}>
          {tryFmt.format(netProfit)}
        </p>
        <p className="mt-1 text-base text-slate-600">net kâr bırakıyor.</p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Marj: %{marginPercent.toFixed(1).replace(".", ",")} — {status.label}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Bu, Pazarkar&apos;ın ücretsiz hesaplayıcısıyla üretilmiş bir sonuç. Sen de kendi ürününün
            komisyon, kargo ve iade dahil gerçek net kârını 30 saniyede, kayıt olmadan görebilirsin.
          </p>
          <GuideCta title="Kendi ürününü şimdi ücretsiz hesapla" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="underline-offset-2 hover:underline">
            pazarkar.com ana sayfa
          </Link>
        </p>
      </div>
    </main>
  );
}
