---
name: rds-close-discussion
description: Persist the current RDS discussion as structured Markdown and update project context files.
disable-model-invocation: true
---

# RDS Close Discussion

Use this skill to persist the current discussion as RDS artifacts.

## Workflow

1. Read `00_context/user_profile.md` when available to determine log language, log tone, and researcher stage.
2. Draft a discussion log using `templates/04_discussions/_discussion.md` as the structure.
   - Write headings and body in the configured log language.
   - If no log language is configured, use the language the user used in the discussion.
   - Apply the configured tone: `concise`, `friendly`, or `rigorous`.
3. Write the log to `04_discussions/YYYY-MM-DD_topic.md`.
4. Include all source files that were actually read.
5. Separate claims, hypotheses, decisions, and next actions.
6. Update `04_discussions/_index.md` with the backend when available:

```bash
<backend> update-index --project "<project-root>"
```

7. Append durable decisions to `00_context/decisions_log.md`.
8. Append unresolved questions to `00_context/open_questions.md`.
9. Add or update evidence in `00_context/evidence_register.md`.
10. Add uncertain but active assumptions to `00_context/assumptions.md`.
11. Keep the user-facing closeout focused on the research outcome, interpretation, decision, or next action.
    - Mention written files only when the user asks what was recorded, a new artifact is the deliverable, a write/index/validation failure affects continuity or trust, or the session is about RDS maintenance.
    - For ordinary research discussions, at most include one short sentence in the user's language, such as: "This discussion has been recorded."

## Guardrails

- Do not silently convert a speculative hypothesis into a decision.
- Do not record that the user agreed unless they explicitly did.
- Do not over-write existing logs; create a new log or ask only if there is a filename collision.

Task: $ARGUMENTS
