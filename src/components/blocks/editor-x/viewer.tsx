"use client";

import { useMemo } from "react";
import clsx from "clsx";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";
import type { SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";

import { nodes } from "./nodes";

const baseConfig: InitialConfigType = {
  namespace: "LexicalViewer",
  theme: editorTheme,
  nodes,
  editable: false,
  onError: (error: Error) => {
    console.error(error);
  },
};

interface LexicalRendererProps {
  state?: SerializedEditorState | string | null;
  className?: string;
  contentClassName?: string;
}

export function LexicalRenderer({
  state,
  className,
  contentClassName,
}: LexicalRendererProps) {
  const serializedState = useMemo(() => {
    if (!state) {
      return null;
    }

    try {
      if (typeof state === "string") {
        const trimmed = state.trim();

        if (!trimmed) {
          return null;
        }

        JSON.parse(trimmed);
        return trimmed;
      }

      return JSON.stringify(state);
    } catch (error) {
      console.warn("Invalid Lexical state supplied to LexicalRenderer", error);
      return null;
    }
  }, [state]);

  if (!serializedState) {
    return null;
  }

  return (
    <div className={clsx("lexical-renderer flex flex-col", className)}>
      <LexicalComposer
        initialConfig={{
          ...baseConfig,
          editorState: serializedState,
        }}
      >
        <RichTextPlugin
          contentEditable={
            <LexicalContentEditable
              className={clsx(
                "relative block min-h-0 w-full whitespace-pre-wrap break-words text-base leading-relaxed text-foreground/70 focus:outline-none",
                contentClassName,
              )}
              aria-readonly
            />
          }
          placeholder={<span className="hidden" />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
}
