import type { Metadata } from "next";
import { SharedResultView, sharedResultMetadata } from "@/components/SharedResultView";
import { decodeShareBreakdown } from "@/lib/shareBreakdown";

export const runtime = "edge";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function num(v: string | string[] | undefined, fallback = 0): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = s ? Number(s) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function str(v: string | string[] | undefined, fallback = ""): string {
  const s = Array.isArray(v) ? v[0] : v;
  return s ?? fallback;
}

/**
 * Eski paylaşım linkleri. Yeni paylaşımlar `/s/...` kısa adresini kullanır.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  return sharedResultMetadata({
    platform: str(sp.platform, "trendyol"),
    netProfit: num(sp.netProfit),
    marginPercent: num(sp.marginPercent),
    salePrice: num(sp.salePrice),
    breakdown: decodeShareBreakdown(str(sp.bd)),
  });
}

export default async function SonucPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <SharedResultView
      data={{
        platform: str(sp.platform, "trendyol"),
        netProfit: num(sp.netProfit),
        marginPercent: num(sp.marginPercent),
        salePrice: num(sp.salePrice),
        breakdown: decodeShareBreakdown(str(sp.bd)),
      }}
    />
  );
}
