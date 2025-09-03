import { EyeOffIcon, Loader, Loader2 } from "lucide-react";
import { useState } from "react";
import DiffView from "./DiffView";

interface CommitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (message: string) => void;
  isLoading: boolean;
  originalContent: string;
  modifiedContent: string;
}

export default function CommitDialog({
  isOpen,
  onClose,
  onCommit,
  isLoading,
  originalContent,
  modifiedContent,
}: CommitDialogProps) {
  const [commitMessage, setCommitMessage] = useState("Update README.md");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommit(commitMessage);
  };

  if (!isOpen) return null;

  const hasChanges = originalContent !== modifiedContent;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 px-6">
      <div className="bg-gray-50 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col w-fit">
        <div className="md:flex md:items-start p-2 md:justify-between">
          <div className="flex flex-col min-w-60 max-w-64 px-2 py-4 gap-2">
            <h3 className="text-2xl font-semibold flex items-center gap-1 tracking-normal text-gray-700">
              Commit Changes
            </h3>
            <div className="text-xs leading-5 text-gray-600">
              {!hasChanges ? (
                <>
                  Your{" "}
                  <span className="p-0.5 border border-gray-300 px-1 shadow-xs bg-gray-200 rounded-sm text-gray-700">
                    README.md
                  </span>{" "}
                  appears to be unchanged from the version in your repository.
                </>
              ) : (
                <>
                  A commit will save your modifications to{" "}
                  <span className="p-0.5 border border-gray-300 px-1 shadow-xs bg-gray-200 rounded-sm text-gray-700">
                    README.md
                  </span>{" "}
                  and push them to your repository.
                  <span className="flex gap-4 text-xs text-gray-600 mt-4">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
                      Added lines
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div>
                      Removed lines
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-2 overflow-y-auto max-h-[calc(90vh-200px)]">
            {!hasChanges ? (
              <div className="text-center py-8 text-gray-500">
                <EyeOffIcon className="size-16 mx-auto mb-4 opacity-50 stroke-1" />
                <h4 className=" font-medium mb-2 text-lg">
                  No Changes to Commit
                </h4>
              </div>
            ) : (
              <>
                <div className="mb-6 flex-1">
                  <DiffView
                    originalContent={originalContent}
                    modifiedContent={modifiedContent}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {hasChanges && (
          <div className="mb-4 px-5">
            <label className="block font-medium text-gray-700 mb-2 text-xs">
              Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full p-3 border bg-white shadow-xs border-gray-200 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your changes..."
              disabled={isLoading}
              maxLength={100}
              required
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border text-sm shadow-xs border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </button>
          {hasChanges && (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !commitMessage.trim()}
              className="px-4 py-2 bg-gray-600 shadow-xs text-sm text-white font-semibold tracking-normal rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4">
                    <Loader className="size-4" />
                  </div>
                  Committing...
                </>
              ) : (
                "Commit & Push"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
