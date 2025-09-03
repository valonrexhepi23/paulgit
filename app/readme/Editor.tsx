"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";
import { useEffect, useState } from "react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import "./init.css";
import Image from "@tiptap/extension-image";
import {
  ListIcon,
  ListOrderedIcon,
  SquareTerminal,
  TextQuote,
  Undo2Icon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  Redo2,
  ListTodoIcon,
} from "lucide-react";
import TurndownService from "turndown";
import CommitDialog from "./CommitDialog";
import { ListKit } from "@tiptap/extension-list";

const turndownService = new TurndownService();

turndownService.addRule("taskList", {
  filter: function (node) {
    return (
      node.nodeName === "UL" && node.getAttribute("data-type") === "taskList"
    );
  },
  replacement: function (content) {
    return "\n" + content + "\n";
  },
});

turndownService.addRule("taskItem", {
  filter: function (node) {
    return (
      node.nodeName === "LI" && node.getAttribute("data-type") === "taskItem"
    );
  },
  replacement: function (content, node) {
    const isChecked = node.getAttribute("data-checked") === "true";
    const checkboxMark = isChecked ? "- [x]" : "- [ ]";

    const cleanContent = content.trim().replace(/\n+/g, " ");

    return checkboxMark + " " + cleanContent + "\n";
  },
});

turndownService.keep(["del"]);

function MenuBar({ editor }: { editor: Editor }) {
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

export default function Writing({ content }: { content: string }) {
  const [htmlContent, setHtmlContent] = useState("");
  const [originalMarkdown, setOriginalMarkdown] = useState("");
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

  const preprocessTaskLists = (markdown: string) => {
    if (!markdown || typeof markdown !== "string") {
      return { processed: "", taskListPlaceholders: [] };
    }

    const taskListPlaceholders: Array<{ placeholder: string; html: string }> =
      [];
    let placeholderCount = 0;

    const taskListRegex = /^((?:- \[[ x]\] .+\n?)+)/gm;

    const processed = markdown.replace(taskListRegex, (match) => {
      const lines = match.trim().split("\n");
      const items = lines
        .map((line) => {
          const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
          if (taskMatch) {
            const checked = taskMatch[1] === "x";
            const text = taskMatch[2].trim();
            return `<li data-checked="${checked}" data-type="taskItem">
          <label contenteditable="false">
            <input type="checkbox" ${checked ? "checked" : ""}>
            <span></span>
          </label>
          <div><p>${text}</p></div>
        </li>`;
          }
          return "";
        })
        .filter((item) => item)
        .join("\n");

      const taskListHtml = `<ul data-type="taskList">${items}</ul>`;
      console.log("taskListHtml", taskListHtml);

      const placeholder = `<p>TASKLIST_PLACEHOLDER_${placeholderCount++}</p>`;
      taskListPlaceholders.push({ placeholder, html: taskListHtml });

      return placeholder;
    });

    return { processed, taskListPlaceholders };
  };

  const restoreTaskLists = (
    html: string,
    taskListPlaceholders: Array<{ placeholder: string; html: string }>
  ) => {
    if (!html || typeof html !== "string") {
      return html;
    }

    if (!taskListPlaceholders || taskListPlaceholders.length === 0) {
      return html;
    }

    let result = html;
    taskListPlaceholders.forEach(({ placeholder, html: taskListHtml }) => {
      result = result.replace(`<p>${placeholder}</p>`, taskListHtml);
      result = result.replace(placeholder, taskListHtml);
    });
    return result;
  };

  const convertMarkdownToHtml = async (content: string) => {
    if (!content || content.includes("No profile README found")) {
      return "<p>Start writing your README...</p>";
    }

    try {
      console.log("content", content);

      const { processed, taskListPlaceholders } = preprocessTaskLists(content);

      const html = await marked.parse(processed);

      const finalHtml = restoreTaskLists(html, taskListPlaceholders);
      return finalHtml;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return `<pre>${content}</pre>`;
    }
  };

  useEffect(() => {
    const processContent = async () => {
      if (!content || content.includes("No profile README found")) {
        setHtmlContent("<p>Start writing your README...</p>");
        setOriginalMarkdown("");
        return;
      }

      try {
        const html = await convertMarkdownToHtml(content);
        setHtmlContent(html);
        setOriginalMarkdown(content);
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtmlContent(`<pre>${content}</pre>`);
        setOriginalMarkdown(content);
      }
    };

    processContent();
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        trailingNode: false,
      }),
      ListKit,
      Image,
    ],
    content: htmlContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && htmlContent !== "<p>Loading...</p>") {
      editor.commands.setContent(htmlContent);
    }
  }, [editor, htmlContent]);

  const getCurrentMarkdown = () => {
    if (!editor) return "";
    const htmlContent = editor.getHTML();
    console.log(htmlContent);

    return turndownService.turndown(htmlContent);
  };

  const handleSave = () => {
    setIsCommitDialogOpen(true);
  };

  const handleCommit = async (commitMessage: string) => {
    if (!editor) return;

    setIsCommitting(true);

    try {
      const currentMarkdown = getCurrentMarkdown();

      const response = await fetch("/api/github/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: currentMarkdown,
          commitMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsCommitDialogOpen(false);
        setOriginalMarkdown(currentMarkdown);
      } else {
        throw new Error(result.error || "Failed to commit changes");
      }
    } catch (error) {
      console.error("Error committing changes:", error);
    } finally {
      setIsCommitting(false);
    }
  };

  if (!editor) {
    return <div></div>;
  }

  return (
    <div className="rounded-lg">
      <div className="sticky py-3 flex gap-2 flex-wrap bg-white border-[0.5px] border-gray-300 my-2 px-4 rounded-md">
        <MenuBar editor={editor!} />

        <button
          onClick={handleSave}
          disabled={isCommitting}
          className="px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-gray-100 flex items-center gap-1 transition-color duration-200 text-gray-500 hover:text-black"
        >
          Commit
        </button>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-20vh)] border-[0.5px] border-gray-300 rounded-md">
        <DragHandle editor={editor!}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-grip-vertical-icon lucide-grip-vertical size-3"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </DragHandle>
        <EditorContent className="markdown-body" editor={editor} />
      </div>
      <CommitDialog
        isOpen={isCommitDialogOpen}
        onClose={() => setIsCommitDialogOpen(false)}
        onCommit={handleCommit}
        isLoading={isCommitting}
        originalContent={originalMarkdown}
        modifiedContent={getCurrentMarkdown()}
      />
    </div>
  );
}
