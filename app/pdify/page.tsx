"use client";

import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";
import { setPendingFile } from "@/lib/store/fileHandoff";
import { ByKaanTan } from "@/components/site/ByKaanTan";
import { FileText, Lock, Sparkles } from "lucide-react";

export default function PdifyHome() {
  const router = useRouter();

  function handleFile(file: File) {
    setPendingFile(file);
    router.push("/pdify/editor");
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="kt-gradient pointer-events-none absolute inset-x-0 top-0 h-96" />
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-20 text-center">
        <span className="mb-4 rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-foreground">
          %100 tarayıcıda çalışır — dosya sunucuya gitmez
        </span>
        <h1 className="max-w-2xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          PDF&apos;inizi Word gibi düzenleyin
        </h1>
        <ByKaanTan className="mt-3" />
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Herhangi bir PDF&apos;i yükleyin; her metni, her görseli ve metadata&apos;yı doğrudan
          düzenleyin. Sonuç, yeniden export edilmiş kadar temiz görünür. Ücretsiz, kayıt yok.
        </p>

        <div className="mt-10 w-full">
          <FileDropzone onFile={handleFile} />
        </div>

        <div className="mt-14 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <Feature
            icon={<FileText className="h-5 w-5" />}
            title="Gerçek içerik düzenleme"
            desc="Metne tıklayın, yazın; görseli taşıyın, değiştirin, silin."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Temiz çıktı"
            desc="Kapla ve yeniden çiz mimarisi, düzenleme izi bırakmaz."
          />
          <Feature
            icon={<Lock className="h-5 w-5" />}
            title="%100 gizlilik"
            desc="Dosyalarınız cihazınızdan hiç çıkmaz, sunucuya yüklenmez."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-divider bg-background p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent/40 text-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
