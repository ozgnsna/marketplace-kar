import Link from "next/link";
import { GuideCta } from "@/components/seo/GuideCta";
import { getAllAnnouncements } from "@/data/announcements";
import { pageMetadata } from "@/lib/seoMetadata";

export const metadata = pageMetadata({
  title: "Komisyon ve Kâr Duyuruları",
  description:
    "Trendyol, Hepsiburada ve Shopier'de komisyon oranı ve kural değişikliklerini ilk öğrenen sen ol.",
  path: "/duyuru",
  keywords: ["trendyol komisyon değişikliği", "hepsiburada komisyon güncelleme", "pazaryeri duyuru"],
});

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  n11: "n11",
  genel: "Pazaryeri",
};

export default function DuyuruIndexPage() {
  const announcements = getAllAnnouncements();

  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1F3B] sm:text-3xl">
          Komisyon ve kâr duyuruları
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          Trendyol, Hepsiburada ve Shopier komisyon oranlarındaki ve kurallarındaki değişiklikleri
          fark ettiğimiz an burada, kısa ve net şekilde paylaşıyoruz.
        </p>

        {announcements.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center">
            <p className="text-sm text-slate-500">
              Henüz yayınlanmış bir duyuru yok — yeni bir komisyon/kural değişikliği fark ettiğimizde
              burada ilk yayınlayan biz olacağız.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {announcements.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/duyuru/${a.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400/60 hover:bg-emerald-50/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {PLATFORM_LABEL[a.platform] ?? "Pazaryeri"} ·{" "}
                    {new Date(a.date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#0B1F3B]">{a.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <GuideCta title="Güncel oranlarla kendi net kârını şimdi hesapla" />
        </div>
      </div>
    </main>
  );
}
