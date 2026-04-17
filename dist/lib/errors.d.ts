export declare class CliError extends Error {
    readonly code: number;
    constructor(message: string, code?: number);
}
export declare function fail(message: string, code?: number): never;
export declare function formatError(error: unknown): string;
//# sourceMappingURL=errors.d.ts.map