import { CheckIcon, AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  message,
  type,
  isVisible,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckIcon className="size-5" />
      ) : (
        <AlertCircleIcon className="size-5" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        ×
      </button>
    </div>
  );
}
