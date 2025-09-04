"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardButton({
  children,
}: {
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/dashboard");
      }}
    >
      {children || "Dashboard"}
    </button>
  );
}
