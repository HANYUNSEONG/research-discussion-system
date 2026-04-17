---
name: rds-doctor
description: Diagnose an RDS framework checkout or generated RDS Project.
disable-model-invocation: true
---

# RDS Doctor

Use this skill when the user wants to check whether RDS is installed, scaffolded, or ready for Claude, Codex, and Gemini.

## Workflow

1. Locate the backend in this order:
   - `./bin/rds`
   - `rds` on `PATH`
   - `$RDS_HOME/bin/rds`
2. Detect whether the current folder is an RDS framework repo or an RDS Project.
3. Run one of:

```bash
<backend> doctor --repo "<repo-root>"
<backend> doctor --project "<project-root>"
```

4. Report exact results and any missing files.
5. If the backend is missing, explain that the prompt/skill layer is installed but the backend package is not available.

Task: $ARGUMENTS
