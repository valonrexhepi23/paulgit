import TurndownService from "turndown";

export const turndownService = new TurndownService();

turndownService.addRule("taskList", {
    filter: function (node) {
        return (
            node.nodeName === "UL" && node.getAttribute("data-type") === "taskList"
        );
    },
    replacement: function (content) {
        return "\n" + content + "\n";
    },
});

turndownService.addRule("taskItem", {
    filter: function (node) {
        return (
            node.nodeName === "LI" && node.getAttribute("data-type") === "taskItem"
        );
    },
    replacement: function (content, node) {
        const isChecked = node.getAttribute("data-checked") === "true";
        const checkboxMark = isChecked ? "- [x]" : "- [ ]";

        const cleanContent = content.trim().replace(/\n+/g, " ");

        return checkboxMark + " " + cleanContent + "\n";
    },
});

turndownService.keep(["del"]);