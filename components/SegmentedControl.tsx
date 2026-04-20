"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];
  ariaLabel: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const skipBumpRef = useRef(true);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    if (skipBumpRef.current) {
      skipBumpRef.current = false;
      return;
    }
    el.classList.remove("segment-bump");
    void el.offsetWidth;
    el.classList.add("segment-bump");
    const t = window.setTimeout(() => {
      el.classList.remove("segment-bump");
    }, 130);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={`flex w-full min-w-0 rounded-full border border-slate-200/90 bg-slate-100/95 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] ${className}`}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              const i = options.findIndex((o) => o.value === value);
              const next =
                e.key === "ArrowRight"
                  ? Math.min(i + 1, options.length - 1)
                  : Math.max(i - 1, 0);
              if (next !== i) onChange(options[next].value);
            }}
            className={`relative flex min-h-[44px] min-w-0 flex-1 touch-manipulation select-none items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 sm:px-4 ${
              selected
                ? "bg-[#0f172a] text-white shadow-sm"
                : "bg-transparent text-[#64748b] hover:bg-slate-200/55 hover:text-slate-700"
            }`}
          >
            {opt.icon ? (
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px] ${
                  selected ? "text-white" : "text-[#64748b]"
                }`}
                aria-hidden
              >
                {opt.icon}
              </span>
            ) : null}
            <span className="truncate text-center leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Küçük para birimi — banknot çerçevesi + sembol */
export function IconLira(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden>
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="11"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.65}
      />
      <text
        x="12"
        y="14.75"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight={700}
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        ₺
      </text>
    </svg>
  );
}

export function IconDollar(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden>
      <rect
        x="3.5"
        y="6.5"
        width="17"
        height="11"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.65}
      />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="11"
        fontWeight={700}
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  );
}
