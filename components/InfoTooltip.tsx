"use client";

import { useId } from "react";

type InfoTooltipProps = {
  text: string;
  /** Erişilebilir kısa özet */
  label?: string;
};

/** Küçük (ⓘ) — hover / odakta ipucu */
export function InfoTooltip({ text, label = "Açıklama" }: InfoTooltipProps) {
  const tipId = useId();

  return (
    <span className="group/tooltip relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/20 focus-visible:ring-offset-2"
        aria-label={label}
        aria-describedby={tipId}
      >
        <span className="text-[15px] font-semibold leading-none" aria-hidden>
          ⓘ
        </span>
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-[60] mb-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 whitespace-pre-line rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-slate-600 opacity-0 shadow-lg ring-1 ring-slate-900/5 transition-opacity duration-150 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 max-sm:left-auto max-sm:right-0 max-sm:translate-x-0"
      >
        {text}
      </span>
    </span>
  );
}
