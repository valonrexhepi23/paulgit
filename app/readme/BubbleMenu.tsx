"use client";

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Editor } from "@tiptap/react";
import { useReadmeContext } from "./ReadmeContext";
import { DOMSerializer } from "prosemirror-model";

export default function Bubble({ editor }: { editor: Editor }) {
  const { context, setContext } = useReadmeContext();

  function getSelectedHTML(editor: Editor) {
    const { state } = editor;
    const { from, to } = state.selection;

    const slice = state.doc.cut(from, to);

    const serializer = DOMSerializer.fromSchema(editor.schema);
    const fragment = serializer.serializeFragment(slice.content);

    const div = document.createElement("div");
    div.appendChild(fragment);

    return div.innerHTML; // ✅ your selected HTML
  }

  return (
    <BubbleMenu editor={editor} options={{ placement: "bottom", offset: 8 }}>
      <div className="bg-white border border-gray-300 shadow-xs px-2 flex items-center rounded-md p-1 gap-4 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold")
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <BoldIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic")
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <ItalicIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${
            editor.isActive("strike")
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <StrikethroughIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${
            editor.isActive("code")
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <CodeIcon className="size-4" />
        </button>
        <button
          onClick={() => {
            const html = getSelectedHTML(editor);
            setContext(html);
          }}
        >
          Add to Context
        </button>
      </div>
    </BubbleMenu>
  );
}
