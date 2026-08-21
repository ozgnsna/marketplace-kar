import Link from "next/link";

export type GuideLink = {
  href: string;
  label: string;
};

const DEFAULT_GUIDES: GuideLink[] = [
  { href: "/pazaryeri-kar-hesaplama", label: "Pazaryeri kâr hesaplama" },
  { href: "/trendyol-komisyon-hesaplama", label: "Trendyol komisyon hesaplama" },
  { href: "/trendyol-kar-hesaplama", label: "Trendyol kâr hesaplama" },
  {
    href: "/hepsiburada-komisyon-hesaplama",
    label: "Hepsiburada komisyon hesaplama",
  },
  { href: "/n11-komisyon-hesaplama", label: "n11 komisyon hesaplama" },
  { href: "/shopier-komisyon-hesaplama", label: "Shopier komisyon hesaplama" },
  { href: "/pazaryeri-komisyon-oranlari", label: "Pazaryeri komisyon oranları" },
  { href: "/trendyol-giyim-komisyon-hesaplama", label: "Trendyol giyim komisyonu" },
  { href: "/trendyol-elektronik-komisyon-hesaplama", label: "Trendyol elektronik komisyonu" },
  { href: "/hepsiburada-giyim-komisyon-hesaplama", label: "Hepsiburada giyim komisyonu" },
  { href: "/hepsiburada-elektronik-komisyon-hesaplama", label: "Hepsiburada elektronik komisyonu" },
];

type RelatedGuidesProps = {
  currentPath: string;
  title?: string;
};

export function RelatedGuides({
  currentPath,
  title = "İlgili rehberler",
}: RelatedGuidesProps) {
  const links = DEFAULT_GUIDES.filter((g) => g.href !== currentPath);
  return (
    <nav
      aria-label={title}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <p className="text-sm font-semibold text-[#0B1F3B]">{title}</p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
        {links.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="text-sm font-medium text-emerald-800 underline-offset-2 hover:underline"
            >
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
