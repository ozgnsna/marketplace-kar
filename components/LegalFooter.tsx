import Link from "next/link";
import { FooterSocialProofLine } from "@/components/FooterSocialProofLine";
import { DinamikPosPoweredStrip } from "@/components/DinamikPosPoweredStrip";

const dividerClass =
  "my-3 h-px w-full bg-gradient-to-r from-transparent via-slate-200/95 to-transparent sm:my-3.5";

const legalLinkClass =
  "group relative inline-block pb-0.5 text-sm font-semibold text-slate-950 no-underline transition-colors duration-200 hover:text-[#0B1F3B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600/80 sm:text-[15px] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-emerald-600 after:transition-[width] after:duration-300 after:ease-out hover:after:w-full";

/** A/B: "Gerçek kârını şimdi gör" */
const FOOTER_CTA_LABEL = "Kâr mı zarar mı? 30 saniyede öğren";

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-gradient-to-b from-slate-50/[0.97] via-white to-slate-50/90">
      <div className="mx-auto max-w-[560px] px-5 py-5 text-center sm:px-6 sm:py-6">
        <p className="text-sm font-semibold leading-snug tracking-tight text-slate-900 sm:text-[15px]">
          Gerçek kârını saniyeler içinde öğren.
        </p>

        <div className={dividerClass} aria-hidden="true" />

        <DinamikPosPoweredStrip />

        <div className={dividerClass} aria-hidden="true" />

        <div className="flex justify-center">
          <div className="footer-social-proof-enter inline-flex max-w-full rounded-full bg-emerald-600/[0.09] px-4 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_2px_10px_rgba(15,23,42,0.04)]">
            <FooterSocialProofLine className="text-balance text-center text-[13px] font-medium leading-snug tracking-tight text-slate-700 sm:text-sm sm:font-semibold" />
          </div>
        </div>

        <Link
          href="/#hesaplama-basla"
          className="mt-2 inline-flex w-full max-w-[min(100%,380px)] items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 px-4 py-3.5 text-center text-[13px] font-semibold leading-snug text-white shadow-[0_4px_20px_rgba(5,150,105,0.32)] ring-1 ring-white/10 transition-all duration-300 ease-out will-change-transform hover:scale-[1.03] hover:shadow-[0_12px_40px_-4px_rgba(5,120,85,0.58),0_6px_18px_rgba(5,150,105,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:scale-[0.99] sm:mt-2.5 sm:px-5 sm:py-4 sm:text-base"
        >
          <span className="text-balance">{FOOTER_CTA_LABEL}</span>
        </Link>

        <ul className="mx-auto mt-3 flex max-w-[min(100%,420px)] list-none flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold leading-snug text-slate-700 sm:mt-3.5 sm:gap-x-5 sm:text-xs">
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="select-none text-[13px] sm:text-sm">
              ⚡
            </span>
            30 saniyede sonuç
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="select-none text-[13px] sm:text-sm">
              🔒
            </span>
            Veri cihazında kalır
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden className="select-none text-[13px] sm:text-sm">
              🆓
            </span>
            Ücretsiz &amp; kayıtsız
          </li>
        </ul>

        <h2 className="mt-6 text-[15px] font-semibold tracking-tight text-slate-900 sm:mt-7 sm:text-base">
          İş birliği &amp; destek
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-600 sm:text-[13px] sm:leading-relaxed">
          Takıldığın bir yer mi var? Yaz, birlikte çözelim.
        </p>
        <a
          href="mailto:info@pazarkar.com"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold tracking-tight text-[#0B1F3B] shadow-[0_1px_2px_rgba(15,33,56,0.05),0_4px_16px_rgba(15,33,56,0.07)] ring-1 ring-slate-200/90 transition duration-200 hover:bg-slate-50/90 hover:text-emerald-900 hover:ring-emerald-500/35 hover:shadow-[0_4px_16px_rgba(16,61,56,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600/80 sm:mt-3.5 sm:px-6 sm:py-3 sm:text-[15px]"
        >
          info@pazarkar.com
        </a>

        <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-slate-200/95 to-transparent sm:my-2.5" aria-hidden="true" />

        <nav aria-label="SEO rehber sayfaları">
          <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 sm:text-[13px]">
            Rehberler
          </p>
          <ul className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-1.5">
            <li>
              <Link href="/trendyol-kar-hesaplama" className={legalLinkClass}>
                Trendyol Kâr Hesaplama
              </Link>
            </li>
            <li>
              <Link href="/hepsiburada-komisyon-hesaplama" className={legalLinkClass}>
                Hepsiburada Komisyon Hesaplama
              </Link>
            </li>
            <li>
              <Link href="/pazaryeri-komisyon-oranlari" className={legalLinkClass}>
                Pazaryeri Komisyon Oranları
              </Link>
            </li>
          </ul>
        </nav>

        <div
          className="my-2 h-px w-full bg-gradient-to-r from-transparent via-slate-200/95 to-transparent sm:my-2.5"
          aria-hidden="true"
        />

        <nav aria-label="Yasal bağlantılar">
          <ul className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-1.5">
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
