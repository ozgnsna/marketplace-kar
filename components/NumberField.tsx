"use client";

import type { ReactNode } from "react";
import { useState } from "react";

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  /** İleride adım kısıtı için ayrıldı; şu an metin girişi kullanılıyor */
  step?: string;
  min?: number;
  hint?: string;
  /** value 0 iken boş göster; placeholder görünsün (ör. fiyat alanları) */
  showEmptyWhenZero?: boolean;
  placeholder?: string;
  /** Etiket satırının sağında (ör. bilgi ikonu) */
  labelAccessory?: ReactNode;
}

function normalizeDecimalInput(raw: string): string {
  return raw.replace(/[^\d.,-]/g, "").replace(",", ".");
}

function parseCommitted(normalized: string): number {
  if (normalized === "" || normalized === "-" || normalized === ".") return 0;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

/** Kontrollü number inputta 0 iken yazılan rakamın önüne 0 yapışması / "02" ara durumları için metin + taslak modu */
export function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  min,
  hint,
  showEmptyWhenZero,
  placeholder,
  labelAccessory,
}: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const display =
    draft !== null
      ? draft
      : Number.isFinite(value) &&
          !(showEmptyWhenZero && value === 0)
        ? String(value).replace(".", ",")
        : "";

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <label htmlFor={id} className="min-w-0 flex-1 text-sm font-medium text-slate-700">
          {label}
        </label>
        {labelAccessory ? (
          <span className="flex shrink-0 items-center gap-1">{labelAccessory}</span>
        ) : null}
      </div>
      <div className="relative flex items-center">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={display}
          onFocus={() => {
            if (Number.isFinite(value) && value === 0) {
              setDraft("");
            } else {
              setDraft(Number.isFinite(value) ? String(value).replace(".", ",") : "");
            }
          }}
          onChange={(e) => {
            let raw = e.target.value;
            raw = raw.replace(/[^\d.,-]/g, "");
            if (raw.includes("-") && raw.indexOf("-") > 0) {
              raw = raw.replace(/-/g, "");
            }
            setDraft(raw);

            const norm = normalizeDecimalInput(raw);
            if (norm === "" || norm === "-" || norm === ".") {
              onChange(0);
              return;
            }
            const n = parseFloat(norm);
            if (Number.isFinite(n)) {
              if (typeof min === "number" && n < min) {
                onChange(min);
                return;
              }
              onChange(n);
            }
          }}
          onBlur={() => {
            if (draft !== null) {
              const norm = normalizeDecimalInput(draft);
              let n = parseCommitted(norm);
              if (typeof min === "number" && n < min) n = min;
              onChange(n);
            }
            setDraft(null);
          }}
          className="w-full min-h-[52px] rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-base text-[#0B1F3B] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
