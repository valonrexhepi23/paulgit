"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import DragHandle from "@tiptap/extension-drag-handle-react";
import "./init.css";
import Image from "@tiptap/extension-image";
import CommitDialog from "./CommitDialog";
import { ListKit } from "@tiptap/extension-list";
import MenuBar from "./MenuBar";
import { turndownService } from "@/lib/turndown";
import { convertMarkdownToHtml } from "@/lib/markdown";

export default function Writing({ content }: { content: string }) {
  const [htmlContent, setHtmlContent] = useState("");
  const [originalMarkdown, setOriginalMarkdown] = useState("");
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);

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
