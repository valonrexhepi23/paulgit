import { marked } from "marked";

const preprocessTaskLists = (markdown: string): { processed: string, taskListPlaceholders: any[] } => {
    if (!markdown || typeof markdown !== "string") {
        return { processed: "", taskListPlaceholders: [] };
    }

    const taskListPlaceholders: Array<{ placeholder: string; html: string }> =
        [];
    let placeholderCount = 0;

    const taskListRegex = /^((?:- \[[ x]\] .+\n?)+)/gm;

    const processed = markdown.replace(taskListRegex, (match) => {
        const lines = match.trim().split("\n");
        const items = lines
            .map((line) => {
                const taskMatch = line.match(/^- \[([ x])\] (.+)$/);
                if (taskMatch) {
                    const checked = taskMatch[1] === "x";
                    const text = taskMatch[2].trim();
                    return `<li data-checked="${checked}" data-type="taskItem">
          <label contenteditable="false">
            <input type="checkbox" ${checked ? "checked" : ""}>
            <span></span>
          </label>
          <div><p>${text}</p></div>
        </li>`;
                }
                return "";
            })
            .filter((item) => item)
            .join("\n");

        const taskListHtml = `<ul data-type="taskList">${items}</ul>`;
        console.log("taskListHtml", taskListHtml);

        const placeholder = `<p>TASKLIST_PLACEHOLDER_${placeholderCount++}</p>`;
        taskListPlaceholders.push({ placeholder, html: taskListHtml });

        return placeholder;
    });

    return { processed, taskListPlaceholders };
};

const restoreTaskLists = (
    html: string,
    taskListPlaceholders: Array<{ placeholder: string; html: string }>
) => {
    if (!html || typeof html !== "string") {
        return html;
    }

    if (!taskListPlaceholders || taskListPlaceholders.length === 0) {
        return html;
    }

    let result = html;
    taskListPlaceholders.forEach(({ placeholder, html: taskListHtml }) => {
        result = result.replace(`<p>${placeholder}</p>`, taskListHtml);
        result = result.replace(placeholder, taskListHtml);
    });
    return result;
};

export const convertMarkdownToHtml = async (content: string) => {
    if (!content || content.includes("No profile README found")) {
        return "<p>Start writing your README...</p>";
    }

    try {
        console.log("content", content);

        const { processed, taskListPlaceholders } = preprocessTaskLists(content);

        const html = await marked.parse(processed);

        const finalHtml = restoreTaskLists(html, taskListPlaceholders);
        return finalHtml;
    } catch (error) {
        console.error("Error parsing markdown:", error);
        return `<pre>${content}</pre>`;
    }
};