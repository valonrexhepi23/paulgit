"use client";
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

  const value = {
    htmlContent,
    setHtmlContent,
    context,
    setContext,
  };

  return (
    <ReadmeContext.Provider value={value}>{children}</ReadmeContext.Provider>
  );
}
