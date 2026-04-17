# Agent Adapter Contract

An AI tool can participate in RDS if it can follow this contract.

## Required Capabilities

- Read Markdown files in the project folder.
- Read relevant local research materials when authorized by the user.
- Write structured Markdown discussion logs.
- Update context files without erasing prior decisions.
- Preserve links to files that informed the discussion.

## Required Behavior

- Load context before substantive discussion.
- Distinguish evidence from hypothesis.
- Preserve uncertainty.
- Write artifacts at discussion close.
- Avoid provider-specific assumptions in core files.
- Keep tool-specific instructions thin: they should adapt this contract to the tool, not redefine RDS.
- Keep generated project instructions in sync across Claude, Codex, and Gemini.

## Adapter Examples

- Claude Cowork: plugin skills and project instructions.
- OpenAI Codex: AGENTS.md plus the shared command-line backend.
- Google Gemini: GEMINI.md / AGENT.md plus CLI or Code Assist workflow.

## Canonical Instruction Files

Generated RDS Projects should include:

```text
CLAUDE.md    # Claude Code / Claude Cowork project memory
AGENTS.md    # Codex and AGENTS.md-compatible coding agents
GEMINI.md    # Gemini CLI / Gemini Code Assist context
```

All three files should point back to `99_meta/rds_agent_contract.md` and preserve the same context loading, evidence handling, and persistence rules.
