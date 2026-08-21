import Link from "next/link";

const GUIDES = [
  {
    href: "/pazaryeri-kar-hesaplama",
    label: "Pazaryeri kâr hesaplama",
    hint: "Net kâr adımları",
  },
  {
    href: "/trendyol-komisyon-hesaplama",
    label: "Trendyol komisyon hesaplama",
    hint: "Kategori + kesintiler",
  },
  {
    href: "/hepsiburada-komisyon-hesaplama",
    label: "Hepsiburada komisyon",
    hint: "HB kârlılık",
  },
  {
    href: "/n11-komisyon-hesaplama",
    label: "n11 komisyon",
    hint: "3719 kategori",
  },
  {
    href: "/shopier-komisyon-hesaplama",
    label: "Shopier komisyon",
    hint: "Ciro dilimi",
  },
] as const;

/** Ana sayfada SEO internal link bloğu. */
export function HomeGuideLinks() {
  return (
    <section
      aria-labelledby="home-guides-heading"
      className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-10"
    >
      <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-5 sm:px-6">
        <h2
          id="home-guides-heading"
          className="text-base font-semibold tracking-tight text-[#0B1F3B] sm:text-lg"
        >
          Pazaryeri kâr ve komisyon rehberleri
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Trendyol, Hepsiburada, n11 ve Shopier için komisyon / kâr hesaplama rehberleri.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="block rounded-xl border border-slate-200 px-3 py-3 transition hover:border-emerald-400/60 hover:bg-emerald-50/40"
              >
                <span className="block text-sm font-semibold text-[#0B1F3B]">{g.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{g.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
