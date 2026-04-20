"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CommissionCategoryRow } from "@/data/commissionCategories";
import { findCommissionCategory, getCategoriesForPlatform } from "@/data/commissionCategories";
import {
  DEFAULT_SEARCH_LIMIT,
  searchCommissionCategories,
} from "@/lib/searchCommissionCategories";
import type { MarketplacePlatform } from "@/types/profit";
import { stripCommissionPathNoise } from "@/lib/formatCategoryPathForDisplay";

type CategorySearchComboboxProps = {
  platform: MarketplacePlatform;
  /** Seçili kategori id (ty-* / hb-*) */
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
};

export function CategorySearchCombobox({
  platform,
  value,
  onValueChange,
  className = "",
}: CategorySearchComboboxProps) {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 0 });

  const rows = useMemo(() => getCategoriesForPlatform(platform), [platform]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const filtered = useMemo(
    () => searchCommissionCategories(rows, query, { limit: DEFAULT_SEARCH_LIMIT }),
    [rows, query]
  );

  const showEmpty = open && query.trim().length > 0 && filtered.length === 0;

  /** Pazaryeri değişince arama kutusunu sıfırla */
  useEffect(() => {
    setQuery("");
  }, [platform]);

  /** Dışarıdan id atandığında (ör. demo) giriş metnini breadcrumb ile senkronla */
  useEffect(() => {
    if (!value.trim()) return;
    const entry = findCommissionCategory(platform, value);
    if (entry) setQuery(stripCommissionPathNoise(entry.fullPath));
  }, [value, platform]);

  useEffect(() => {
    setHighlighted(0);
  }, [query, platform, filtered.length]);

  const updatePanelPosition = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPanelPos({
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
  }, [open, updatePanelPosition, query, filtered.length]);

  useEffect(() => {
    if (!open) return;
    function onScrollOrResize() {
      updatePanelPosition();
    }
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const pick = useCallback(
    (row: CommissionCategoryRow) => {
      onValueChange(row.id);
      setQuery(stripCommissionPathNoise(row.fullPath));
      setOpen(false);
      inputRef.current?.blur();
    },
    [onValueChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    setOpen(true);
    if (value) {
      onValueChange("");
    }
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputBlur = () => {
    window.setTimeout(() => setOpen(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      const row = filtered[highlighted];
      if (row) pick(row);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!listRef.current || !open) return;
    const el = listRef.current.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open, filtered]);

  const dropdownOpen = open && (filtered.length > 0 || showEmpty);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label htmlFor={`${baseId}-input`} className="mb-2 block text-sm font-medium text-slate-700">
        Kategori veya ürün tipi ara
      </label>
      <input
        ref={inputRef}
        id={`${baseId}-input`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && filtered[highlighted] ? `${baseId}-opt-${filtered[highlighted].id}` : undefined
        }
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        placeholder="Örn: küpe, barkod yazıcı, pos çantası"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[52px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-[#0B1F3B] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
      />

      {dropdownOpen ? (
        <div
          className="pointer-events-auto fixed z-[400]"
          style={{
            top: panelPos.top,
            left: panelPos.left,
            width: panelPos.width,
          }}
        >
          {open && filtered.length > 0 ? (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              className="max-h-[min(18rem,50vh)] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white py-1 shadow-xl ring-1 ring-slate-900/5"
            >
              {filtered.map((row, i) => (
                <li
                  key={row.id}
                  id={`${baseId}-opt-${row.id}`}
                  role="option"
                  aria-selected={i === highlighted}
                  className={`cursor-pointer px-4 py-2.5 text-sm text-slate-800 transition ${
                    i === highlighted ? "bg-emerald-50 text-emerald-950" : "hover:bg-slate-50"
                  }`}
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(row);
                  }}
                >
                  <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-[#0B1F3B] line-clamp-3">
                      {stripCommissionPathNoise(row.fullPath)}
                    </span>
                    <span className="shrink-0 self-start rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700 ring-1 ring-slate-200/80">
                      {row.commissionLabel ?? `%${row.commissionRate}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {open && showEmpty ? (
            <p
              className="rounded-2xl border border-amber-100 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-lg"
              role="status"
            >
              Kategori bulunamadı, komisyonu manuel girebilirsiniz.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
