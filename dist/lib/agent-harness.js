import * as path from "path";
import { exists, readText } from "./files.js";
const SHARED_CONTRACT_START = "<!-- RDS:SHARED-CONTRACT:START -->";
const SHARED_CONTRACT_END = "<!-- RDS:SHARED-CONTRACT:END -->";
export const RDS_ADAPTER_CONTRACT_FILES = [
    { label: "canonical contract", rel: "templates/99_meta/rds_agent_contract.md" },
    { label: "Codex adapter", rel: "adapters/codex/AGENTS.md" },
    { label: "Claude adapter", rel: "adapters/claude-cowork/CLAUDE.md" },
    { label: "Gemini adapter", rel: "adapters/gemini/GEMINI.md" },
];
export const REQUIRED_CONTEXT_REFERENCES = [
    "99_meta/scaffold_decisions.md",
    "99_meta/rds_agent_contract.md",
    "00_context/user_profile.md",
    "00_context/project_overview.md",
    "00_context/decisions_log.md",
    "00_context/open_questions.md",
    "00_context/evidence_register.md",
    "00_context/assumptions.md",
    "04_discussions/_index.md",
];
export const EXPECTED_SHARED_CONTRACT_LINES = [
    "- Source of truth is the local RDS Project directory and its Markdown files; Obsidian is optional and not the data model.",
    "- Load the required context files before substantive research discussion, analysis, or project modification.",
    "- Ground claims in files that were actually read and identify the files used.",
    "- Separate observations, interpretations, hypotheses, decisions, next actions, and open questions.",
    "- Label speculation clearly and do not treat AI-generated explanations as evidence.",
    "- Keep project evidence separate from outside knowledge, literature search, or model prior knowledge.",
    "- Use the log language and log tone from `00_context/user_profile.md` for durable records.",
    "- Preserve user corrections, disagreement, and uncertainty.",
    "- Persist useful discussions under `04_discussions/`, update `04_discussions/_index.md`, and update decisions, open questions, evidence, and assumptions when they change, without foregrounding RDS maintenance in ordinary replies.",
    "- Follow `99_meta/safety_and_data_policy.md` if sensitive or regulated data may be involved.",
];
export const REQUIRED_CLAUDE_DENIES = [
    "Read(./.env)",
    "Read(./.env.*)",
    "Read(./secrets/**)",
    "Read(./.rds/**)",
    "Read(./.omx/**)",
    "Read(./.omc/**)",
];
export const EXPECTED_CLAUDE_SESSION_COMMAND = "printf '%s\\n' 'RDS harness: this is the framework repository, not a generated RDS Project. Read CLAUDE.md for repo rules and run npm run check before claiming completion after behavior changes.'";
export const EXPECTED_CODEX_SESSION_COMMAND = "printf '%s\\n' 'RDS harness: this is the framework repository. Load AGENTS.md, preserve adapter contract alignment, and run npm run check before claiming completion after behavior changes.'";
export const EXPECTED_CODEX_STATUS_MESSAGE = "Loading RDS harness guidance";
export const EXPECTED_CODEX_TIMEOUT = 5;
const ROOT_CLAUDE_REQUIRED_PHRASES = [
    "This repository defines the Research Discussion System framework. It is not a generated RDS Project.",
    "The source of truth is the provider-neutral RDS model",
    "Tool-specific files are adapters or runtime harnesses, not the canonical protocol.",
    "Agents should act as research-friendly implementation partners for this framework:",
    "Do not let those files drift on shared RDS behavior.",
    "npm run check",
];
function readJsonFile(root, rel) {
    const filePath = path.join(root, rel);
    if (!exists(filePath)) {
        return null;
    }
    return JSON.parse(readText(filePath));
}
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : null;
}
function extractSharedContractLines(text) {
    const start = text.indexOf(SHARED_CONTRACT_START);
    const end = text.indexOf(SHARED_CONTRACT_END);
    if (start === -1 || end === -1 || end <= start) {
        return null;
    }
    return text
        .slice(start + SHARED_CONTRACT_START.length, end)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}
