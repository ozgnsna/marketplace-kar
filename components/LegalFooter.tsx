import Link from "next/link";
import { DinamikPosPoweredStrip } from "@/components/DinamikPosPoweredStrip";

const guideLinkClass =
  "text-sm font-medium text-slate-800 underline-offset-2 transition hover:text-emerald-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

const legalLinkClass =
  "text-xs font-medium text-slate-500 underline-offset-2 transition hover:text-slate-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:text-[13px]";

const GUIDES = [
  { href: "/pazaryeri-kar-hesaplama", label: "Pazaryeri kâr hesaplama" },
  { href: "/trendyol-komisyon-hesaplama", label: "Trendyol komisyon hesaplama" },
  { href: "/trendyol-kar-hesaplama", label: "Trendyol kâr hesaplama" },
  { href: "/hepsiburada-komisyon-hesaplama", label: "Hepsiburada komisyon" },
  { href: "/shopier-komisyon-hesaplama", label: "Shopier komisyon" },
  { href: "/pazaryeri-komisyon-oranlari", label: "Komisyon oranları" },
] as const;

const FOOTER_CTA_LABEL = "Kâr mı zarar mı? 30 saniyede öğren";

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-slate-50/80 pb-28 sm:pb-10">
      <div className="mx-auto max-w-xl px-5 py-8 sm:px-6 sm:py-10">
        {/* 1 — CTA omurgası */}
        <div className="text-center">
          <p className="text-sm font-semibold tracking-tight text-[#0B1F3B] sm:text-[15px]">
            Gerçek kârını saniyeler içinde öğren.
          </p>
          <Link
            href="/#hesaplama-basla"
            className="mt-4 inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:text-[15px]"
          >
            {FOOTER_CTA_LABEL}
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
            30 sn · cihazında kalır · ücretsiz &amp; kayıtsız
          </p>
          <p className="mt-1.5 text-[11px] text-slate-400 sm:text-xs">
            Trendyol · Hepsiburada · Shopier
          </p>
        </div>

        {/* 2 — Powered by */}
        <div className="mt-7 flex justify-center border-t border-slate-200/80 pt-6">
          <DinamikPosPoweredStrip />
        </div>

        {/* 3 — Destek */}
        <div className="mt-7 border-t border-slate-200/80 pt-6 text-center">
          <h2 className="text-sm font-semibold text-[#0B1F3B]">İş birliği &amp; destek</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-[13px]">
            Takıldığın bir yer mi var? Yaz, birlikte çözelim.
          </p>
          <a
            href="mailto:info@pazarkar.com"
            className="mt-3 inline-block text-sm font-medium text-slate-800 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            info@pazarkar.com
          </a>
        </div>

        {/* 4 — Rehberler */}
        <nav
          aria-label="SEO rehber sayfaları"
          className="mt-7 border-t border-slate-200/80 pt-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Rehberler
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className={guideLinkClass}>
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 5 — Yasal */}
        <nav
          aria-label="Yasal bağlantılar"
          className="mt-7 border-t border-slate-200/80 pt-5"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <li>
              <Link href="/kullanim-sartlari" className={legalLinkClass}>
                Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link href="/gizlilik-politikasi" className={legalLinkClass}>
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/yasal-bilgilendirme" className={legalLinkClass}>
                Yasal Bilgilendirme
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
