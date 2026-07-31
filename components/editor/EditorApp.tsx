"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { EditorProvider, useEditor } from "@/components/editor/EditorContext";
import { Toolbar } from "@/components/editor/Toolbar";
import { MetadataPanel } from "@/components/editor/MetadataPanel";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { PageCanvas } from "@/components/editor/PageCanvas";
import { parsePdfFile } from "@/lib/parse/parseDocument";
import { buildEditedPdf } from "@/lib/export/buildPdf";
import { takePendingFile } from "@/lib/store/fileHandoff";
import { Button } from "@/components/ui/button";

function EditorInner() {
  const { state, dispatch } = useEditor();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [showMetadata, setShowMetadata] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const file = takePendingFile();
    if (!file) {
      router.replace("/");
      return;
    }
    dispatch({ type: "SET_PROGRESS", progress: { done: 0, total: 1 } });
    parsePdfFile(file, (done, total) => dispatch({ type: "SET_PROGRESS", progress: { done, total } }))
      .then((doc) => {
        dispatch({ type: "SET_DOC", doc });
        dispatch({ type: "SET_PROGRESS", progress: null });
      })
      .catch((err) => {
        console.error(err);
        setError("Bu PDF ayrıştırılamadı. Dosya bozuk olabilir veya şifre korumalı olabilir.");
        dispatch({ type: "SET_PROGRESS", progress: null });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDownload() {
    if (!state.doc) return;
    setDownloading(true);
    try {
      const bytes = await buildEditedPdf(state.doc);
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = state.doc.fileName.replace(/\.pdf$/i, "");
      a.download = `${base}-duzenlendi.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("PDF oluşturulurken bir hata oluştu.");
    } finally {
      setDownloading(false);
    }
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-300">{error}</p>
        <Button onClick={() => router.replace("/")}>Ana sayfaya dön</Button>
      </div>
    );
  }

  if (!state.doc) {
    const progress = state.progress;
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-400 border-t-transparent" />
        <p className="text-sm text-zinc-500">
          {progress ? `Sayfalar ayrıştırılıyor: ${progress.done}/${progress.total}` : "PDF yükleniyor..."}
        </p>
      </div>
    );
  }

  const visiblePages = state.doc.pageOrder
    .map((idx) => state.doc!.pages.find((p) => p.index === idx))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.deleted);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Toolbar
        zoom={zoom}
        onZoomChange={setZoom}
        showMetadata={showMetadata}
        onToggleMetadata={() => setShowMetadata((v) => !v)}
        onDownload={handleDownload}
        downloading={downloading}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto bg-zinc-100 px-4 py-8 dark:bg-zinc-900">
          <div className="mx-auto flex max-w-fit flex-col gap-10">
            {visiblePages.map((page) => (
              <div
                key={page.index}
                onClick={() => dispatch({ type: "SET_ACTIVE_PAGE", index: page.index })}
              >
                <PageCanvas page={page} zoom={zoom} />
              </div>
            ))}
          </div>
        </div>
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:block">
          {showMetadata ? <MetadataPanel /> : <PropertiesPanel />}
        </aside>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorInner />
    </EditorProvider>
  );
}
