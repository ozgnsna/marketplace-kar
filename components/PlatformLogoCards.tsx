"use client";

import Image from "next/image";
import type { MarketplacePlatform } from "@/types/profit";

interface PlatformLogoCardsProps {
  value: MarketplacePlatform;
  onChange: (value: MarketplacePlatform) => void;
}

const cardBase =
  "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 bg-white p-3 transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

const cardIdle =
  "min-h-[76px] border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:scale-[1.02] hover:border-slate-300/95 hover:shadow-[0_6px_20px_rgba(15,23,42,0.09)] active:scale-[0.99]";

const cardSelected =
  "min-h-[76px] border-emerald-500 shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_6px_24px_rgba(34,197,94,0.22)] ring-2 ring-emerald-400/35 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.2),0_8px_28px_rgba(34,197,94,0.28)] active:scale-[0.99]";

/** Tıklanabilir pazaryeri seçimi — tek satırda büyük logo, minimal kart. */
export function PlatformLogoCards({ value, onChange }: PlatformLogoCardsProps) {
  return (
    <div
      className="grid max-w-lg grid-cols-2 gap-3 sm:gap-3.5"
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
          width={200}
          height={56}
          className="h-12 w-auto max-w-[min(100%,11.5rem)] object-contain object-center sm:h-[52px]"
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
          width={240}
          height={64}
          className="h-12 w-auto max-w-[min(100%,12rem)] object-contain object-center sm:h-[52px]"
        />
      </button>
    </div>
  );
}
