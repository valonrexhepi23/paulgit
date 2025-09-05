import { ReactNode } from "react";

export default function ChatPanel({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full max-h-screen">{children}</div>
  );
}
