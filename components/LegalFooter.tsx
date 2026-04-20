import Link from "next/link";
import { PoweredByDinamikPos } from "@/components/PoweredByDinamikPos";

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-slate-50/95">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-700 sm:text-[15px] sm:leading-relaxed">
          Pazarkar, e-ticaret satıcılarının zarar etmeden büyümesi için geliştirilmiştir.
        </p>

        <div className="mt-12 sm:mt-14">
          <PoweredByDinamikPos />
        </div>

        <div className="mt-12 sm:mt-14">
          <p className="text-sm font-medium text-slate-600">Geri bildirim ve iş birlikleri:</p>
          <a
            href="mailto:info@pazarkar.com"
            className="mt-2 inline-block text-[15px] font-medium text-[#0B1F3B] underline decoration-slate-400/80 underline-offset-[4px] transition hover:text-emerald-700 hover:decoration-emerald-600/70"
          >
            info@pazarkar.com
          </a>
        </div>

        <nav
          className="mt-14 flex flex-col items-center gap-3 border-t border-slate-200/90 pt-14 sm:mt-16 sm:pt-16 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-2"
          aria-label="Yasal bağlantılar"
        >
          <Link
            href="/kullanim-sartlari"
            className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
          >
            Kullanım Şartları
          </Link>
          <Link
            href="/gizlilik-politikasi"
            className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
          >
            Gizlilik Politikası
          </Link>
          <Link
            href="/yasal-bilgilendirme"
            className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-900 hover:decoration-slate-500"
          >
            Yasal Bilgilendirme
          </Link>
        </nav>
      </div>
    </footer>
  );
}
