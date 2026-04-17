import * as fs from "fs";
import * as path from "path";

export function expandHome(input: string): string {
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

export function resolvePath(input: string, base = process.cwd()): string {
  const expanded = expandHome(input);
  return path.isAbsolute(expanded) ? path.resolve(expanded) : path.resolve(base, expanded);
}

export function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function isExecutable(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath: string, text: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, "utf8");
}

export function listDir(dirPath: string): string[] {
  if (!exists(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath);
}

export function isNonEmptyDir(dirPath: string): boolean {
  return exists(dirPath) && fs.statSync(dirPath).isDirectory() && listDir(dirPath).length > 0;
}

export function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

export function hasPathPart(filePath: string, part: string): boolean {
  return filePath.split(path.sep).includes(part);
}

export function walkFiles(root: string): string[] {
  if (!exists(root)) {
    return [];
  }

  const files: string[] = [];
  const visit = (current: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  };

  visit(root);
  return files;
}

export function localDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
