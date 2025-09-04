"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function MessageChatUi() {
  const { messages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  return (
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
  );
}
