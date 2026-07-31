"use client";

import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditor } from "./EditorContext";

function rgbToHex(r: number, g: number, b: number) {
  const c = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

export function PropertiesPanel() {
  const { state, dispatch } = useEditor();
  const doc = state.doc;
  if (!doc || !state.selectedId) {
    return <p className="text-xs text-zinc-400">Düzenlemek için bir metin veya görsel seçin.</p>;
  }

  for (const page of doc.pages) {
    const t = page.textBlocks.find((b) => b.id === state.selectedId);
    if (t) {
      return (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Metin Özellikleri</h3>
          <div>
            <Label>Font boyutu</Label>
            <Input
              type="number"
              min={4}
              max={200}
              value={Math.round(t.fontSize)}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_TEXT",
                  pageIndex: t.pageIndex,
                  id: t.id,
                  patch: { fontSize: Number(e.target.value) || t.fontSize },
                })
              }
            />
          </div>
          <div>
            <Label>Renk</Label>
            <input
              type="color"
              className="h-9 w-full cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-700"
              value={rgbToHex(t.color.r, t.color.g, t.color.b)}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_TEXT",
                  pageIndex: t.pageIndex,
                  id: t.id,
                  patch: { color: hexToRgb(e.target.value) },
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={t.bold ? "accent" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() =>
                dispatch({ type: "UPDATE_TEXT", pageIndex: t.pageIndex, id: t.id, patch: { bold: !t.bold } })
              }
            >
              Kalın
            </Button>
            <Button
              variant={t.italic ? "accent" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() =>
                dispatch({ type: "UPDATE_TEXT", pageIndex: t.pageIndex, id: t.id, patch: { italic: !t.italic } })
              }
            >
              İtalik
            </Button>
          </div>
        </div>
      );
    }
    const im = page.imageBlocks.find((b) => b.id === state.selectedId);
    if (im) {
      return (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Görsel Özellikleri</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Genişlik (pt)</Label>
              <Input
                type="number"
                value={Math.round(im.width)}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_IMAGE",
                    pageIndex: im.pageIndex,
                    id: im.id,
                    patch: { width: Number(e.target.value) || im.width },
                  })
                }
              />
            </div>
            <div>
              <Label>Yükseklik (pt)</Label>
              <Input
                type="number"
                value={Math.round(im.height)}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_IMAGE",
                    pageIndex: im.pageIndex,
                    id: im.id,
                    patch: { height: Number(e.target.value) || im.height },
                  })
                }
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return <p className="text-xs text-zinc-400">Düzenlemek için bir metin veya görsel seçin.</p>;
}
