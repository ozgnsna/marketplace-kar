"use client";

import Image from "next/image";
import type { MarketplacePlatform } from "@/types/profit";

interface PlatformLogoCardsProps {
  value: MarketplacePlatform;
  onChange: (value: MarketplacePlatform) => void;
}

const cardBase =
  "group relative flex min-h-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-white px-1.5 py-1.5 sm:px-2 sm:py-2 transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1";

const cardIdle =
  "border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:scale-[1.02] hover:border-slate-300/95 hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)] active:scale-[0.99]";

const cardSelected =
  "border-emerald-500 shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_4px_18px_rgba(34,197,94,0.18)] ring-1 ring-emerald-400/40 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.18),0_6px_22px_rgba(34,197,94,0.24)] active:scale-[0.99]";

/** Tıklanabilir pazaryeri seçimi — tek satırda büyük logo, minimal kart. */
export function PlatformLogoCards({ value, onChange }: PlatformLogoCardsProps) {
  return (
    <div
      className="grid max-w-md grid-cols-2 gap-1.5 sm:gap-2"
      role="radiogroup"
      aria-label="Pazaryeri seçin"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === "trendyol"}
        onClick={() => onChange("trendyol")}
        className={`${cardBase} ${value === "trendyol" ? cardSelected : cardIdle}`}
      >
        <span className="sr-only">Trendyol</span>
        <Image
          src="/logos/trendyol.png"
          alt=""
          width={280}
          height={78}
          className="h-14 w-auto max-w-[min(100%,14rem)] object-contain object-center sm:h-16 md:h-[72px]"
          priority
        />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "hepsiburada"}
        onClick={() => onChange("hepsiburada")}
        className={`${cardBase} ${value === "hepsiburada" ? cardSelected : cardIdle}`}
      >
        <span className="sr-only">Hepsiburada</span>
        <Image
          src="/logos/hepsiburada.png"
          alt=""
          width={320}
          height={85}
          className="h-14 w-auto max-w-[min(100%,14.5rem)] object-contain object-center sm:h-16 md:h-[72px]"
        />
      </button>
    </div>
  );
}
