"use client";

import dynamic from "next/dynamic";

// pdfjs-dist touches browser-only globals (DOMMatrix, etc.) at module scope,
// so the whole editor must be excluded from SSR/prerendering entirely.
const EditorApp = dynamic(() => import("@/components/editor/EditorApp"), {
  ssr: false,
});

export default function EditorPage() {
  return <EditorApp />;
}
