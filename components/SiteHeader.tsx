import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const GUIDES = [
  { href: "/pazaryeri-kar-hesaplama", label: "Pazaryeri kâr hesaplama" },
  { href: "/trendyol-kar-hesaplama", label: "Trendyol kâr hesaplama" },
  { href: "/trendyol-komisyon-hesaplama", label: "Trendyol komisyon hesaplama" },
  { href: "/hepsiburada-komisyon-hesaplama", label: "Hepsiburada komisyon" },
  { href: "/shopier-komisyon-hesaplama", label: "Shopier komisyon" },
  { href: "/pazaryeri-komisyon-oranlari", label: "Komisyon oranları" },
] as const;

const navLinkClass = "text-sm font-medium text-slate-600 transition hover:text-[#0B1F3B]";

const dropdownItemClass =
  "block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-emerald-50/70 hover:text-emerald-800";

/**
 * Site genelinde sabit üst navigasyon.
 * Native <details>/<summary> ile açılıp kapanır — ek client JS gerekmez.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Pazarkar ana sayfa">
          <BrandLogo variant="inline" priority />
        </Link>

        {/* Masaüstü navigasyon */}
        <nav aria-label="Ana navigasyon" className="hidden items-center gap-6 md:flex">
          <Link href="/" className={navLinkClass}>
            Ana Sayfa
          </Link>

          <details className="group relative">
            <summary className={`${navLinkClass} flex cursor-pointer list-none items-center gap-1 [&::-webkit-details-marker]:hidden`}>
              Rehberler
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition group-open:rotate-180"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="absolute left-1/2 top-full z-40 mt-2 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-premium-lg">
              <ul className="grid gap-1">
                {GUIDES.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className={dropdownItemClass}>
                      {g.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          <Link href="/duyuru" className={navLinkClass}>
            Duyurular
          </Link>

          <a href="mailto:info@pazarkar.com" className={navLinkClass}>
            İletişim
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#hesaplama-basla"
            className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:inline-flex"
          >
            Hesapla
          </Link>

          {/* Mobil menü */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Menüyü aç"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 text-slate-600 [&::-webkit-details-marker]:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-premium-lg">
              <ul className="grid gap-1">
                <li>
                  <Link href="/" className={`${dropdownItemClass} font-medium`}>
                    Ana Sayfa
                  </Link>
                </li>
                {GUIDES.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className={dropdownItemClass}>
                      {g.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-slate-100 pt-1">
                  <Link href="/duyuru" className={dropdownItemClass}>
                    Duyurular
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@pazarkar.com" className={dropdownItemClass}>
                    İletişim
                  </a>
                </li>
                <li className="mt-1">
                  <Link
                    href="/#hesaplama-basla"
                    className="block rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Hesapla
                  </Link>
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
