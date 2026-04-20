import Image from "next/image";

export function DinamikPosPoweredStrip() {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-2.5">
      <a
        href="https://dinamikpos.com.tr/"
        target="_blank"
        rel="noopener noreferrer"
        className="group/dpos inline-flex rounded-2xl p-1 sm:p-1.5 outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        aria-label="Dinamik POS — dinamikpos.com.tr (yeni sekmede açılır)"
      >
        <div className="relative mx-auto aspect-square w-[min(100%,140px)] rounded-2xl shadow-[0_10px_28px_-6px_rgba(15,23,42,0.12)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform group-hover/dpos:scale-[1.02] group-hover/dpos:shadow-[0_14px_40px_-6px_rgba(16,185,129,0.42),0_10px_28px_-8px_rgba(15,23,42,0.14)] sm:w-[min(100%,156px)]">
          <Image
            src="/dinamikpos-logo.png"
            alt="DinamikPOS"
            width={500}
            height={500}
            priority={false}
            className="h-full w-full rounded-2xl border-0 object-contain object-center outline-none ring-0 [image-rendering:auto]"
          />
        </div>
      </a>
      <p className="text-center text-sm font-semibold leading-snug tracking-tight text-slate-800 sm:text-[15px] sm:leading-snug">
        DinamikPOS altyapısıyla güçlendirilmiştir
      </p>
    </div>
  );
}
