import Image from "next/image";

type BrandLogoProps = {
  /** hero: üst vitrin; inline: form kartı üst şeridi */
  variant?: "hero" | "inline";
  className?: string;
  /** LCP için hero’da true */
  priority?: boolean;
  /**
   * Koyu hero zeminde PNG’deki beyaz kutuyu görsel olarak eritmek için
   * (multiply: beyaz alan arka plan rengini gösterir).
   */
  knockoutWhiteOnDark?: boolean;
  /**
   * inline + beyaz kart: PNG’deki beyaz zemin kartla birleşip sırıtmasın diye
   * hafif nötr plaka veya hero ile uyumlu koyu şerit.
   */
  plate?: "none" | "soft" | "brand";
};

export function BrandLogo({
  variant = "inline",
  className = "",
  priority = false,
  plate = "none",
  knockoutWhiteOnDark = false,
}: BrandLogoProps) {
  const sizeClass =
    variant === "hero"
      ? "h-auto w-[min(220px,72vw)] max-w-[240px] sm:max-w-[260px]"
      : "h-9 w-auto max-w-[200px] sm:h-10 sm:max-w-[220px]";

  const blendClass =
    variant === "hero" && knockoutWhiteOnDark
      ? "mix-blend-multiply contrast-[1.08] saturate-[1.06]"
      : "";

  const img = (
    <Image
      src="/pazarkar-logo.png"
      alt="pazarkar — Doğru fiyat, gerçek kâr"
      width={560}
      height={220}
      priority={priority}
      className={`object-contain object-center ${sizeClass} ${blendClass} ${className}`}
    />
  );

  if (variant !== "inline" || plate === "none") {
    return img;
  }

  if (plate === "brand") {
    return (
      <span className="inline-flex rounded-2xl bg-[linear-gradient(155deg,#0f2138_0%,#143d38_52%,#0f3028_100%)] px-7 py-3.5 shadow-[0_4px_20px_rgba(15,33,56,0.2)] ring-1 ring-white/10 sm:px-8 sm:py-4">
        {img}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 px-6 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-slate-200/90 sm:px-7 sm:py-3.5">
      {img}
    </span>
  );
}
