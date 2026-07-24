import Link from "next/link";

type GuideCtaProps = {
  title: string;
  href?: string;
  buttonLabel?: string;
};

export function GuideCta({
  title,
  href = "/#hesaplama-basla",
  buttonLabel = "Ücretsiz hesaplama aracına git",
}: GuideCtaProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-sm font-medium text-[#0B1F3B]">{title}</p>
      <Link
        href={href}
        className="mt-3 inline-flex rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#122b4f]"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}
