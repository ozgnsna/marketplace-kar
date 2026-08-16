import { formatDataFreshnessLabel } from "@/lib/dataFreshness";

/** Komisyon verisinin güncelliğini gösteren küçük güven rozeti. */
export function DataFreshnessBadge({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200/80 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
      Komisyon oranları güncel · {formatDataFreshnessLabel()}
    </p>
  );
}
