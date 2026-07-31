"use client";

import * as React from "react";
import type { ImageBlock } from "@/lib/types";
import { imageBoxToCss, cssToImageOrigin } from "@/lib/geometry";
import { useEditor } from "./EditorContext";
import { Trash2, Replace } from "lucide-react";

interface Props {
  block: ImageBlock;
  pageHeightPt: number;
  scale: number;
}

export function EditableImageBlock({ block, pageHeightPt, scale }: Props) {
  const { state, dispatch } = useEditor();
  const selected = state.selectedId === block.id;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dragState = React.useRef<{
    startX: number;
    startY: number;
    left: number;
    top: number;
    width: number;
    height: number;
    mode: "move" | "resize";
  } | null>(null);

  if (block.deleted) return null;

  const box = imageBoxToCss(pageHeightPt, scale, block.x, block.y, block.width, block.height);

  function commitBox(left: number, top: number, width: number, height: number) {
    const origin = cssToImageOrigin(pageHeightPt, scale, left, top, width, height);
    dispatch({
      type: "UPDATE_IMAGE",
      pageIndex: block.pageIndex,
      id: block.id,
      patch: origin,
    });
  }

  function startDrag(e: React.MouseEvent, mode: "move" | "resize") {
    e.stopPropagation();
    e.preventDefault();
    dispatch({ type: "SELECT", id: block.id });
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      mode,
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function onMove(e: MouseEvent) {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.mode === "move") {
      commitBox(d.left + dx, d.top + dy, d.width, d.height);
    } else {
      commitBox(d.left, d.top, Math.max(10, d.width + dx), Math.max(10, d.height + dy));
    }
  }

  function onUp() {
    dragState.current = null;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
  }

  function handleReplace(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({
        type: "UPDATE_IMAGE",
        pageIndex: block.pageIndex,
        id: block.id,
        patch: { src: reader.result as string },
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="absolute cursor-move select-none"
      style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
      onMouseDown={(e) => startDrag(e, "move")}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT", id: block.id });
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt=""
        draggable={false}
        className="h-full w-full object-fill"
        style={{ boxShadow: selected ? "0 0 0 1.5px #a3e635" : undefined }}
      />
      {selected && (
        <>
          <div
            className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-se-resize rounded-sm bg-lime-400 ring-1 ring-white"
            onMouseDown={(e) => startDrag(e, "resize")}
          />
          <div className="absolute -top-9 right-0 flex gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-600 shadow ring-1 ring-zinc-200 hover:bg-zinc-50"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              aria-label="Görseli değiştir"
            >
              <Replace className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500 shadow ring-1 ring-zinc-200 hover:bg-red-50"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "DELETE_IMAGE", pageIndex: block.pageIndex, id: block.id });
              }}
              aria-label="Görseli sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleReplace(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
