import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SharedResultView, sharedResultMetadata, type SharedResultData } from "@/components/SharedResultView";
import { decodeShareToken, parseShareRoute } from "@/lib/shareBreakdown";

export const runtime = "edge";

type PageParams = Promise<{ slug: string[] }>;

function readShare(slug: string[]): SharedResultData | null {
  if (slug.length === 1) return decodeShareToken(slug[0]);
  if (slug.length === 5) {
    return parseShareRoute({
      platform: slug[0],
      profit: slug[1],
      margin: slug[2],
      sale: slug[3],
      details: slug[4],
    });
  }
  return null;
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const data = readShare((await params).slug);
  if (!data) return { robots: { index: false, follow: false } };
  return sharedResultMetadata(data);
}

export default async function ShortSharePage({ params }: { params: PageParams }) {
  const data = readShare((await params).slug);
  if (!data) notFound();
  return <SharedResultView data={data} />;
}
