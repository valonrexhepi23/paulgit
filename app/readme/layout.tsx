import { ReactNode } from "react";
import { ReadmeProvider } from "./ReadmeContext";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <ReadmeProvider>
      <section className="bg-gray-50 flex-1">{children}</section>
    </ReadmeProvider>
  );
}
