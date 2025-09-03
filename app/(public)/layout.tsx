import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <section className="bg-gray-50 flex-1">{children}</section>
    </ClerkProvider>
  );
}
