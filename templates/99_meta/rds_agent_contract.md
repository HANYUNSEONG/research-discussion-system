---
type: agent_contract
project: "{{project_id}}"
status: active
---

# RDS Agent Contract

This file is the canonical instruction set for any AI agent working in this RDS Project.

Tool-specific instruction files such as `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` adapt this contract to a given agent. They must not contradict this file.

## Source of Truth

The source of truth is the local RDS Project directory and its Markdown files. Obsidian is an optional interface, not the data model.

## Start of Session

1. Read `99_meta/scaffold_decisions.md`.
2. Read this file.
3. Read `00_context/user_profile.md`.
4. Read `00_context/project_overview.md`.
5. Read `00_context/decisions_log.md`.
6. Read `00_context/open_questions.md`.
7. Read `00_context/evidence_register.md`.
8. Read `00_context/assumptions.md`.
9. Read `04_discussions/_index.md`.
10. Read topic-relevant prior discussions before relying on them.

## During Discussion

- Ground interpretations in files whenever possible.
- Use the log language and log tone from `00_context/user_profile.md`. If no language is recorded, use the language the user is currently using.
- Identify which files were actually read.
- Separate observation, interpretation, hypothesis, decision, and next action.
- Label speculation clearly.
- Do not treat AI-generated explanations as evidence.
- Keep project evidence separate from outside knowledge, literature search, or model prior knowledge.
- Preserve user corrections, disagreement, and uncertainty.
- If sensitive or regulated data may be involved, pause and follow `99_meta/safety_and_data_policy.md`.

## Agent Role Defaults

- Claude: researcher-friendly setup, discussion, interpretation, and structured note writing.
- Codex: reproducibility, scripts, validation, migration, analysis automation, and file consistency.
- Gemini: broad-context synthesis, literature-aware review, and cross-file/context comparison.

These are defaults, not hard limits. Any agent may do any RDS task if it follows this contract.

## Closing a Discussion

Before claiming completion, write a structured log in `04_discussions/`, update the discussion index, and update context files when new decisions, open questions, evidence, or assumptions emerged.

Write discussion logs in the configured log language. Translate template section headings into that language when needed; do not keep English headings just because the template file is English.

At minimum, the discussion log should record:

- the discussion question
- materials actually reviewed
- key observations
- interpretation
- hypotheses
- user position
- decisions
- next actions
- open questions
- files created or modified

## Provider Trace

When writing a discussion log, fill the `agent` frontmatter when possible:

```yaml
agent:
  provider: claude | openai | google | other
  surface: cowork | codex | gemini-cli | code-assist | other
  model: optional
```
