"use client";

import * as React from "react";
import type { PageModel } from "@/lib/types";
import { PT_TO_PX } from "@/lib/geometry";
import { EditableTextBlock } from "./EditableTextBlock";
import { EditableImageBlock } from "./EditableImageBlock";
import { useEditor } from "./EditorContext";
import { AlertTriangle, RotateCw, Trash2 } from "lucide-react";

interface Props {
  page: PageModel;
  zoom: number;
}

export function PageCanvas({ page, zoom }: Props) {
  const { dispatch } = useEditor();
  const scale = PT_TO_PX * zoom;

  if (page.deleted) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full max-w-full items-center justify-between px-1 text-xs text-muted-foreground">
        <span>Sayfa {page.index + 1}</span>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded p-1 hover:bg-divider/60"
            onClick={() => dispatch({ type: "ROTATE_PAGE", index: page.index, delta: 90 })}
            aria-label="Sayfayı döndür"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded p-1 text-red-400 hover:bg-red-50"
            onClick={() => dispatch({ type: "DELETE_PAGE", index: page.index })}
            aria-label="Sayfayı sil"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {page.unsupportedLayout && (
        <div className="flex w-full items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Bu sayfada düzenlenebilir metin bulunamadı (muhtemelen taranmış bir görüntü).
          Metin düzenleme bu sayfada çalışmayabilir.
        </div>
      )}

      <div
        className="relative select-none overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-divider"
        style={{
          width: page.originalWidth * scale,
          height: page.originalHeight * scale,
          transform: `rotate(${page.rotation}deg)`,
        }}
        onClick={() => dispatch({ type: "SELECT", id: null })}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.previewDataUrl}
          alt={`Sayfa ${page.index + 1}`}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        {page.imageBlocks.map((im) => (
          <EditableImageBlock key={im.id} block={im} pageHeightPt={page.originalHeight} scale={scale} />
        ))}
        {page.textBlocks.map((t) => (
          <EditableTextBlock key={t.id} block={t} pageHeightPt={page.originalHeight} scale={scale} />
        ))}
      </div>
    </div>
  );
}
