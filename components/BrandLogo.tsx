import Image from "next/image";

type BrandLogoProps = {
  /** hero: üst vitrin; inline: form kartı üst şeridi */
  variant?: "hero" | "inline";
  className?: string;
  /** LCP için hero’da true */
  priority?: boolean;
};

export function BrandLogo({ variant = "inline", className = "", priority = false }: BrandLogoProps) {
  const sizeClass =
    variant === "hero"
      ? "h-auto w-[min(260px,78vw)] max-w-[280px]"
      : "h-9 w-auto max-w-[200px] sm:h-10 sm:max-w-[220px]";

  return (
    <Image
      src="/pazarkar-logo.png"
      alt="pazarkar — Doğru fiyat, gerçek kâr"
      width={560}
      height={220}
      priority={priority}
      className={`object-contain object-center ${sizeClass} ${className}`}
    />
  );
}
