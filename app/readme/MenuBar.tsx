import { Editor, useEditorState } from "@tiptap/react";
import {
  Undo2Icon,
  Redo2,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  SquareTerminal,
  TextQuote,
  ListTodoIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
} from "lucide-react";

export default function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        isTask: ctx.editor.isActive("taskList") ?? false,
        isInter: ctx.editor.isActive("textStyle", { fontFamily: "Inter" }),
      };
    },
  });

  return (
    <>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        className="disabled:text-gray-300 text-gray-700"
      >
        <Undo2Icon className="size-4 text-inherit" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        className="disabled:text-gray-300 text-gray-700"
      >
        <Redo2 className="size-4" />
      </button>
      <div className="button-group flex flex-wrap items-center gap-4 pl-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`${
            editorState.isBold
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <BoldIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`${
            editorState.isItalic
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <ItalicIcon className="size-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`${
            editorState.isStrike
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <StrikethroughIcon className="size-4" />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`${
            editorState.isHeading1
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <Heading1Icon className="size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${
            editorState.isHeading2
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <Heading2Icon className="size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${
            editorState.isHeading3
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <Heading3Icon className="size-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`${
            editorState.isHeading4
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <Heading4Icon className="size-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`${
            editorState.isCode
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <CodeIcon className="size-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${
            editorState.isBulletList
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <ListIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${
            editorState.isOrderedList
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <ListOrderedIcon className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${
            editorState.isCodeBlock
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <SquareTerminal className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${
            editorState.isBlockquote
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <TextQuote className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`${
            editorState.isTask
              ? "opacity-100 menu-item"
              : "opacity-50 menu-item-not"
          }`}
        >
          <ListTodoIcon className="size-4" />
        </button>
      </div>
    </>
  );
}
