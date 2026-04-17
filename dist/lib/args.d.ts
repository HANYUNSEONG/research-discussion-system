export interface ParsedArgs {
    values: Record<string, string | boolean>;
    positionals: string[];
}
export declare function parseArgs(argv: string[]): ParsedArgs;
export declare function readString(args: ParsedArgs, key: string, required?: boolean): string | undefined;
export declare function readFlag(args: ParsedArgs, key: string): boolean;
export declare function readChoice<T extends string>(args: ParsedArgs, key: string, choices: readonly T[], fallback?: T): T;
//# sourceMappingURL=args.d.ts.map