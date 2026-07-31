"use client";

import { Input, Label } from "@/components/ui/input";
import { useEditor } from "./EditorContext";
import type { DocMetadata } from "@/lib/types";

export function MetadataPanel() {
  const { state, dispatch } = useEditor();
  const meta = state.doc?.metadata;
  if (!meta) return null;

  function set(key: keyof DocMetadata, value: string) {
    dispatch({ type: "UPDATE_METADATA", patch: { [key]: value } });
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Metadata</h3>
      <div>
        <Label>Başlık</Label>
        <Input value={meta.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div>
        <Label>Yazar</Label>
        <Input value={meta.author} onChange={(e) => set("author", e.target.value)} />
      </div>
      <div>
        <Label>Konu</Label>
        <Input value={meta.subject} onChange={(e) => set("subject", e.target.value)} />
      </div>
      <div>
        <Label>Anahtar Kelimeler</Label>
        <Input
          value={meta.keywords}
          placeholder="virgülle ayırın"
          onChange={(e) => set("keywords", e.target.value)}
        />
      </div>
      <div>
        <Label>Oluşturan</Label>
        <Input value={meta.creator} onChange={(e) => set("creator", e.target.value)} />
      </div>
    </div>
  );
}
