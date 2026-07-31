"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  className?: string;
}

export function FileDropzone({ onFile, className }: FileDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) return;
    onFile(file);
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors cursor-pointer",
        dragging
          ? "border-lime-400 bg-lime-50 dark:bg-lime-950/20"
          : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-300/40">
        <UploadCloud className="h-7 w-7 text-zinc-700 dark:text-zinc-200" />
      </div>
      <div>
        <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          PDF dosyanızı buraya sürükleyin
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          veya bilgisayarınızdan seçmek için tıklayın — dosya hiç sunucuya yüklenmez
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
