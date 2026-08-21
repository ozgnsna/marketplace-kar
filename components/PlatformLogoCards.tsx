"use client";

import Image from "next/image";
import type { MarketplacePlatform } from "@/types/profit";

interface PlatformLogoCardsProps {
  value: MarketplacePlatform;
  onChange: (value: MarketplacePlatform) => void;
}

const cardBase =
  "group relative flex min-h-[4.5rem] cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border bg-white px-2 py-2 transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 sm:min-h-[5.25rem]";

const cardIdle =
  "border-slate-200/90 shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:scale-[1.02] hover:border-slate-300/95 hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)] active:scale-[0.99]";

const cardSelected =
  "border-emerald-500 shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_4px_18px_rgba(34,197,94,0.18)] ring-1 ring-emerald-400/40 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.18),0_6px_22px_rgba(34,197,94,0.24)] active:scale-[0.99]";

const PLATFORMS: {
  id: MarketplacePlatform;
  label: string;
  src: string;
  width: number;
  height: number;
}[] = [
  { id: "trendyol", label: "Trendyol", src: "/logos/trendyol.png", width: 280, height: 78 },
  { id: "hepsiburada", label: "Hepsiburada", src: "/logos/hepsiburada.png", width: 320, height: 85 },
  { id: "n11", label: "n11", src: "/logos/n11.jpg", width: 320, height: 180 },
  { id: "pttavm", label: "PttAVM", src: "/logos/pttavm.png", width: 320, height: 180 },
  { id: "shopier", label: "Shopier", src: "/logos/shopier.png", width: 400, height: 240 },
];

/** Tıklanabilir pazaryeri seçimi — logo + okunaklı etiket. */
export function PlatformLogoCards({ value, onChange }: PlatformLogoCardsProps) {
  return (
    <div
      className="grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3"
      role="radiogroup"
      aria-label="Pazaryeri seçin"
    >
      {PLATFORMS.map((p) => {
        const selected = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={p.label}
            onClick={() => onChange(p.id)}
            className={`${cardBase} ${selected ? cardSelected : cardIdle}`}
          >
            <span className="flex h-10 w-full items-center justify-center sm:h-12">
              <Image
                src={p.src}
                alt={p.label}
                width={p.width}
                height={p.height}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 140px"
                className="max-h-full w-auto max-w-[95%] object-contain object-center"
                /* Fold altı: priority/preload LCP (H1) ile bant genişliği yarışmasın */
                loading="lazy"
              />
            </span>
            <span
              className={`text-[11px] font-semibold leading-none sm:text-xs ${
                selected ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
