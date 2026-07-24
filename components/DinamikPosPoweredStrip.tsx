import Image from "next/image";

/** DinamikPOS dikey lockup — koyu plaka (logo siyah zemin için tasarlandı). */
export function DinamikPosPoweredStrip() {
  return (
    <a
      href="https://dinamikpos.com.tr/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-col items-center gap-2 rounded-xl outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="DinamikPOS — dinamikpos.com.tr (yeni sekmede açılır)"
    >
      <span className="inline-flex rounded-xl bg-black p-3 ring-1 ring-slate-800/80 transition group-hover:ring-slate-600 sm:p-3.5">
        <Image
          src="/dinamikpos-logo.png"
          alt="DinamikPOS"
          width={160}
          height={160}
          className="h-auto w-[7.5rem] object-contain sm:w-[8.5rem]"
        />
      </span>
      <span className="text-center text-xs text-slate-500 sm:text-[13px]">
        altyapısıyla güçlendirilmiştir
      </span>
    </a>
  );
}
