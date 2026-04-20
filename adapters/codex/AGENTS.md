# AGENTS.md Instructions for RDS Projects

This file is the Codex adapter source for generated RDS Projects. When copied into a generated project, it should live at the project root as `AGENTS.md`.

This folder is an RDS Project. The source of truth is the local project directory and its Markdown files. Obsidian is an optional interface, not the data model.

These instructions apply to all files under this directory. More deeply nested `AGENTS.md` files may narrow instructions for subfolders.

Codex should be the execution and reproducibility partner: strong at file organization, deterministic scripts, validation, lightweight analysis automation, migration, and keeping RDS artifacts consistent.

## Shared Contract Invariants

<!-- RDS:SHARED-CONTRACT:START -->
- Source of truth is the local RDS Project directory and its Markdown files; Obsidian is optional and not the data model.
- Load the required context files before substantive research discussion, analysis, or project modification.
- Ground claims in files that were actually read and identify the files used.
- Separate observations, interpretations, hypotheses, decisions, next actions, and open questions.
- Label speculation clearly and do not treat AI-generated explanations as evidence.
- Keep project evidence separate from outside knowledge, literature search, or model prior knowledge.
- Use the log language and log tone from `00_context/user_profile.md` for durable records.
- Preserve user corrections, disagreement, and uncertainty.
- Persist useful discussions under `04_discussions/`, update `04_discussions/_index.md`, and update decisions, open questions, evidence, and assumptions when they change, without foregrounding RDS maintenance in ordinary replies.
- Follow `99_meta/safety_and_data_policy.md` if sensitive or regulated data may be involved.
<!-- RDS:SHARED-CONTRACT:END -->

## Required Context Loading

Before substantive research discussion, analysis, or project modification:

1. Read `99_meta/scaffold_decisions.md`.
2. Read `99_meta/rds_agent_contract.md`.
3. Read `00_context/user_profile.md`.
4. Read `00_context/project_overview.md`.
5. Read `00_context/decisions_log.md`.
6. Read `00_context/open_questions.md`.
7. Read `00_context/evidence_register.md`.
8. Read `00_context/assumptions.md`.
9. Read `04_discussions/_index.md`.
10. Read topic-relevant prior discussion files before relying on them.

Do not claim continuity from memory unless the relevant file was read in the current session.

## Research Discussion Rules

- Ground claims in files that were actually read.
- Separate direct observations, user interpretation, AI hypotheses, decisions, and next actions.
- Mark speculation clearly.
- Do not treat AI-generated explanations as evidence.
- Preserve explicit user disagreement, corrections, and uncertainty.
- Use the log language and log tone in `00_context/user_profile.md` for durable records.
- When the user asks for interpretation, prefer a compact, evidence-first answer before proposing broad possibilities.

## File and Analysis Rules

- Keep generated outputs in the appropriate scaffold folder, usually under `03_analysis/` or the field-specific equivalent.
- Prefer reproducible scripts over one-off manual edits when creating analysis artifacts.
- Record paths to source files, generated files, commands, assumptions, and limitations in the discussion log.
- Do not overwrite raw data.
- Do not reorganize existing user files unless the user asked for migration or cleanup.
- Respect `.gitignore`, `.aiexclude`, and sensitive-data boundaries.

## Persistence Rule

A useful RDS discussion that produced durable research context should become a Markdown artifact. At discussion close, write or update:

- `04_discussions/YYYY-MM-DD_topic.md`
- `04_discussions/_index.md`
- `00_context/decisions_log.md` when durable decisions emerged
- `00_context/open_questions.md` when unresolved questions emerged
- `00_context/evidence_register.md` when claims were tied to materials
- `00_context/assumptions.md` when unverified assumptions matter

Use `rds update-index` when available.

## Completion Checks

Before saying RDS maintenance, migration, validation, or substantial file work is complete:

- Confirm the relevant RDS files were updated.
- Run `rds validate --project .` when available.
- Report validation gaps only when they affect continuity, trust, or the user's next action.

For ordinary research discussion, keep the user-facing closeout focused on the research outcome, interpretation, decision, or next action. Do not list RDS files or validation details unless the user asks, the artifact is the deliverable, or a write/index/validation problem affects continuity. At most, add one short sentence in the user's language, such as: "This discussion has been recorded."
