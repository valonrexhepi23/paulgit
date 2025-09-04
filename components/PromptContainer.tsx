"use client";

import { useReadmeContext } from "@/app/readme/ReadmeContext";
import { useChat } from "@ai-sdk/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { DefaultChatTransport } from "ai";
import { Paperclip, XIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

export default function PromptContainer() {
  const [input, setInput] = useState("");
  const { context, setContext, htmlContent } = useReadmeContext();
  const { sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({
      text: input,
    });
    setInput("");
  };
  return (
    <div className="h-50 items-center shrink-0 flex flex-col px-4 pt-4">
      <div className="w-full h-full flex flex-col bg-gray-200 rounded-t-lg px-2 pt-2 max-w-lg">
        <div className="flex-1 bg-white rounded-t-sm bg-white shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col h-full w-full">
            <textarea
              className="flex-1 shrink-0 resize-none w-full focus:outline-none p-4 text-lg placeholder:text-gray-300 text-gray-700"
              placeholder="Write it..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div className="shrink-0 h-20 flex justify-between p-2 items-center">
              <div className="flex max-w-[200px] items-center px-4 gap-2">
                <button type="button">
                  <Paperclip className="size-4" />
                </button>
                {context && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="max-w-30 flex items-center p-1 border rounded-sm bg-gray-100 text-gray-700 shadow-xs">
                        <div className="text-xs truncate">{context}</div>
                        <button
                          onClick={() => setContext("")}
                          className="hover:text-red-500 transition-color duration-300"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-70 w-fit max-h-70 overflow-auto text-xs bg-white m-2 p-2 rounded-md border border-gray-200 shadow-xs">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: context,
                        }}
                      />
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="p-2 border rounded-sm border-gray-100 bg-gray-500 text-gray-50 disabled:opacity-50 transition-opacity duration-200"
                  disabled={!input || input.trim().length < 3}
                >
                  <ArrowUpIcon className="size-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
