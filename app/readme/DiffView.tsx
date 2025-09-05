import { EyeIcon } from "lucide-react";

function generateDiff(original: string, modified: string) {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");

  const m = originalLines.length;
  const n = modifiedLines.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalLines[i - 1] === modifiedLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = m,
    j = n;
  let originalLineNum = m;
  let modifiedLineNum = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
      diff.unshift({
        type: "unchanged",
        content: originalLines[i - 1],
        originalLineNumber: i,
        modifiedLineNumber: j,
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      diff.unshift({
        type: "removed",
        content: originalLines[i - 1],
        originalLineNumber: i,
        modifiedLineNumber: null,
      });
      i--;
    } else {
      diff.unshift({
        type: "added",
        content: modifiedLines[j - 1],
        originalLineNumber: null,
        modifiedLineNumber: j,
      });
      j--;
    }
  }

  return diff;
}

interface DiffViewProps {
  originalContent: string;
  modifiedContent: string;
}

export default function DiffView({
  originalContent,
  modifiedContent,
}: DiffViewProps) {
  const diff = generateDiff(originalContent, modifiedContent);
  const hasChanges = diff.some((line) => line.type !== "unchanged");

  if (!hasChanges) {
    return (
      <div className="text-center py-8 text-gray-500">
        <EyeIcon className="size-12 mx-auto mb-2 opacity-50" />
        <p className="text-xl">No changes detected</p>
      </div>
    );
  }

  return (
    <div
      className=" max-h-96 flex flex-col overflow-y-auto rounded-lg         
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="flex-1 bg-white drop-shadow-sm py-4 pr-4">
        <div className="font-mono text-sm space-y-1">
          {diff.map((line, index) => (
            <div
              key={index}
              className={`px-1 py-1 flex text-xs ${
                line.type === "added"
                  ? "bg-green-100 text-green-800 border-l-2 border-green-500"
                  : line.type === "removed"
                  ? "bg-red-100 text-red-800 border-l-2 border-red-500"
                  : "text-gray-400"
              }`}
            >
              <div className="flex-shrink-0 w-16 text-right mr-2 opacity-50">
                <span className="inline-block w-6 mr-1">
                  {line.originalLineNumber || ""}
                </span>
                <span className="inline-block w-6 mr-1">
                  {line.modifiedLineNumber || ""}
                </span>
              </div>
              <span className="mr-2 font-bold flex-shrink-0">
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                  ? "-"
                  : " "}
              </span>
              <span className="whitespace-pre-wrap flex-1">
                {line.content || " "}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
