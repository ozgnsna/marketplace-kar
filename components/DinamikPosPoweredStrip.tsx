import Image from "next/image";

/** İnce “powered by” şeridi — kart/gölge yok. */
export function DinamikPosPoweredStrip() {
  return (
    <a
      href="https://dinamikpos.com.tr/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-lg px-1 py-1 text-slate-600 outline-none transition hover:text-[#0B1F3B] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="Dinamik POS — dinamikpos.com.tr (yeni sekmede açılır)"
    >
      <Image
        src="/dinamikpos-logo.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-md object-contain"
      />
      <span className="text-left text-xs leading-snug sm:text-[13px]">
        <span className="block font-medium text-slate-800">DinamikPOS</span>
        <span className="block text-slate-500">altyapısıyla güçlendirilmiştir</span>
      </span>
    </a>
  );
}
