export declare function detectMode(root: string): "repo" | "project" | "unknown";
export declare function parseRuntimeConfig(root: string): Record<string, string>;
export declare function runDoctor(root: string, mode: "repo" | "project" | "unknown", checkLinks: boolean): number;
export declare function doctorCommand(argv: string[], cwd?: string): number;
//# sourceMappingURL=doctor.d.ts.map