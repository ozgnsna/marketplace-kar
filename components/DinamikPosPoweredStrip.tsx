import Image from "next/image";

/** DinamikPOS dikey lockup — şeffaf PNG, light footer üzerinde. */
export function DinamikPosPoweredStrip() {
  return (
    <a
      href="https://dinamikpos.com.tr/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-col items-center gap-2 rounded-xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="DinamikPOS — dinamikpos.com.tr (yeni sekmede açılır)"
    >
      <Image
        src="/dinamikpos-logo.png"
        alt="DinamikPOS"
        width={200}
        height={200}
        sizes="152px"
        loading="lazy"
        className="h-auto w-[8.5rem] object-contain sm:w-[9.5rem]"
      />
      <span className="text-center text-xs text-slate-500 sm:text-[13px]">
        altyapısıyla güçlendirilmiştir
      </span>
    </a>
  );
}
