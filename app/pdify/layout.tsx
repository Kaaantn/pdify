import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pdify — Ücretsiz PDF Düzenleyici",
  description:
    "Herhangi bir PDF'i yükleyin; içindeki her metni, her görseli ve metadata'yı doğrudan düzenleyin. Tamamen ücretsiz, kayıt gerektirmez, dosyalarınız cihazınızdan hiç çıkmaz.",
};

export default function PdifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end gap-4 border-b border-divider px-6 py-2 text-xs text-muted-foreground">
        <Link href="/pdify/hakkinda" className="hover:text-foreground">
          Hakkında
        </Link>
        <Link href="/pdify/gizlilik" className="hover:text-foreground">
          Gizlilik
        </Link>
      </div>
      {children}
    </div>
  );
}
