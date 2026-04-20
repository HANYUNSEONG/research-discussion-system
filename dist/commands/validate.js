import * as path from "path";
import { parseArgs, readFlag, readString } from "../lib/args.js";
import { exists, hasPathPart, readText, resolvePath, toPosix, walkFiles } from "../lib/files.js";
import { fail } from "../lib/errors.js";
export const REPO_REQUIRED = [
    "README.md",
    "README.ko.md",
    "package.json",
    "tsconfig.json",
    "bin/rds",
    "src/cli.ts",
    "src/commands/codex.ts",
    "dist/cli.js",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    ".codex-plugin/plugin.json",
    ".agents/plugins/marketplace.json",
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
    "docs/development/architecture.md",
    "docs/development/agent_adapters.md",
    "docs/development/agent_adapters.ko.md",
    "docs/development/contributing.md",
    "docs/development/open_source.md",
    "docs/development/open_source.ko.md",
    "core/setup_prompt.md",
    "core/setup_protocol.md",
    "core/linking_conventions.md",
    "core/global_instructions.md",
    "core/folder_instructions.md",
    "core/agent_adapter_contract.md",
    "scaffolds/wet_lab.md",
    "templates/00_context/user_profile.md",
    "templates/00_context/project_overview.md",
    "templates/04_discussions/_discussion.md",
    "templates/04_discussions/_index.md",
    "templates/99_meta/scaffold_decisions.md",
    "templates/99_meta/rds_version.md",
    "skills/rds-setup/SKILL.md",
    "skills/rds-doctor/SKILL.md",
    "skills/rds-resume/SKILL.md",
    "skills/rds-new-discussion/SKILL.md",
    "skills/rds-close-discussion/SKILL.md",
    "skills/rds-convert-linking/SKILL.md",
    "skills/rds-link-check/SKILL.md",
    "skills/rds-setup/phases/00-detect.md",
    "skills/rds-setup/phases/01-interview.md",
    "skills/rds-setup/phases/02-scaffold.md",
    "skills/rds-setup/phases/03-enrich-context.md",
    "skills/rds-setup/phases/04-validate-welcome.md",
    "skills/setup/SKILL.md",
    "skills/doctor/SKILL.md",
    "skills/resume/SKILL.md",
    "skills/new-discussion/SKILL.md",
    "skills/close-discussion/SKILL.md",
    "skills/convert-linking/SKILL.md",
    "skills/link-check/SKILL.md",
    ".gemini/commands/rds/setup.toml",
    ".gemini/commands/rds/doctor.toml",
    ".gemini/commands/rds/resume.toml",
    ".gemini/commands/rds/new-discussion.toml",
    ".gemini/commands/rds/close-discussion.toml",
    ".gemini/commands/rds/convert-linking.toml",
    ".gemini/commands/rds/link-check.toml",
    "adapters/claude-cowork/CLAUDE.md",
    "adapters/codex/AGENTS.md",
    "adapters/gemini/GEMINI.md",
];
export const PROJECT_REQUIRED = [
    "00_context/user_profile.md",
    "00_context/project_overview.md",
    "00_context/decisions_log.md",
    "00_context/open_questions.md",
    "00_context/evidence_register.md",
    "00_context/assumptions.md",
    "04_discussions/_index.md",
    "05_literature",
    "99_meta/scaffold_decisions.md",
    "99_meta/rds_version.md",
    "99_meta/rds_agent_contract.md",
    "99_meta/safety_and_data_policy.md",
    "CLAUDE.md",
    "AGENTS.md",
    "GEMINI.md",
];
const LINK_RE = /\[[^\]]+\]\(([^)]+)\)/g;
const WIKI_RE = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
const FENCED_CODE_RE = /(^|\n)```[\s\S]*?(\n```|$)/g;
const INLINE_CODE_RE = /`[^`\n]*`/g;
export function checkRequired(root, required) {
    const problems = [];
    for (const rel of required) {
        if (!exists(path.join(root, rel))) {
            problems.push(`missing: ${rel}`);
        }
    }
    return problems;
}
export function checkLinks(root) {
    const problems = [];
    for (const filePath of walkFiles(root)) {
        if (hasPathPart(filePath, ".git") || !filePath.endsWith(".md")) {
            continue;
        }
        const text = readText(filePath).replace(FENCED_CODE_RE, "\n").replace(INLINE_CODE_RE, "");
        LINK_RE.lastIndex = 0;
        WIKI_RE.lastIndex = 0;
        let markdownMatch;
        while ((markdownMatch = LINK_RE.exec(text)) !== null) {
            const href = markdownMatch[1].split("#", 1)[0];
            if (!href ||
                href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("mailto:")) {
                continue;
            }
            const target = path.resolve(path.dirname(filePath), href);
            if (!exists(target)) {
                problems.push(`broken markdown link in ${toPosix(path.relative(root, filePath))}: ${href}`);
            }
        }
        let wikiMatch;
        while ((wikiMatch = WIKI_RE.exec(text)) !== null) {
            const href = wikiMatch[1];
            const candidates = [path.join(root, href), path.join(root, `${href}.md`)];
            if (!candidates.some((candidate) => exists(candidate))) {
                problems.push(`unresolved wiki link in ${toPosix(path.relative(root, filePath))}: ${href}`);
            }
        }
    }
    return problems;
}
export function runValidation(label, root, required, links) {
    const problems = checkRequired(root, required);
    if (links) {
        problems.push(...checkLinks(root));
    }
    if (problems.length > 0) {
        console.log(`${label} validation failed for ${root}`);
        for (const problem of problems) {
            console.log(`- ${problem}`);
        }
        return 1;
    }
    console.log(`${label} validation passed for ${root}`);
    return 0;
}
export function validateCommand(argv, cwd = process.cwd()) {
    const args = parseArgs(argv);
    const repoArg = readString(args, "repo");
    const projectArg = readString(args, "project");
    const links = readFlag(args, "check-links");
    if ((repoArg && projectArg) || (!repoArg && !projectArg)) {
        fail("Specify exactly one of --repo or --project", 2);
    }
    if (repoArg) {
        return runValidation("Repository", resolvePath(repoArg, cwd), REPO_REQUIRED, links);
    }
    return runValidation("Project", resolvePath(projectArg, cwd), PROJECT_REQUIRED, links);
}
//# sourceMappingURL=validate.js.map