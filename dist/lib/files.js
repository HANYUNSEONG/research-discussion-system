import * as fs from "fs";
import * as path from "path";
export function expandHome(input) {
    if (input === "~") {
        return process.env.HOME ?? process.env.USERPROFILE ?? input;
    }
    if (input.startsWith("~/") || input.startsWith("~\\")) {
        const home = process.env.HOME ?? process.env.USERPROFILE;
        if (home) {
            return path.join(home, input.slice(2));
        }
    }
    return input;
}
export function resolvePath(input, base = process.cwd()) {
    const expanded = expandHome(input);
    return path.isAbsolute(expanded) ? path.resolve(expanded) : path.resolve(base, expanded);
}
export function exists(filePath) {
    return fs.existsSync(filePath);
}
export function isExecutable(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.X_OK);
        return true;
    }
    catch {
        return false;
    }
}
export function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}
export function readText(filePath) {
    return fs.readFileSync(filePath, "utf8");
}
export function writeText(filePath, text) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, text, "utf8");
}
export function listDir(dirPath) {
    if (!exists(dirPath)) {
        return [];
    }
    return fs.readdirSync(dirPath);
}
export function isNonEmptyDir(dirPath) {
    return exists(dirPath) && fs.statSync(dirPath).isDirectory() && listDir(dirPath).length > 0;
}
export function toPosix(relativePath) {
    return relativePath.split(path.sep).join("/");
}
export function hasPathPart(filePath, part) {
    return filePath.split(path.sep).includes(part);
}
export function walkFiles(root, shouldSkipDir = () => false) {
    if (!exists(root)) {
        return [];
    }
    const files = [];
    const visit = (current) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (!shouldSkipDir(fullPath)) {
                    visit(fullPath);
                }
            }
            else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
    };
    visit(root);
    return files;
}
export function localDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
//# sourceMappingURL=files.js.map