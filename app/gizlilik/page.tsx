import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Pdify",
  description: "Pdify hiçbir PDF dosyasını sunucuya yüklemez veya saklamaz. Tüm işlemler tarayıcınızda gerçekleşir.",
};

export default function GizlilikPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">Gizlilik Politikası</h1>
      <div className="prose prose-zinc mt-8 space-y-5 text-zinc-600 dark:text-zinc-400">
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
