import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Pdify",
  description: "Pdify hiçbir PDF dosyasını sunucuya yüklemez veya saklamaz. Tüm işlemler tarayıcınızda gerçekleşir.",
};

export default function GizlilikPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold text-foreground">Gizlilik Politikası</h1>
      <div className="prose mt-8 space-y-5 text-muted-foreground">
        <p>
          Pdify, yüklediğiniz hiçbir PDF dosyasını bir sunucuya göndermez, saklamaz veya
          kaydetmez. Uygulama tamamen istemci taraflı (tarayıcı içi) çalışır: dosya seçimi,
          ayrıştırma, düzenleme ve dışa aktarma işlemlerinin tamamı sizin cihazınızda
          gerçekleşir.
        </p>
        <p>
          Bunu tarayıcınızın geliştirici araçlarındaki Network (Ağ) sekmesinden
          doğrulayabilirsiniz: bir PDF yüklediğinizde, dosyanın içeriğini taşıyan hiçbir istek
          gönderilmez.
        </p>
        <p>
          Sitede herhangi bir kullanıcı hesabı, giriş sistemi veya dosya geçmişi
          bulunmamaktadır. Kapattığınız anda, oturumdaki tüm veriler tarayıcı belleğinden
          silinir.
        </p>
        <p>
          Temel, gizliliğe duyarlı analiz (sayfa görüntüleme sayısı gibi) dışında hiçbir kişisel
          veri toplanmaz veya üçüncü taraflarla paylaşılmaz.
        </p>
      </div>
    </div>
  );
}
