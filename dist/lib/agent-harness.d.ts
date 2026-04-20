export declare const RDS_ADAPTER_CONTRACT_FILES: readonly [{
    readonly label: "canonical contract";
    readonly rel: "templates/99_meta/rds_agent_contract.md";
}, {
    readonly label: "Codex adapter";
    readonly rel: "adapters/codex/AGENTS.md";
}, {
    readonly label: "Claude adapter";
    readonly rel: "adapters/claude-cowork/CLAUDE.md";
}, {
    readonly label: "Gemini adapter";
    readonly rel: "adapters/gemini/GEMINI.md";
}];
export declare const REQUIRED_CONTEXT_REFERENCES: readonly ["99_meta/scaffold_decisions.md", "99_meta/rds_agent_contract.md", "00_context/user_profile.md", "00_context/project_overview.md", "00_context/decisions_log.md", "00_context/open_questions.md", "00_context/evidence_register.md", "00_context/assumptions.md", "04_discussions/_index.md"];
export declare const EXPECTED_SHARED_CONTRACT_LINES: readonly ["- Source of truth is the local RDS Project directory and its Markdown files; Obsidian is optional and not the data model.", "- Load the required context files before substantive research discussion, analysis, or project modification.", "- Ground claims in files that were actually read and identify the files used.", "- Separate observations, interpretations, hypotheses, decisions, next actions, and open questions.", "- Label speculation clearly and do not treat AI-generated explanations as evidence.", "- Keep project evidence separate from outside knowledge, literature search, or model prior knowledge.", "- Use the log language and log tone from `00_context/user_profile.md` for durable records.", "- Preserve user corrections, disagreement, and uncertainty.", "- Persist useful discussions under `04_discussions/`, update `04_discussions/_index.md`, and update decisions, open questions, evidence, and assumptions when they change, without foregrounding RDS maintenance in ordinary replies.", "- Follow `99_meta/safety_and_data_policy.md` if sensitive or regulated data may be involved."];
export declare const REQUIRED_CLAUDE_DENIES: readonly ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)", "Read(./.rds/**)", "Read(./.omx/**)", "Read(./.omc/**)"];
export declare const EXPECTED_CLAUDE_SESSION_COMMAND = "printf '%s\\n' 'RDS harness: this is the framework repository, not a generated RDS Project. Read CLAUDE.md for repo rules and run npm run check before claiming completion after behavior changes.'";
export declare const EXPECTED_CODEX_SESSION_COMMAND = "printf '%s\\n' 'RDS harness: this is the framework repository. Load AGENTS.md, preserve adapter contract alignment, and run npm run check before claiming completion after behavior changes.'";
export declare const EXPECTED_CODEX_STATUS_MESSAGE = "Loading RDS harness guidance";
export declare const EXPECTED_CODEX_TIMEOUT = 5;
export declare function checkAdapterContractDrift(root: string): string[];
export declare function checkRuntimeHarnessConfig(root: string): string[];
export declare function checkRootAgentInstructions(root: string): string[];
//# sourceMappingURL=agent-harness.d.ts.map