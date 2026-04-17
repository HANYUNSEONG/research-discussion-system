export class CliError extends Error {
    code;
    constructor(message, code = 1) {
        super(message);
        this.name = "CliError";
        this.code = code;
    }
}
export function fail(message, code = 1) {
    throw new CliError(message, code);
}
export function formatError(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
//# sourceMappingURL=errors.js.map