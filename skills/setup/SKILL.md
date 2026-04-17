---
name: setup
description: Claude namespace alias for RDS setup. Initializes or migrates a research folder into an RDS Project.
disable-model-invocation: true
---

# RDS Setup Alias

This skill is the Claude plugin namespace router for `/rds:setup`.

Route by the first argument:

| Invocation | Route |
|---|---|
| `/rds:setup` | `skills/rds-setup/SKILL.md` |
| `/rds:setup init` | `skills/rds-setup/SKILL.md` |
| `/rds:setup project` | `skills/rds-setup/SKILL.md` |
| `/rds:setup refresh` | `skills/rds-setup/SKILL.md` with refresh intent |
| `/rds:setup force` | `skills/rds-setup/SKILL.md` with force intent |
| `/rds:setup doctor` | `skills/rds-doctor/SKILL.md` |
| `/rds:setup check` | `skills/rds-doctor/SKILL.md` |
| `/rds:setup obsidian` | `skills/rds-convert-linking/SKILL.md` with target mode `obsidian` |
| `/rds:setup plain` | `skills/rds-convert-linking/SKILL.md` with target mode `plain` |
| `/rds:setup help` | Explain available RDS setup routes |

Do not invent a separate setup process. The routed skill remains the source of behavior.

Task: $ARGUMENTS