function sharedContractProblems(label, text) {
    const lines = extractSharedContractLines(text);
    if (!lines) {
        return [`${label} missing shared contract marker block`];
    }
    const expected = [...EXPECTED_SHARED_CONTRACT_LINES];
    if (lines.join("\n") === expected.join("\n")) {
        return [];
    }
    const problems = [];
    for (const line of expected) {
        if (!lines.includes(line)) {
            problems.push(`${label} shared contract block missing invariant: ${line}`);
        }
    }
    for (const line of lines) {
        if (!expected.includes(line)) {
            problems.push(`${label} shared contract block has unexpected invariant: ${line}`);
        }
    }
    return problems;
}
function commandHooks(config, eventName) {
    const hooks = asRecord(asRecord(config)?.hooks);
    const eventHooks = hooks?.[eventName];
    if (!Array.isArray(eventHooks)) {
        return [];
    }
    const commands = [];
    for (const eventHook of eventHooks) {
        const nested = asRecord(eventHook)?.hooks;
        if (!Array.isArray(nested)) {
            continue;
        }
        for (const hook of nested) {
            const record = asRecord(hook);
            if (!record || record.type !== "command" || typeof record.command !== "string") {
                continue;
            }
            commands.push({
                command: record.command,
                statusMessage: typeof record.statusMessage === "string" ? record.statusMessage : undefined,
                timeout: typeof record.timeout === "number" ? record.timeout : undefined,
            });
        }
    }
    return commands;
}
function denyListIncludes(config, permission) {
    const permissions = asRecord(asRecord(config)?.permissions);
    const deny = permissions?.deny;
    return Array.isArray(deny) && deny.includes(permission);
}
function exactlyOneCommand(commands, expectedCommand) {
    return commands.length === 1 && commands[0].command === expectedCommand;
}
export function checkAdapterContractDrift(root) {
    const problems = [];
    for (const contractFile of RDS_ADAPTER_CONTRACT_FILES) {
        const filePath = path.join(root, contractFile.rel);
        if (!exists(filePath)) {
            problems.push(`${contractFile.label} missing: ${contractFile.rel}`);
            continue;
        }
        const text = readText(filePath);
        problems.push(...sharedContractProblems(contractFile.label, text));
        for (const requiredContext of REQUIRED_CONTEXT_REFERENCES) {
            if (!text.includes(requiredContext)) {
                problems.push(`${contractFile.label} does not mention required context: ${requiredContext}`);
            }
        }
    }
    return problems;
}
export function checkRuntimeHarnessConfig(root) {
    const problems = [];
    let claudeSettings = null;
    let codexHooks = null;
    try {
        claudeSettings = readJsonFile(root, ".claude/settings.json");
    }
    catch (error) {
        problems.push(`.claude/settings.json invalid JSON: ${String(error)}`);
    }
    try {
        codexHooks = readJsonFile(root, ".codex/hooks.json");
    }
    catch (error) {
        problems.push(`.codex/hooks.json invalid JSON: ${String(error)}`);
    }
    if (!claudeSettings) {
        problems.push(".claude/settings.json missing");
    }
    else {
        for (const permission of REQUIRED_CLAUDE_DENIES) {
            if (!denyListIncludes(claudeSettings, permission)) {
                problems.push(`.claude/settings.json missing deny permission: ${permission}`);
            }
        }
        const commands = commandHooks(claudeSettings, "SessionStart");
        if (!exactlyOneCommand(commands, EXPECTED_CLAUDE_SESSION_COMMAND)) {
            problems.push(".claude/settings.json SessionStart command does not match the approved harness message");
        }
    }
    if (!codexHooks) {
        problems.push(".codex/hooks.json missing");
    }
    else {
        const commands = commandHooks(codexHooks, "SessionStart");
        if (!exactlyOneCommand(commands, EXPECTED_CODEX_SESSION_COMMAND)) {
            problems.push(".codex/hooks.json SessionStart command does not match the approved harness message");
        }
        else {
            const command = commands[0];
            if (command.statusMessage !== EXPECTED_CODEX_STATUS_MESSAGE) {
                problems.push(".codex/hooks.json SessionStart statusMessage does not match the approved value");
            }
            if (command.timeout !== EXPECTED_CODEX_TIMEOUT) {
                problems.push(".codex/hooks.json SessionStart timeout does not match the approved value");
            }
        }
    }
    return problems;
}
export function checkRootAgentInstructions(root) {
    const agentFiles = ["AGENTS.md", "CLAUDE.md"];
    const texts = new Map();
    const problems = [];
    for (const agentFile of agentFiles) {
        const filePath = path.join(root, agentFile);
        if (!exists(filePath)) {
            problems.push(`${agentFile} missing`);
            continue;
        }
        texts.set(agentFile, readText(filePath));
    }
    for (const [agentFile, text] of texts) {
        for (const phrase of ROOT_CLAUDE_REQUIRED_PHRASES) {
            if (!text.includes(phrase)) {
                problems.push(`${agentFile} missing required instruction: ${phrase}`);
            }
        }
    }
    const agentsText = texts.get("AGENTS.md");
    const claudeText = texts.get("CLAUDE.md");
    if (agentsText !== undefined && claudeText !== undefined && agentsText !== claudeText) {
        problems.push("AGENTS.md and CLAUDE.md root instructions differ");
    }
    return problems;
}
//# sourceMappingURL=agent-harness.js.map