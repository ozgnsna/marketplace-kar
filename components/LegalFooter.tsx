import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-8 text-center sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2 sm:px-6 lg:px-10">
        <Link
          href="/kullanim-sartlari"
          className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-[#0B1F3B] hover:decoration-[#0B1F3B]"
        >
          Kullanım Şartları
        </Link>
        <Link
          href="/gizlilik-politikasi"
          className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-[#0B1F3B] hover:decoration-[#0B1F3B]"
        >
          Gizlilik Politikası
        </Link>
        <Link
          href="/yasal-bilgilendirme"
          className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-[#0B1F3B] hover:decoration-[#0B1F3B]"
        >
          Yasal Bilgilendirme
        </Link>
      </div>
    </footer>
  );
}
