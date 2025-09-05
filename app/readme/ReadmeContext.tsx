"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from "ai";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface ReadmeInterface {
  htmlContent: string;
  setHtmlContent: Dispatch<SetStateAction<string>>;
  context: string;
  setContext: Dispatch<SetStateAction<string>>;
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  sendMessage: any;
}

const ReadmeContext = createContext<ReadmeInterface | undefined>(undefined);

export const useReadmeContext = () => {
  const context = useContext(ReadmeContext);

  if (context === undefined) {
    throw new Error("useReadmeContext must be used within a ReadmeProvider");
  }
  return context;
};

export function ReadmeProvider({ children }: { children: ReactNode }) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const value = {
    htmlContent,
    setHtmlContent,
    context,
    setContext,
    messages,
    sendMessage,
  };

  return (
    <ReadmeContext.Provider value={value}>{children}</ReadmeContext.Provider>
  );
}
