import * as path from "path";
import { parseArgs, readChoice, readString } from "../lib/args.js";
import { hasPathPart, readText, resolvePath, toPosix, walkFiles, writeText, exists, } from "../lib/files.js";
const LINKING_CHOICES = ["plain", "obsidian"];
const MD_LINK = /\[([^\]]+)\]\(([^)]+\.md)(#[^)]+)?\)/g;
const WIKI_LINK = /\[\[([^\]|#]+)(#[^\]|]+)?(?:\|([^\]]+))?\]\]/g;
function markdownTargetToWiki(linkPath, sourceFile, project) {
    const trimmed = linkPath.trim();
    if (sourceFile && project) {
        const absoluteTarget = path.resolve(path.dirname(sourceFile), trimmed);
        const relativeToProject = path.relative(project, absoluteTarget);
        if (relativeToProject &&
            !relativeToProject.startsWith("..") &&
            !path.isAbsolute(relativeToProject)) {
            return toPosix(relativeToProject).replace(/\.md$/, "");
        }
    }
    let clean = trimmed;
    if (clean.startsWith("./")) {
        clean = clean.slice(2);
    }
    return clean.replace(/\.md$/, "");
}
function wikiTargetToMarkdown(linkPath, sourceFile, project) {
    const withExtension = linkPath.endsWith(".md") ? linkPath : `${linkPath}.md`;
    if (sourceFile && project) {
        const absoluteTarget = path.resolve(project, withExtension);
        const relativeToSource = path.relative(path.dirname(sourceFile), absoluteTarget);
        if (relativeToSource && !relativeToSource.startsWith("..")) {
            return toPosix(relativeToSource);
        }
        return toPosix(relativeToSource);
    }
    return withExtension;
}
export function toObsidian(text, sourceFile, project) {
    return text.replace(MD_LINK, (_match, label, linkPath, anchor) => {
        const clean = markdownTargetToWiki(linkPath, sourceFile, project);
        return `[[${clean}${anchor ?? ""}|${label}]]`;
    });
}
export function toPlain(text, sourceFile, project) {
    return text.replace(WIKI_LINK, (_match, linkPath, anchor, label) => {
        const visibleLabel = label ?? path.basename(linkPath);
        const clean = wikiTargetToMarkdown(linkPath, sourceFile, project);
        return `[${visibleLabel}](${clean}${anchor ?? ""})`;
    });
}
function updateConfig(project, mode) {
    const config = path.join(project, "99_meta", "scaffold_decisions.md");
    if (!exists(config)) {
        return;
    }
    const text = readText(config).replace(/linking_mode:\s*"?\w+"?/g, `linking_mode: "${mode}"`);
    writeText(config, text);
}
export function convertLinkingCommand(argv, cwd = process.cwd()) {
    const args = parseArgs(argv);
    const targetArg = readString(args, "target", true);
    const mode = readChoice(args, "to", LINKING_CHOICES);
    const project = resolvePath(targetArg, cwd);
    const changed = [];
    for (const filePath of walkFiles(project)) {
        if (hasPathPart(filePath, ".git") || !filePath.endsWith(".md")) {
            continue;
        }
        const oldText = readText(filePath);
        const newText = mode === "obsidian"
            ? toObsidian(oldText, filePath, project)
            : toPlain(oldText, filePath, project);
        if (newText !== oldText) {
            writeText(filePath, newText);
            changed.push(filePath);
        }
    }
    updateConfig(project, mode);
    console.log(`Converted links to ${mode}. Changed ${changed.length} file(s).`);
    for (const filePath of changed) {
        console.log(filePath);
    }
    return 0;
}
//# sourceMappingURL=convert-linking.js.map