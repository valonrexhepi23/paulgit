"use client";
import DiffView from "@/app/readme/DiffView";
import { useReadmeContext } from "@/app/readme/ReadmeContext";
import ReadmeTool from "./chat-ui/tools/Readmetool";
import HumanMessage from "./chat-ui/HumanMessage";

export default function MessageChatUi() {
  const { messages, htmlContent, setHtmlContent, context } = useReadmeContext();

  return (
    <div
      className="flex-1 p-4 overflow-auto mx-4        
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      {messages.map((message, index) => (
        <div key={index} className="flex flex-col gap-4">
          {message.parts.map((part) => {
            if (part.type === "text") {
              switch (message.role) {
                case "user":
                  return (
                    <>
                      <HumanMessage part={part} id={`${message.id}-text`} />
                    </>
                  );
                case "assistant":
                  return <div className="text-sm my-2">{part.text}</div>;
              }
            }
            if (part.type === "tool-processReadme") {
              return (
                <div>
                  <ReadmeTool
                    part={part}
                    htmlContent={htmlContent}
                    setHtmlContent={setHtmlContent}
                  />
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
