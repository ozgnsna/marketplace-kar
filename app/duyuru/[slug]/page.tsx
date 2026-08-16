import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCta } from "@/components/seo/GuideCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllAnnouncements, getAnnouncementBySlug } from "@/data/announcements";
import { SITE_URL } from "@/lib/site";

const PLATFORM_LABEL: Record<string, string> = {
  trendyol: "Trendyol",
  hepsiburada: "Hepsiburada",
  shopier: "Shopier",
  genel: "Pazaryeri",
};

type PageParams = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllAnnouncements().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const announcement = getAnnouncementBySlug(slug);
  if (!announcement) return {};

  const ogImageUrl = new URL("/api/og-duyuru", SITE_URL);
  ogImageUrl.searchParams.set("slug", slug);

  const title = `${announcement.title} | Pazarkar`;

  return {
    title,
    description: announcement.summary,
    alternates: { canonical: new URL(`/duyuru/${slug}`, SITE_URL).toString() },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      title,
      description: announcement.summary,
      images: [{ url: ogImageUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: announcement.summary,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function DuyuruDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const announcement = getAnnouncementBySlug(slug);
  if (!announcement) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: announcement.title,
    description: announcement.summary,
    datePublished: announcement.date,
    inLanguage: "tr-TR",
    mainEntityOfPage: `${SITE_URL}/duyuru/${slug}`,
    author: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Pazarkar", url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#f3f5f9]">
      <JsonLd data={[articleJsonLd]} />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {PLATFORM_LABEL[announcement.platform] ?? "Pazaryeri"} ·{" "}
          {new Date(announcement.date).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#0B1F3B] sm:text-3xl">{announcement.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          {announcement.summary}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <GuideCta
            title="Bu değişikliğin sana etkisini şimdi hesapla"
            href={announcement.relatedGuideHref ?? "/#hesaplama-basla"}
            buttonLabel={
              announcement.relatedGuideHref ? "İlgili rehbere git" : "Ücretsiz hesaplama aracına git"
            }
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/duyuru" className="underline-offset-2 hover:underline">
            Tüm duyurular
          </Link>
        </p>
      </div>
    </main>
  );
}
