#!/usr/bin/env node
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { scaffoldCommand } from "./commands/scaffold.js";
import { validateCommand } from "./commands/validate.js";
import { doctorCommand } from "./commands/doctor.js";
import { updateIndexCommand } from "./commands/update-index.js";
import { convertLinkingCommand } from "./commands/convert-linking.js";
import { CliError, formatError } from "./lib/errors.js";
export function usage() {
    return `RDS command wrapper

Usage:
  rds scaffold [options]        Create an RDS Project
  rds setup [options]           Alias for scaffold
  rds validate [options]        Validate an RDS Project or framework repo
  rds doctor [options]          Diagnose an RDS Project or framework repo
  rds update-index [options]    Rebuild 04_discussions/_index.md
  rds convert-linking [options] Convert links between plain and obsidian modes
  rds help                      Show this help

Examples:
  rds scaffold --target ./my-project --field "biology" --topic "project topic" --scaffold wet_lab
  rds validate --project ./my-project
  rds doctor --project ./my-project
  rds update-index --project ./my-project
  rds convert-linking --target ./my-project --to obsidian`;
}
export function repoRootFromDist() {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}
export function run(argv, cwd = process.cwd(), repoRoot = repoRootFromDist()) {
    if (argv.length === 0) {
        console.log(usage());
        return 0;
    }
    const [command, ...rest] = argv;
    switch (command) {
        case "scaffold":
        case "setup":
            return scaffoldCommand(rest, repoRoot, cwd);
        case "validate":
            return rest.length === 0
                ? validateCommand(["--project", "."], cwd)
                : validateCommand(rest, cwd);
        case "doctor":
            return doctorCommand(rest, cwd);
        case "update-index":
            return updateIndexCommand(rest, cwd);
        case "convert-linking":
            return convertLinkingCommand(rest, cwd);
        case "help":
        case "-h":
        case "--help":
            console.log(usage());
            return 0;
        default:
            console.error(`Unknown command: ${command}`);
            console.error(usage());
            return 2;
    }
}
const isEntrypoint = typeof process.argv[1] === "string" && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntrypoint) {
    try {
        const status = run(process.argv.slice(2));
        process.exit(status);
    }
    catch (error) {
        console.error(formatError(error));
        process.exit(error instanceof CliError ? error.code : 1);
    }
}
//# sourceMappingURL=cli.js.map