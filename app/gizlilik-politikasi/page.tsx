import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Pazarkar gizlilik ve veri işleme bilgilendirmesi.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageShell title="Gizlilik Politikası">
      <p>
        Bu platform, kimliğinizi doğrudan tanımlayan kişisel verileri kalıcı olarak saklamak veya sunucuda
        hesaplama girdilerinizi kaydetmek üzere tasarlanmamıştır. Tarayıcınızda yürütülen hesaplamalar
        bilgilendirme amaçlıdır.
      </p>
      <p>
        Girilen maliyet, fiyat, komisyon ve diğer hesaplama alanlarına ilişkin veriler platform tarafından
        veritabanında saklanmaz; bu bilgiler yalnızca cihazınızda anlık hesaplama için kullanılır (tarayıcı
        oturumu süresince).
      </p>
      <p>
        Site kullanımına ilişkin istatistiksel veya analitik amaçlarla, kimlik bilgisi içermeyen anonim
        veya toplu veriler (örneğin sayfa görüntüleme, genel trafik) iş ortaklarımızın araçlarıyla
        işlenebilir. Bu tür veriler tek başına belirli bir kullanıcıyı tanımlamak için kullanılmaz.
      </p>
      <p>
        Politika güncellemeleri bu sayfada yayımlanır. Önemli değişikliklerde tarih bilgisi güncellenir.
      </p>
    </LegalPageShell>
  );
}
