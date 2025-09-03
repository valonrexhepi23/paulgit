"use client";

import { DefaultChatTransport } from "ai";
import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-20 shrink-0"></div>
      <div className="flex-1">
        {messages.map((message, index) => (
          <div key={index}>
            {message.parts.map((part) => {
              if (part.type === "text") {
                return <div key={`${message.id}-text`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>
      <div className="h-46 items-center shrink-0 flex flex-col px-4 pt-4">
        <div className="w-full h-full flex flex-col bg-stone-200 rounded-t-lg px-2 pt-2 max-w-lg">
          <div className="flex-1 bg-white rounded-t-sm bg-white shadow-xs">
            <div className="flex flex-col h-full w-full">
              <textarea
                className="h-24 shrink-0 resize-none focus:outline-none p-4 text-lg placeholder:text-stone-300 text-stone-700"
                placeholder="Write it..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <div className="flex-1 flex justify-between p-2 items-center">
                <div></div>
                <div>
                  <button className="p-2 border rounded-sm border-gray-100 bg-stone-500 text-stone-50">
                    <ArrowUpIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
