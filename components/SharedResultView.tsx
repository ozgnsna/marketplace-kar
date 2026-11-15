import type { Metadata } from "next";
import Link from "next/link";
import { GuideCta } from "@/components/seo/GuideCta";
import { describeBreakdownLabel } from "@/lib/enrichBreakdown";
import { getProfitStatus } from "@/lib/getProfitStatus";
import { SITE_URL } from "@/lib/site";
import type { ExpenseBreakdownItem } from "@/types/profit";

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  n11: "n11",
  pttavm: "PttAVM",
};

const tryFmt = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const tryDetailFmt = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export type SharedResultData = {
  platform: string;
  netProfit: number;
  marginPercent: number;
  salePrice: number;
  breakdown: ExpenseBreakdownItem[];
};

export function sharedResultMetadata(data: SharedResultData): Metadata {
  const status = getProfitStatus({
    netProfit: data.netProfit,
    profitMarginPercent: data.marginPercent,
  });
  const platformLabel = PLATFORM_LABEL[data.platform] ?? "Pazaryeri";
  const title = `${tryFmt.format(data.salePrice)} satış → ${tryFmt.format(data.netProfit)} net kâr | Pazarkar`;
  const description = `${platformLabel} satışında net kâr ve marj sonucu: ${status.label}. Sen de kendi ürününü ücretsiz hesapla.`;

  const ogImageUrl = new URL("/api/og-sonuc", SITE_URL);
  ogImageUrl.searchParams.set("platform", data.platform);
  ogImageUrl.searchParams.set("netProfit", String(data.netProfit));
  ogImageUrl.searchParams.set("marginPercent", String(data.marginPercent));
  ogImageUrl.searchParams.set("salePrice", String(data.salePrice));

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

export function SharedResultView({ data }: { data: SharedResultData }) {
  const status = getProfitStatus({
    netProfit: data.netProfit,
    profitMarginPercent: data.marginPercent,
  });
  const platformLabel = PLATFORM_LABEL[data.platform] ?? "Pazaryeri";
  const totalExpenses = data.breakdown.reduce((sum, row) => sum + row.amount, 0);
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
          {tryFmt.format(data.salePrice)}&apos;lik satış, gerçekte...
        </h1>
        <p className={`mt-4 text-5xl font-bold tabular-nums ${statusColorClass}`}>
          {tryFmt.format(data.netProfit)}
        </p>
        <p className="mt-1 text-base text-slate-600">
          {data.netProfit < 0 ? "zarar yazıyor." : "net kâr bırakıyor."}
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Marj: %{data.marginPercent.toFixed(1).replace(".", ",")} — {status.label}
        </p>

        {data.breakdown.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-[#0B1F3B]">Hesap detayı</h2>
            <ul className="mt-3 space-y-3 border-t border-slate-100 pt-3">
              {data.breakdown.map((row) => {
                const description = describeBreakdownLabel(row.label);
                return (
                  <li key={row.label} className="text-sm text-slate-600">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-800">{row.label}</span>
                        {description ? (
                          <p className="mt-1 text-[11px] leading-snug text-slate-500">{description}</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 font-medium tabular-nums text-slate-900">
                        {tryDetailFmt.format(row.amount)}
                      </span>
                    </div>
                  </li>
                );
              })}
              <li className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold text-slate-900">
                <span>Toplam gider</span>
                <span className="tabular-nums">{tryDetailFmt.format(totalExpenses)}</span>
              </li>
            </ul>
          </section>
        ) : null}

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
