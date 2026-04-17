# Phase 2: Scaffold

Purpose: create the RDS Project with the shared backend.

## Backend Call

Run:

```bash
<backend> scaffold \
  --target "<target>" \
  --project-id "<project_id>" \
  --field "<field>" \
  --topic "<topic>" \
  --scaffold "<scaffold>" \
  --linking-mode "<plain|obsidian>" \
  [--with-glossary] \
  [--force]
```

## Rules

- Use `--force` only when the user intentionally sets up a non-empty folder or refreshes an existing RDS Project.
- Do not overwrite raw research data.
- Do not manually hand-create the structure when the backend is available.

## Output

Confirm the created project path, scaffold, linking mode, and whether a glossary was created.
