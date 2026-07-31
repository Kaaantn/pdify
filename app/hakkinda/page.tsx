import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında ve SSS — Pdify",
  description: "Pdify'ın nasıl çalıştığı, teknik yaklaşımı ve bilinen sınırları.",
};

const faqs = [
  {
    q: "Pdify nedir?",
    a: "PDF dosyalarındaki metni, görselleri ve metadata'yı doğrudan tarayıcınızda düzenlemenizi sağlayan ücretsiz bir araçtır. Dosyanız hiçbir zaman bir sunucuya yüklenmez.",
  },
  {
    q: "Nasıl 'temiz' bir çıktı üretiyorsunuz?",
    a: "Değiştirdiğiniz her metin veya görsel bölgesini, o bölgenin arka plan rengiyle örterek eski içeriği tamamen temizliyoruz; ardından yeni içeriği aynı konuma çiziyoruz. Dokunmadığınız her şey orijinal PDF'in vektör içeriği olarak birebir korunur — sayfa sıfırdan yeniden oluşturulmaz.",
  },
  {
    q: "Fontlar orijinaliyle birebir aynı mı kalıyor?",
    a: "Düzenlediğiniz metin, sayfadan tespit edilen serif / sans-serif / monospace ve kalın / italik özelliklerine göre en yakın standart fonta (Helvetica, Times, Courier ailesi) eşlenir. Orijinal gömülü fontun birebir aynısı kullanılmaz; standart iş belgelerinde görsel fark genellikle fark edilmeyecek kadar küçüktür.",
  },
  {
    q: "Hangi tür PDF'lerde en iyi sonucu alırım?",
    a: "Word'den export edilmiş standart iş belgeleri, sözleşmeler, formlar, CV'ler ve tek/çift kolonlu düzenler için tasarlandı. Bir metin kutusunu düzenlediğinizde değişiklik o kutunun sınırları içinde güncellenir (gerekirse kutu otomatik genişler).",
  },
  {
    q: "Karmaşık, çok kolonlu belgelerde tam bir 'reflow' (otomatik yeniden akış) var mı?",
    a: "Hayır. Bir paragrafa kelime eklendiğinde tüm sayfanın otomatik olarak yeniden akması, yalnızca Adobe gibi ağır ve ücretli motorlarla gerçekçi şekilde yapılabilir. Pdify, standart belgelerde metin kutusu bazlı düzenlemeye odaklanır.",
  },
  {
    q: "Taranmış (görüntü tabanlı) bir PDF'i düzenleyebilir miyim?",
    a: "Taranmış sayfalarda çıkarılabilir bir metin katmanı olmadığından, o sayfalarda metin düzenleme çalışmaz. Arayüz bu durumda size açıkça bir uyarı gösterir.",
  },
];

export default function HakkindaPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">Hakkında &amp; SSS</h1>
      <div className="mt-8 space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
