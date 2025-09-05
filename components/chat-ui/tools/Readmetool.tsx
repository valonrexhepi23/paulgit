"use client";

import DiffView from "@/app/readme/DiffView";
import { turndownService } from "@/lib/turndown";
import { Check, GitPullRequestArrowIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function ReadmeTool({
  part,
  htmlContent,
  setHtmlContent,
}: {
  part: any;
  htmlContent: string;
  setHtmlContent: Dispatch<SetStateAction<string>>;
}) {
  const [isApplied, setIsApplied] = useState(false);
  switch (part.state) {
    case "input-available":
      return (
        <div
          key={part.toolCallId + part.type}
          className="flex flex-col items-start justify-start gap-2 text-gray-500"
        >
          <p className="text-xs">Changes:</p>
          <div className="flex flex-col gap-2">
            {part.input["editingInstructions"].map((adj) => {
              return (
                <div className="text-xs border p-1 animate-pulse rounded-sm shadow-xs border-gray-200 bg-gray-100 text-gray-600 flex flex-col gap-4">
                  {adj}
                </div>
              );
            })}{" "}
          </div>
        </div>
      );
    case "output-available":
      return (
        <div key={part.toolCallId + part.type}>
          {part.output.readme &&
            (!isApplied ? (
              <div className="flex flex-col gap-2">
                <DiffView
                  originalContent={turndownService.turndown(htmlContent)}
                  modifiedContent={turndownService.turndown(part.output.readme)}
                />
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => {
                      setHtmlContent(part.output.readme);
                      setIsApplied(true);
                    }}
                    className="text-xs w-fit p-2 rounded-sm gap-1 bg-black text-white font-semibold tracking-tight flex items-center"
                  >
                    <GitPullRequestArrowIcon className="size-3" />
                    Apply changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs w-fit p-2 rounded-sm gap-1 bg-green-100 text-green-600 font-semibold tracking-tight flex items-center">
                <Check className="size-3" /> Changes Applied!
              </div>
            ))}
        </div>
      );
    default:
      return <div key={"default"}></div>;
  }
}
