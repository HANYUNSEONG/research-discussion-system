export declare const REPO_REQUIRED: string[];
export declare const PROJECT_REQUIRED: string[];
export declare function checkRequired(root: string, required: string[]): string[];
export declare function checkLinks(root: string): string[];
export declare function runValidation(label: string, root: string, required: string[], links: boolean): number;
export declare function validateCommand(argv: string[], cwd?: string): number;
//# sourceMappingURL=validate.d.ts.map