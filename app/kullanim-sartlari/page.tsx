import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "Pazarkar kullanım şartları ve sorumluluk reddi.",
};

export default function KullanimSartlariPage() {
  return (
    <LegalPageShell title="Kullanım Şartları">
      <p>
        Bu sitede sunulan hesaplama araçları ve sonuçlar yalnızca bilgilendirme amaçlıdır. Gösterilen tutarlar,
        oranlar ve tahminler kesin mali sonuç veya bağlayıcı teklif olarak yorumlanamaz.
      </p>
      <p>
        Pazarkar (bu platform), hesaplama sonuçlarının doğruluğu, güncelliği veya belirli bir işlem veya
        dönem için geçerliliği konusunda hiçbir garanti vermez. Platformda yer alan verilerden kaynaklanan
        doğrudan veya dolaylı zararlardan, kar kaybından veya üçüncü kişilerle olan uyuşmazlıklardan
        sorumluluk kabul etmez.
      </p>
      <p>
        Satış fiyatı, komisyon, kargo, vergi ve diğer tüm ticari kararlar yalnızca kullanıcının kendi
        sorumluluğundadır. Nihai değerlendirme için pazaryeri sözleşmelerinizi, güncel tarifeleri ve
        gerektiğinde mali müşavir veya hukuk danışmanınızı dikkate almanız önerilir.
      </p>
      <p>
        Bu şartları kullanmaya devam ederek yukarıdaki hususları okuduğunuzu ve kabul ettiğinizi beyan
        etmiş olursunuz.
      </p>
    </LegalPageShell>
  );
}
