import Image from "next/image";

/** Düz yerleşim: “Powered by” + DinamikPos logosu (kurumsal, reklam hissi vermez). */
export function PoweredByDinamikPos() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Powered by
      </p>
      <div className="mt-4 flex justify-center">
        <Image
          src="/dinamikpos-logo.png"
          alt="DinamikPos"
          width={440}
          height={144}
          className="h-[52px] w-auto max-w-[min(280px,88vw)] object-contain object-center sm:h-[68px] md:h-[76px] md:max-w-[min(320px,90vw)]"
        />
      </div>
    </div>
  );
}
