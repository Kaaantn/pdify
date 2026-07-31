"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEditor } from "./EditorContext";
import type { ImageBlock, TextBlock } from "@/lib/types";
import { Download, ImagePlus, Settings2, Type, Undo2, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  zoom: number;
  onZoomChange: (z: number) => void;
  showMetadata: boolean;
  onToggleMetadata: () => void;
  onDownload: () => void;
  downloading: boolean;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function Toolbar({ zoom, onZoomChange, showMetadata, onToggleMetadata, onDownload, downloading }: Props) {
  const { state, dispatch } = useEditor();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const activePage = state.doc?.pages.find((p) => p.index === state.activePageIndex && !p.deleted);

  function addText() {
    if (!activePage) return;
    const block: TextBlock = {
      id: `new-t-${uid()}`,
      pageIndex: activePage.index,
      x: 72,
      y: activePage.originalHeight - 120,
      width: 160,
      height: 16,
      fontSize: 14,
      fontHint: "sans",
      bold: false,
      italic: false,
      color: { r: 0, g: 0, b: 0 },
      bgColor: { r: 1, g: 1, b: 1 },
      text: "Yeni metin",
      originalText: "",
      modified: true,
      deleted: false,
      isNew: true,
    };
    dispatch({ type: "ADD_TEXT", pageIndex: activePage.index, block });
  }

  function addImageFile(file: File) {
    if (!activePage) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const maxWidthPt = 180;
        const ratio = img.naturalHeight / Math.max(img.naturalWidth, 1);
        const width = Math.min(maxWidthPt, img.naturalWidth);
        const height = width * ratio;
        const block: ImageBlock = {
          id: `new-i-${uid()}`,
          pageIndex: activePage.index,
          x: 72,
          y: activePage.originalHeight - 120 - height,
          width,
          height,
          src,
          originalSrc: null,
          bgColor: { r: 1, g: 1, b: 1 },
          modified: true,
          deleted: false,
          isNew: true,
        };
        dispatch({ type: "ADD_IMAGE", pageIndex: activePage.index, block });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <Button variant="outline" size="sm" onClick={addText} disabled={!activePage}>
        <Type className="h-3.5 w-3.5" /> Metin ekle
      </Button>
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!activePage}>
        <ImagePlus className="h-3.5 w-3.5" /> Görsel ekle
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) addImageFile(f);
          e.target.value = "";
        }}
      />

      <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => dispatch({ type: "UNDO" })}
        disabled={state.history.length === 0}
      >
        <Undo2 className="h-3.5 w-3.5" /> Geri al
      </Button>

      <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

      <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}>
        <ZoomOut className="h-3.5 w-3.5" />
      </Button>
      <span className="w-10 text-center text-xs text-zinc-500">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="sm" onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}>
        <ZoomIn className="h-3.5 w-3.5" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant={showMetadata ? "accent" : "outline"} size="sm" onClick={onToggleMetadata}>
          <Settings2 className="h-3.5 w-3.5" /> Metadata
        </Button>
        <Button size="sm" onClick={onDownload} disabled={downloading}>
          <Download className="h-3.5 w-3.5" /> {downloading ? "Hazırlanıyor..." : "İndir"}
        </Button>
      </div>
    </div>
  );
}
