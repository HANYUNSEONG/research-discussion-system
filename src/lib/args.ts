import { fail } from "./errors.js";

export interface ParsedArgs {
  values: Record<string, string | boolean>;
  positionals: string[];
}

export function parseArgs(argv: string[]): ParsedArgs {
  const values: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const withoutPrefix = arg.slice(2);
    const equals = withoutPrefix.indexOf("=");
    if (equals >= 0) {
      values[withoutPrefix.slice(0, equals)] = withoutPrefix.slice(equals + 1);
      continue;
    }

    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith("--")) {
      values[withoutPrefix] = next;
      index += 1;
    } else {
      values[withoutPrefix] = true;
    }
  }

  return { values, positionals };
}

export function readString(args: ParsedArgs, key: string, required = false): string | undefined {
  const value = args.values[key];
  if (value === undefined) {
    if (required) {
      fail(`Missing required option: --${key}`, 2);
    }
    return undefined;
  }
  if (typeof value !== "string") {
    fail(`Missing value for --${key}`, 2);
  }
  return value;
}

export function readFlag(args: ParsedArgs, key: string): boolean {
  return args.values[key] === true;
}

export function readChoice<T extends string>(
  args: ParsedArgs,
  key: string,
  choices: readonly T[],
  fallback?: T,
): T {
  const raw = readString(args, key, fallback === undefined);
  const value = raw ?? fallback;
  if (value === undefined) {
    fail(`Missing required option: --${key}`, 2);
  }
  if (!choices.includes(value as T)) {
    fail(`Invalid --${key}: ${value}. Expected one of: ${choices.join(", ")}`, 2);
  }
  return value as T;
}
