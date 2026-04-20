import Link from "next/link";
import { PoweredByDinamikPos } from "@/components/PoweredByDinamikPos";

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/95">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-slate-600/70">
          Pazarkar, e-ticaret satıcılarının zarar etmeden büyümesi için tasarlanmıştır.
        </p>

        <div className="mt-8 sm:mt-10">
          <PoweredByDinamikPos />
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-600/65">Geri bildirim ve iş birlikleri için</p>
          <a
            href="mailto:info@pazarkar.com"
            className="mt-2 inline-block text-sm font-medium text-slate-700/90 underline decoration-slate-400/60 underline-offset-[3px] transition hover:text-[#0B1F3B] hover:decoration-[#0B1F3B]/50"
          >
            info@pazarkar.com
          </a>
        </div>

        <nav
          className="mt-10 flex flex-col items-center gap-3 border-t border-slate-200/80 pt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2"
          aria-label="Yasal bağlantılar"
        >
          <Link
            href="/kullanim-sartlari"
            className="text-sm text-slate-600/60 underline decoration-slate-300/80 underline-offset-2 transition hover:text-slate-800 hover:decoration-slate-500"
          >
            Kullanım Şartları
          </Link>
          <Link
            href="/gizlilik-politikasi"
            className="text-sm text-slate-600/60 underline decoration-slate-300/80 underline-offset-2 transition hover:text-slate-800 hover:decoration-slate-500"
          >
            Gizlilik Politikası
          </Link>
          <Link
            href="/yasal-bilgilendirme"
            className="text-sm text-slate-600/60 underline decoration-slate-300/80 underline-offset-2 transition hover:text-slate-800 hover:decoration-slate-500"
          >
            Yasal Bilgilendirme
          </Link>
        </nav>
      </div>
    </footer>
  );
}
