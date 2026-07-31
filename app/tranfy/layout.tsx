import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tranfy — Ücretsiz YouTube Transcript Aracı",
  description:
    "YouTube videosunun altyazısını saniyeli veya düz metin olarak ücretsiz çıkarın. Video indirme yok, sadece caption verisi.",
};

export default function TranfyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
