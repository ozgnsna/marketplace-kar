import type { Metadata } from "next";
import { SharedResultView, sharedResultMetadata } from "@/components/SharedResultView";
import { parseShareRoute } from "@/lib/shareBreakdown";

export const runtime = "edge";

type PageParams = Promise<{
  platform: string;
  profit: string;
  margin: string;
  sale: string;
  details: string;
}>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const data = parseShareRoute(await params);
  return sharedResultMetadata(data);
}

export default async function ShortSharePage({ params }: { params: PageParams }) {
  const data = parseShareRoute(await params);
  return <SharedResultView data={data} />;
}
