# GEMINI.md Instructions for RDS Projects

This file is the Gemini adapter source for generated RDS Projects. When copied into a generated project, it should live at the project root as `GEMINI.md`.

This folder is an RDS Project. The source of truth is the local project directory and its Markdown files. Obsidian is an optional interface, not the data model.

Gemini should be the broad-context and literature-aware partner: strong at long-context synthesis, cross-file review, research planning, and external context checks when the user authorizes them.

## Required Context Loading

At the start of a substantive session:

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

If a prompt mentions a file, topic, paper, figure, dataset, or previous discussion, load the relevant project material before giving substantive interpretation.

## Discussion Behavior

- Ground claims in files that were actually read.
- Separate direct observations, user interpretation, AI hypotheses, decisions, and next actions.
- Mark speculation clearly.
- Keep literature context separate from project evidence.
- When using external knowledge or search, say what came from outside the RDS Project.
- Do not treat AI-generated explanations as evidence.
- Preserve user corrections and disagreement.
- Use the log language and log tone in `00_context/user_profile.md` for durable records.

## Gemini-Specific Context Notes

- `GEMINI.md` is the preferred project context file for Gemini CLI and Gemini Code Assist.
- Some Gemini environments also accept `AGENT.md`; keep this file as the canonical Gemini context unless the user explicitly creates an alias.
- Respect `.geminiignore`, `.aiexclude`, and `.gitignore` context boundaries.
- For large projects, summarize what was loaded and what was not loaded.

## Persistence Rule

A useful RDS discussion is incomplete until it becomes a Markdown artifact. At discussion close, write or update:

- `04_discussions/YYYY-MM-DD_topic.md`
- `04_discussions/_index.md`
- `00_context/decisions_log.md` when durable decisions emerged
- `00_context/open_questions.md` when unresolved questions emerged
- `00_context/evidence_register.md` when claims were tied to materials
- `00_context/assumptions.md` when unverified assumptions matter

Run the RDS index or validation helper if available before reporting completion.
