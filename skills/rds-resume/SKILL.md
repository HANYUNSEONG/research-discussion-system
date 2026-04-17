---
name: rds-resume
description: Resume an RDS Project by loading durable context, discussion index, and topic-relevant prior logs.
---

# RDS Resume

Use this skill at the beginning of a research session inside an existing RDS Project.

## Workflow

1. Read `99_meta/scaffold_decisions.md`.
2. Read `99_meta/rds_agent_contract.md` if present.
3. Read these context files when present:
   - `00_context/project_overview.md`
   - `00_context/decisions_log.md`
   - `00_context/open_questions.md`
   - `00_context/evidence_register.md`
   - `00_context/assumptions.md`
   - `00_context/glossary.md`
4. Read `04_discussions/_index.md`.
5. Ask the user what topic, file, or question they want to continue.
6. Read only the relevant prior discussions and source files for that topic.
7. Start with a compact restoration:

```text
Last relevant context: ...
Current open question: ...
Most relevant files/discussions: ...
Suggested starting point: ...
```

## Rule

Do not pretend to remember material that was not read in this session. If a prior discussion seems relevant, open it before relying on it.

Task: $ARGUMENTS
