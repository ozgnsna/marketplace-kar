import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Ana sayfada sosyal kanıt bloğu. Gerçek yorum eklenene kadar (bkz. data/testimonials.ts)
 * hiçbir şey render etmez — sahte/placeholder yorum göstermez.
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-10"
    >
      <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-5 sm:px-6">
        <h2
          id="testimonials-heading"
          className="text-base font-semibold tracking-tight text-[#0B1F3B] sm:text-lg"
        >
          Satıcılar ne diyor?
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li
              key={`${t.name}-${t.quote.slice(0, 12)}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-4"
            >
              <p className="text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold text-[#0B1F3B]">{t.name}</p>
              <p className="text-xs text-slate-500">
                {t.location} · {t.sector}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
