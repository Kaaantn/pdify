"use client";

import * as React from "react";
import type { TextBlock } from "@/lib/types";
import { textBoxToCss } from "@/lib/geometry";
import { useEditor } from "./EditorContext";
import { Trash2 } from "lucide-react";

interface Props {
  block: TextBlock;
  pageHeightPt: number;
  scale: number;
}

const FONT_STACK: Record<TextBlock["fontHint"], string> = {
  sans: "ui-sans-serif, Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  monospace: "'Courier New', Courier, monospace",
};

export function EditableTextBlock({ block, pageHeightPt, scale }: Props) {
  const { state, dispatch } = useEditor();
  const selected = state.selectedId === block.id;
  const ref = React.useRef<HTMLDivElement>(null);

  if (block.deleted) return null;

  const box = textBoxToCss(pageHeightPt, scale, block.x, block.y, block.width, block.height);
  const rgbColor = `rgb(${Math.round(block.color.r * 255)}, ${Math.round(
    block.color.g * 255
  )}, ${Math.round(block.color.b * 255)})`;
  const bgRgb = `rgb(${Math.round(block.bgColor.r * 255)}, ${Math.round(
    block.bgColor.g * 255
  )}, ${Math.round(block.bgColor.b * 255)})`;

  function commit() {
    const text = ref.current?.innerText ?? block.text;
    if (text !== block.text) {
      dispatch({ type: "UPDATE_TEXT", pageIndex: block.pageIndex, id: block.id, patch: { text } });
    }
  }

  function handleFocus() {
    if (!block.modified) {
      dispatch({ type: "UPDATE_TEXT", pageIndex: block.pageIndex, id: block.id, patch: {} });
    }
  }

  return (
    <div
      className="group absolute"
      style={{
        left: box.left,
        top: box.top,
        width: Math.max(box.width, 20),
        height: box.height,
        minWidth: 20,
      }}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: "SELECT", id: block.id });
      }}
    >
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={commit}
        className="h-full w-full whitespace-pre px-px outline-none"
        style={{
          fontSize: Math.max(block.fontSize * scale, 6),
          lineHeight: `${box.height}px`,
          color: rgbColor,
          fontFamily: FONT_STACK[block.fontHint],
          fontWeight: block.bold ? 700 : 400,
          fontStyle: block.italic ? "italic" : "normal",
          boxShadow: selected ? "0 0 0 1.5px #9AAD2E inset" : undefined,
          background: block.isNew || block.modified ? bgRgb : "transparent",
        }}
      >
        {block.text}
      </div>
      {selected && (
        <button
          type="button"
          className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-500 shadow ring-1 ring-divider hover:bg-red-50"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "DELETE_TEXT", pageIndex: block.pageIndex, id: block.id });
          }}
          aria-label="Metni sil"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
