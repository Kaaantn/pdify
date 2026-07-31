"use client";

import * as React from "react";
import type { DocModel, DocMetadata, ImageBlock, PageModel, TextBlock } from "@/lib/types";

interface EditorState {
  doc: DocModel | null;
  history: DocModel[];
  selectedId: string | null;
  activePageIndex: number;
  progress: { done: number; total: number } | null;
}

type Action =
  | { type: "SET_DOC"; doc: DocModel }
  | { type: "SET_PROGRESS"; progress: EditorState["progress"] }
  | { type: "UPDATE_TEXT"; pageIndex: number; id: string; patch: Partial<TextBlock> }
  | { type: "UPDATE_IMAGE"; pageIndex: number; id: string; patch: Partial<ImageBlock> }
  | { type: "ADD_TEXT"; pageIndex: number; block: TextBlock }
  | { type: "ADD_IMAGE"; pageIndex: number; block: ImageBlock }
  | { type: "DELETE_TEXT"; pageIndex: number; id: string }
  | { type: "DELETE_IMAGE"; pageIndex: number; id: string }
  | { type: "UPDATE_METADATA"; patch: Partial<DocMetadata> }
  | { type: "DELETE_PAGE"; index: number }
  | { type: "ROTATE_PAGE"; index: number; delta: number }
  | { type: "REORDER_PAGES"; pageOrder: number[] }
  | { type: "SELECT"; id: string | null }
  | { type: "SET_ACTIVE_PAGE"; index: number }
  | { type: "UNDO" };

function mapPage(doc: DocModel, pageIndex: number, fn: (p: PageModel) => PageModel): DocModel {
  return {
    ...doc,
    pages: doc.pages.map((p) => (p.index === pageIndex ? fn(p) : p)),
  };
}

function reducer(state: EditorState, action: Action): EditorState {
  if (action.type === "SET_DOC") {
    return { ...state, doc: action.doc, history: [], selectedId: null, activePageIndex: 0 };
  }
  if (action.type === "SET_PROGRESS") {
    return { ...state, progress: action.progress };
  }
  if (!state.doc) return state;

  switch (action.type) {
    case "UPDATE_TEXT": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        textBlocks: p.textBlocks.map((t) =>
          t.id === action.id ? { ...t, ...action.patch, modified: true } : t
        ),
      }));
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "UPDATE_IMAGE": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        imageBlocks: p.imageBlocks.map((im) =>
          im.id === action.id ? { ...im, ...action.patch, modified: true } : im
        ),
      }));
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "ADD_TEXT": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        textBlocks: [...p.textBlocks, action.block],
      }));
      return {
        ...state,
        doc: nextDoc,
        history: [...state.history, state.doc],
        selectedId: action.block.id,
      };
    }
    case "ADD_IMAGE": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        imageBlocks: [...p.imageBlocks, action.block],
      }));
      return {
        ...state,
        doc: nextDoc,
        history: [...state.history, state.doc],
        selectedId: action.block.id,
      };
    }
    case "DELETE_TEXT": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        textBlocks: p.textBlocks.map((t) =>
          t.id === action.id ? { ...t, deleted: true, modified: true } : t
        ),
      }));
      return {
        ...state,
        doc: nextDoc,
        history: [...state.history, state.doc],
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    }
    case "DELETE_IMAGE": {
      const nextDoc = mapPage(state.doc, action.pageIndex, (p) => ({
        ...p,
        imageBlocks: p.imageBlocks.map((im) =>
          im.id === action.id ? { ...im, deleted: true, modified: true } : im
        ),
      }));
      return {
        ...state,
        doc: nextDoc,
        history: [...state.history, state.doc],
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    }
    case "UPDATE_METADATA": {
      const nextDoc = { ...state.doc, metadata: { ...state.doc.metadata, ...action.patch } };
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "DELETE_PAGE": {
      const nextDoc = mapPage(state.doc, action.index, (p) => ({ ...p, deleted: true }));
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "ROTATE_PAGE": {
      const nextDoc = mapPage(state.doc, action.index, (p) => ({
        ...p,
        rotation: (((p.rotation + action.delta) % 360) + 360) % 360,
      }));
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "REORDER_PAGES": {
      const nextDoc = { ...state.doc, pageOrder: action.pageOrder };
      return { ...state, doc: nextDoc, history: [...state.history, state.doc] };
    }
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "SET_ACTIVE_PAGE":
      return { ...state, activePageIndex: action.index };
    case "UNDO": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return { ...state, doc: prev, history: state.history.slice(0, -1) };
    }
    default:
      return state;
  }
}

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    doc: null,
    history: [],
    selectedId: null,
    activePageIndex: 0,
    progress: null,
  });
  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = React.useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
