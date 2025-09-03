import { ReactNode } from "react";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <section className="bg-gray-50 flex-1">{children}</section>;
}
