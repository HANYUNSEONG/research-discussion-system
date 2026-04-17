export declare function expandHome(input: string): string;
export declare function resolvePath(input: string, base?: string): string;
export declare function exists(filePath: string): boolean;
export declare function isExecutable(filePath: string): boolean;
export declare function ensureDir(dirPath: string): void;
export declare function readText(filePath: string): string;
export declare function writeText(filePath: string, text: string): void;
export declare function listDir(dirPath: string): string[];
export declare function isNonEmptyDir(dirPath: string): boolean;
export declare function toPosix(relativePath: string): string;
export declare function hasPathPart(filePath: string, part: string): boolean;
export declare function walkFiles(root: string): string[];
export declare function localDate(): string;
//# sourceMappingURL=files.d.ts.map