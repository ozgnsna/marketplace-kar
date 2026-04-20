"use client";

import Image from "next/image";
import type { MarketplacePlatform } from "@/types/profit";

interface PlatformLogoCardsProps {
  value: MarketplacePlatform;
  onChange: (value: MarketplacePlatform) => void;
}

/** Tıklanabilir pazaryeri seçimi (resmi logolar). */
export function PlatformLogoCards({ value, onChange }: PlatformLogoCardsProps) {
  return (
    <div
      className="grid max-w-lg grid-cols-2 gap-2.5 sm:gap-4"
      role="radiogroup"
      aria-label="Pazaryeri seçin"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "trendyol"}
        onClick={() => onChange("trendyol")}
        className={`group relative flex min-h-[92px] items-center justify-center overflow-hidden rounded-3xl border-2 px-2 py-4 sm:min-h-[80px] sm:px-3 sm:py-3.5 shadow-premium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
          value === "trendyol"
            ? "border-orange-500 ring-2 ring-orange-400/40"
            : "border-orange-100 bg-white hover:border-orange-200"
        }`}
      >
        <span className="sr-only">Trendyol</span>
        <Image
          src="/logos/trendyol.png"
          alt=""
          width={200}
          height={56}
          className="h-11 w-auto max-w-[min(100%,13rem)] object-contain object-center sm:h-11 md:h-12"
          priority
        />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "hepsiburada"}
        onClick={() => onChange("hepsiburada")}
        className={`group relative flex min-h-[92px] items-center justify-center overflow-hidden rounded-3xl border-2 px-2 py-4 sm:min-h-[80px] sm:px-3 sm:py-3.5 shadow-premium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 ${
          value === "hepsiburada"
            ? "border-violet-600 ring-2 ring-violet-400/40"
            : "border-violet-100 bg-white hover:border-violet-200"
        }`}
      >
        <span className="sr-only">Hepsiburada</span>
        <Image
          src="/logos/hepsiburada.png"
          alt=""
          width={240}
          height={64}
          className="h-11 w-auto max-w-[min(100%,14rem)] object-contain object-center sm:h-11 md:h-12"
        />
      </button>
    </div>
  );
}
