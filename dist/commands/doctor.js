import * as path from "path";
import { parseArgs, readFlag, readString } from "../lib/args.js";
import { exists, isExecutable, readText, resolvePath } from "../lib/files.js";
import { PROJECT_REQUIRED, REPO_REQUIRED, runValidation } from "./validate.js";
export function detectMode(root) {
    if (exists(path.join(root, ".claude-plugin", "plugin.json")) &&
        exists(path.join(root, "templates"))) {
        return "repo";
    }
    if (exists(path.join(root, "99_meta", "scaffold_decisions.md"))) {
        return "project";
    }
    return "unknown";
}
function existsCheck(root, name, rels, fix = "") {
    const missing = rels.filter((rel) => !exists(path.join(root, rel)));
    return {
        name,
        ok: missing.length === 0,
        detail: missing.length === 0 ? "ok" : `missing: ${missing.join(", ")}`,
        fix,
    };
}
export function parseRuntimeConfig(root) {
    const config = path.join(root, "99_meta", "scaffold_decisions.md");
    const values = {};
    if (!exists(config)) {
        return values;
    }
    let inBlock = false;
    for (const line of readText(config).split(/\r?\n/)) {
        if (line.trim() === "```yaml") {
            inBlock = true;
            continue;
        }
        if (inBlock && line.trim() === "```") {
            break;
        }
        if (inBlock && line.includes(":")) {
            const separator = line.indexOf(":");
            const key = line.slice(0, separator).trim();
            const value = line
                .slice(separator + 1)
                .trim()
                .replace(/^"|"$/g, "");
            values[key] = value;
        }
    }
    return values;
}
function jsonManifestCheck(root, rel, name, fix) {
    const filePath = path.join(root, rel);
    if (!exists(filePath)) {
        return { name, ok: false, detail: `missing ${rel}`, fix };
    }
    try {
        const data = JSON.parse(readText(filePath));
        const missing = ["name", "version", "description", "skills", "license", "repository"].filter((key) => !(key in data));
        return {
            name,
            ok: missing.length === 0,
            detail: missing.length === 0 ? "ok" : `missing keys: ${missing.join(", ")}`,
            fix: "Add required plugin metadata",
        };
    }
    catch (error) {
        return { name, ok: false, detail: `invalid JSON: ${String(error)}`, fix };
    }
}
function codexMarketplaceCheck(root) {
    const marketplace = path.join(root, ".agents", "plugins", "marketplace.json");
    if (!exists(marketplace)) {
        return {
            name: "Codex marketplace",
            ok: false,
            detail: "missing .agents/plugins/marketplace.json",
            fix: "Restore Codex marketplace metadata",
        };
    }
    try {
        const data = JSON.parse(readText(marketplace));
        const plugins = Array.isArray(data.plugins) ? data.plugins : [];
        const hasRds = plugins.some((plugin) => {
            return (typeof plugin === "object" &&
                plugin !== null &&
                plugin.name === "rds");
        });
        if (!hasRds) {
            return {
                name: "Codex marketplace",
                ok: false,
                detail: "missing rds plugin entry",
                fix: "Add rds to marketplace plugins",
            };
        }
        return { name: "Codex marketplace", ok: true, detail: "ok" };
    }
    catch (error) {
        return {
            name: "Codex marketplace",
            ok: false,
            detail: `invalid JSON: ${String(error)}`,
            fix: "Fix marketplace.json",
        };
    }
}
function claudeMarketplaceCheck(root) {
    const marketplace = path.join(root, ".claude-plugin", "marketplace.json");
    if (!exists(marketplace)) {
        return {
            name: "Claude marketplace",
            ok: false,
            detail: "missing .claude-plugin/marketplace.json",
            fix: "Restore Claude marketplace metadata",
        };
    }
    try {
        const data = JSON.parse(readText(marketplace));
        const plugins = Array.isArray(data.plugins) ? data.plugins : [];
        const hasRds = plugins.some((plugin) => {
            return (typeof plugin === "object" &&
                plugin !== null &&
                plugin.name === "rds");
        });
        if (!hasRds) {
            return {
                name: "Claude marketplace",
                ok: false,
                detail: "missing rds plugin entry",
                fix: "Add rds to marketplace plugins",
            };
        }
        return { name: "Claude marketplace", ok: true, detail: "ok" };
    }
    catch (error) {
        return {
            name: "Claude marketplace",
            ok: false,
            detail: `invalid JSON: ${String(error)}`,
            fix: "Fix marketplace.json",
        };
    }
}
function nodeCheck() {
    const major = Number((process.versions.node ?? "0").split(".")[0]);
    const ok = major >= 20;
    return {
        name: "Node.js runtime",
        ok,
        detail: process.version,
        fix: "Use Node.js 20 or newer",
    };
}
function backendCheck(root, mode) {
    if (mode !== "repo") {
        return { name: "Backend availability", ok: true, detail: "using caller backend" };
    }
    const backend = path.join(root, "bin", "rds");
    if (!exists(backend)) {
        return {
            name: "Backend availability",
            ok: false,
            detail: "missing bin/rds",
            fix: "Restore bin/rds",
        };
    }
    if (!isExecutable(backend)) {
        return {
            name: "Backend availability",
            ok: false,
            detail: "bin/rds is not executable",
            fix: "chmod +x bin/rds",
        };
    }
    const cli = path.join(root, "dist", "cli.js");
    if (!exists(cli)) {
        return {
            name: "Backend availability",
            ok: false,
            detail: "missing dist/cli.js",
            fix: "Run npm run build",
        };
    }
    return { name: "Backend availability", ok: true, detail: "Node backend executable" };
}
function repoChecks(root) {
    return [
        nodeCheck(),
        backendCheck(root, "repo"),
        jsonManifestCheck(root, ".claude-plugin/plugin.json", "Claude plugin manifest", "Restore plugin manifest"),
        claudeMarketplaceCheck(root),
        jsonManifestCheck(root, ".codex-plugin/plugin.json", "Codex plugin manifest", "Restore plugin manifest"),
        codexMarketplaceCheck(root),
        existsCheck(root, "TypeScript backend", ["package.json", "tsconfig.json", "src/cli.ts", "dist/cli.js"], "Run npm run build"),
        existsCheck(root, "Codex installer assets", [
            "src/commands/codex.ts",
            "skills/rds-setup/SKILL.md",
            "skills/rds-doctor/SKILL.md",
            "core/setup_protocol.md",
            "templates/99_meta/rds_version.md",
        ], "Restore Codex installer source assets"),
        existsCheck(root, "Skill surfaces", [
            "skills/rds-setup/SKILL.md",
            "skills/rds-doctor/SKILL.md",
            "skills/rds-resume/SKILL.md",
            "skills/rds-new-discussion/SKILL.md",
            "skills/rds-close-discussion/SKILL.md",
            "skills/rds-convert-linking/SKILL.md",
            "skills/rds-link-check/SKILL.md",
            "skills/setup/SKILL.md",
            "skills/doctor/SKILL.md",
        ], "Restore missing skill files"),
        existsCheck(root, "Setup phases", [
            "skills/rds-setup/phases/00-detect.md",
            "skills/rds-setup/phases/01-interview.md",
            "skills/rds-setup/phases/02-scaffold.md",
            "skills/rds-setup/phases/03-enrich-context.md",
            "skills/rds-setup/phases/04-validate-welcome.md",
        ], "Restore setup phase files"),
        existsCheck(root, "Gemini commands", [
            ".gemini/commands/rds/setup.toml",
            ".gemini/commands/rds/doctor.toml",
            ".gemini/commands/rds/resume.toml",
            ".gemini/commands/rds/new-discussion.toml",
            ".gemini/commands/rds/close-discussion.toml",
            ".gemini/commands/rds/convert-linking.toml",
            ".gemini/commands/rds/link-check.toml",
        ], "Restore Gemini command files"),
        existsCheck(root, "Agent adapters", ["adapters/claude-cowork/CLAUDE.md", "adapters/codex/AGENTS.md", "adapters/gemini/GEMINI.md"], "Restore adapter templates"),
        existsCheck(root, "User guide docs", [
            "README.md",
            "README.ko.md",
            "docs/guides/getting_started.md",
            "docs/guides/getting_started.ko.md",
            "docs/guides/setup_flow.md",
            "docs/guides/setup_flow.ko.md",
            "docs/guides/skills.md",
            "docs/guides/skills.ko.md",
            "docs/guides/obsidian_integration.md",
            "docs/guides/obsidian_integration.ko.md",
            "docs/guides/safety.md",
            "docs/guides/safety.ko.md",
            "docs/guides/faq.md",
            "docs/guides/faq.ko.md",
        ], "Restore user-facing docs"),
        existsCheck(root, "Development docs", [
            "docs/development/architecture.md",
            "docs/development/agent_adapters.md",
            "docs/development/agent_adapters.ko.md",
            "docs/development/contributing.md",
            "docs/development/open_source.md",
            "docs/development/open_source.ko.md",
        ], "Restore development docs"),
    ];
}
function projectChecks(root) {
    const runtime = parseRuntimeConfig(root);
    const linking = runtime.linking_mode ?? "unknown";
    const validLinking = linking === "plain" || linking === "obsidian";
    const discussionIndex = path.join(root, "04_discussions", "_index.md");
    const indexMentionsDiscussions = exists(discussionIndex) && readText(discussionIndex).includes("Discussion Index");
    const obsidianDetail = linking === "obsidian"
        ? "obsidian-enhanced mode"
        : linking === "plain"
            ? "plain markdown mode"
            : "unknown";
    return [
        nodeCheck(),
        backendCheck(root, "project"),
        existsCheck(root, "RDS Project structure", ["00_context", "04_discussions", "05_literature", "99_meta"], "Run RDS setup or restore fixed folders"),
        existsCheck(root, "Agent instructions", ["CLAUDE.md", "AGENTS.md", "GEMINI.md"], "Regenerate agent adapters"),
        existsCheck(root, "Runtime config", ["99_meta/scaffold_decisions.md"], "Regenerate scaffold decisions"),
        {
            name: "Linking mode",
            ok: validLinking,
            detail: linking !== "unknown" ? linking : "missing or unreadable",
            fix: "Set linking_mode to plain or obsidian",
        },
        {
            name: "Obsidian compatibility",
            ok: validLinking,
            detail: obsidianDetail,
            fix: "Run convert-linking or update scaffold_decisions.md",
        },
        {
            name: "Discussion index",
            ok: indexMentionsDiscussions,
            detail: indexMentionsDiscussions ? "ok" : "missing or malformed 04_discussions/_index.md",
            fix: "Run rds update-index",
        },
        existsCheck(root, "Safety policy", ["99_meta/safety_and_data_policy.md"], "Restore safety policy"),
        existsCheck(root, "Durable context", [
            "00_context/project_overview.md",
            "00_context/decisions_log.md",
            "00_context/open_questions.md",
            "00_context/evidence_register.md",
            "00_context/assumptions.md",
        ], "Restore context templates"),
    ];
}
function unknownChecks() {
    return [
        nodeCheck(),
        {
            name: "RDS root detection",
            ok: false,
            detail: "not an RDS framework repository or generated RDS Project",
            fix: "Run setup in a target research folder or pass --repo/--project",
        },
    ];
}
function renderTable(checks) {
    console.log("| Check | Status | Detail | Recommended fix |");
    console.log("|---|---|---|---|");
    for (const check of checks) {
        const status = check.ok ? "pass" : "fail";
        const fix = check.ok ? "" : (check.fix ?? "");
        const detail = check.detail.replace(/\s+/g, " ");
        console.log(`| ${check.name} | ${status} | ${detail} | ${fix} |`);
    }
}
export function runDoctor(root, mode, checkLinks) {
    console.log("RDS Doctor Report");
    console.log(`Root: ${root}`);
    console.log(`Mode: ${mode}`);
    console.log();
    let checks;
    let validationStatus = 1;
    if (mode === "repo") {
        checks = repoChecks(root);
        validationStatus = runValidation("Repository", root, REPO_REQUIRED, checkLinks);
    }
    else if (mode === "project") {
        checks = projectChecks(root);
        validationStatus = runValidation("Project", root, PROJECT_REQUIRED, checkLinks);
    }
    else {
        checks = unknownChecks();
    }
    console.log();
    renderTable(checks);
    const failed = checks.filter((check) => !check.ok);
    if (failed.length > 0) {
        console.log();
        console.log("Recommended next steps:");
        for (const check of failed) {
            console.log(`- ${check.name}: ${check.fix ?? ""}`);
        }
        return 1;
    }
    if (validationStatus !== 0) {
        return validationStatus;
    }
    console.log();
    console.log("Doctor passed");
    return 0;
}
export function doctorCommand(argv, cwd = process.cwd()) {
    const args = parseArgs(argv);
    const repoArg = readString(args, "repo");
    const projectArg = readString(args, "project");
    const checkLinks = readFlag(args, "check-links");
    const root = resolvePath(repoArg ?? projectArg ?? ".", cwd);
    const mode = repoArg ? "repo" : projectArg ? "project" : detectMode(root);
    return runDoctor(root, mode, checkLinks);
}
//# sourceMappingURL=doctor.js.map