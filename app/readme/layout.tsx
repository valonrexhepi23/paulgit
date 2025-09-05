import { ReactNode } from "react";
import { ReadmeProvider } from "./ReadmeContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <ReadmeProvider>
      <TooltipProvider>
        <section className="bg-gray-50 flex-1">{children}</section>
      </TooltipProvider>
    </ReadmeProvider>
  );
}
