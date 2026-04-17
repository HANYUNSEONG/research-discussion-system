---
name: rds-close-discussion
description: Persist the current RDS discussion as structured Markdown and update project context files.
disable-model-invocation: true
---

# RDS Close Discussion

Use this skill to persist the current discussion as RDS artifacts.

## Workflow

1. Draft a discussion log using `templates/04_discussions/_discussion.md` as the structure.
2. Write the log to `04_discussions/YYYY-MM-DD_topic.md`.
3. Include all source files that were actually read.
4. Separate claims, hypotheses, decisions, and next actions.
5. Update `04_discussions/_index.md` with the backend when available:

```bash
<backend> update-index --project "<project-root>"
```

6. Append durable decisions to `00_context/decisions_log.md`.
7. Append unresolved questions to `00_context/open_questions.md`.
8. Add or update evidence in `00_context/evidence_register.md`.
9. Add uncertain but active assumptions to `00_context/assumptions.md`.
10. Tell the user what was written.

## Guardrails

- Do not silently convert a speculative hypothesis into a decision.
- Do not record that the user agreed unless they explicitly did.
- Do not over-write existing logs; create a new log or ask only if there is a filename collision.

Task: $ARGUMENTS
