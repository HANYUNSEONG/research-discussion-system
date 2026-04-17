---
name: rds-link-check
description: Validate RDS structure and local Markdown/wiki links.
disable-model-invocation: true
---

# RDS Link Check

Use this skill to validate an RDS Project.

## Workflow

1. Locate the backend using `core/setup_protocol.md#backend-discovery`.
2. Run:

```bash
<backend> validate --project "<project-root>" --check-links
```

3. Check required folders and core files.
4. Check discussion frontmatter.
5. Check that discussion links point to existing files when possible.
6. Report problems grouped by severity:
   - missing required structure
   - broken links
   - missing metadata
   - optional cleanup

## Rule

Validation should be conservative. Warn about uncertainty rather than rewriting user notes without request.

Task: $ARGUMENTS
