---
name: rds-convert-linking
description: Convert an RDS Project between Plain Markdown and Obsidian-enhanced link notation.
disable-model-invocation: true
---

# RDS Convert Linking

Use this skill to convert links between Plain Markdown and Obsidian-enhanced modes.

## Modes

- `plain`: `[label](relative/path.md)`
- `obsidian`: `[[relative/path|label]]` or `[[relative/path]]`

## Workflow

1. Read `99_meta/scaffold_decisions.md`.
2. Confirm the target mode from the user if not specified.
3. Locate the backend using `core/setup_protocol.md#backend-discovery`.
4. Run:

```bash
<backend> convert-linking --target "<project-root>" --to plain|obsidian
```

5. Run:

```bash
<backend> validate --project "<project-root>"
```

6. Report changed files and any links that need manual review.

## Rule

The information must remain identical across modes. Only link notation and optional metadata affordances change.

Task: $ARGUMENTS
