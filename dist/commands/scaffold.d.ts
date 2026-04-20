export declare const SCAFFOLD_FOLDERS: Record<string, string[]>;
export declare const ADAPTER_TEMPLATE_FILES: readonly [{
    readonly sourceRel: "adapters/codex/AGENTS.md";
    readonly projectRel: "AGENTS.md";
}, {
    readonly sourceRel: "adapters/gemini/GEMINI.md";
    readonly projectRel: "GEMINI.md";
}, {
    readonly sourceRel: "adapters/claude-cowork/CLAUDE.md";
    readonly projectRel: "CLAUDE.md";
}];
export declare function slugify(value: string): string;
export declare function scaffoldCommand(argv: string[], repoRoot: string, cwd?: string): number;
//# sourceMappingURL=scaffold.d.ts.map