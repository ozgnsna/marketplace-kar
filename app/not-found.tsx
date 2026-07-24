import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f3f5f9] px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-2 text-2xl font-bold text-[#0B1F3B]">Sayfa bulunamadı</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        Bağlantı eski olabilir. Pazaryeri kâr hesaplama aracına veya rehberlere gidebilirsiniz.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#hesaplama-basla"
          className="rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-semibold text-white"
        >
          Hesaplamaya git
        </Link>
        <Link
          href="/pazaryeri-kar-hesaplama"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3B]"
        >
          Pazaryeri kâr rehberi
        </Link>
        <Link
          href="/trendyol-komisyon-hesaplama"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0B1F3B]"
        >
          Trendyol komisyon
        </Link>
      </div>
    </main>
  );
}
