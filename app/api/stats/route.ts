import { NextResponse } from "next/server";
import { incrementCalcCount, readCalcCount } from "@/lib/counterStore";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Sayacı okur — artırmaz. Ana sayfadaki "X hesaplama yapıldı" için. */
export async function GET() {
  const count = await readCalcCount();
  return NextResponse.json({ count });
}

/**
 * Sayacı bir artırır. Kullanıcı gerçek bir hesaplama sonucuna ulaştığında
 * (ProfitCalculator) tetiklenir. Basit bir aynı-origin kontrolü dışında
 * korumasızdır — kritik bir veri değil, sadece bir güven göstergesi.
 */
export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? request.headers.get("referer") ?? "";
  if (origin && !origin.startsWith(SITE_URL) && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
    return NextResponse.json({ count: null }, { status: 403 });
  }
  const count = await incrementCalcCount();
  return NextResponse.json({ count });
}
