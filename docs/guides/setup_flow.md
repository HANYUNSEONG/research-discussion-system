# Setup Flow

RDS setup is a guided interview. The user answers a small number of questions, and RDS turns those answers into a project structure and durable context files.

## What Setup Asks

1. Target folder
2. Project id
3. Research field
4. One-line project topic
5. Project scaffold:
   - `wet_lab`
   - `computational`
   - `social_science`
   - `clinical`
   - `theoretical`
   - `mixed`
6. Linking mode:
   - `plain`
   - `obsidian`
7. Glossary preference
8. Current hypothesis or intended claim
9. Current blocker
10. Questions to answer in the next 1-2 months
11. Data formats and existing folders
12. External tools
13. Sensitive-data boundaries
14. Discussion style preference

## What Setup Creates

```text
00_context/
04_discussions/
05_literature/
99_meta/
CLAUDE.md
AGENTS.md
GEMINI.md
```

It also creates `01_*`, `02_*`, and `03_*` folders based on the selected scaffold.

## Scaffold Examples

| Scaffold | Generated working folders |
|---|---|
| `wet_lab` | `01_protocols/`, `02_raw_data/`, `03_analysis/` |
| `computational` | `01_pipelines/`, `02_datasets/`, `03_experiments/` |
| `social_science` | `01_research_design/`, `02_data/`, `03_analysis/` |
| `clinical` | `01_protocol_irb/`, `02_deidentified_case_notes/`, `03_analysis/` |
| `theoretical` | `01_problem_statements/`, `02_attempts/`, `03_proofs/` |
| `mixed` | `01_research_materials/`, `02_data/`, `03_analysis/` |

## Setup Phases

The setup skill is split into phases so the flow stays resumable and easier to maintain:

1. Detect target folder and existing RDS state.
2. Interview the user one question at a time.
3. Scaffold files and folders.
4. Enrich context files with concise answers.
5. Validate and provide a welcome handoff.

The phase files live under `skills/rds-setup/phases/`.
