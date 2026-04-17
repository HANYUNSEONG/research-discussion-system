---
name: rds-setup
description: Initialize or migrate a research folder into an RDS Project using the shared backend.
disable-model-invocation: true
---

# RDS Setup

Use this skill when the user wants to start using RDS in a research project.

This skill is an orchestration layer. It must follow `core/setup_protocol.md` and call the shared backend whenever available. Do not independently invent the folder structure.

## Workflow

1. Read `core/setup_protocol.md`.
2. Run the phase files in order:
   - `skills/rds-setup/phases/00-detect.md`
   - `skills/rds-setup/phases/01-interview.md`
   - `skills/rds-setup/phases/02-scaffold.md`
   - `skills/rds-setup/phases/03-enrich-context.md`
   - `skills/rds-setup/phases/04-validate-welcome.md`
3. If setup is interrupted, resume from the last completed phase when possible.
4. Keep the user-facing interaction one question at a time.

## Safety

- Ask one question at a time.
- Do not read or copy sensitive data before asking about data sensitivity.
- Use `--force` only when the user is intentionally setting up a non-empty folder or refreshing an existing RDS Project.
- Do not overwrite raw research data.

Task: $ARGUMENTS
