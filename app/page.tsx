"use client";

import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";
import { setPendingFile } from "@/lib/store/fileHandoff";
import { FileText, Lock, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

  function handleFile(file: File) {
    setPendingFile(file);
    router.push("/editor");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-20 text-center">
        <span className="mb-4 rounded-full bg-lime-300/40 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-200">
          %100 tarayıcıda çalışır — dosya sunucuya gitmez
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
          PDF&apos;inizi Word gibi düzenleyin
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-lime-300/40 text-zinc-700 dark:text-zinc-200">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
