# Setup Flow

RDS setup is a guided interview. The user answers a small number of questions, and RDS turns those answers into a project structure and durable context files.

## What Setup Asks

Setup uses the current working folder by default and derives the project id from the topic unless the user explicitly provides one.

Setup also detects the user's language from the setup conversation and uses it as the default language for future discussion logs.

1. Research field
2. One-line project topic
3. Project scaffold:
   - `wet_lab`
   - `computational`
   - `social_science`
   - `clinical`
   - `theoretical`
   - `mixed`
4. Linking mode:
   - `plain`
   - `obsidian`
5. Glossary preference
6. Log tone:
   - `concise`
   - `friendly`
   - `rigorous`
7. Researcher stage:
   - `master`
   - `phd`
   - `integrated_ms_phd`
   - `postdoc`
   - `faculty_or_pi`
   - `research_staff_or_industry`
   - `other_or_skip`

Setup does not ask for hypotheses, blockers, data formats, tools, detailed collaboration preferences, or clinical/sensitive-data screening. RDS learns project context during normal discussions and writes durable context when discussions are closed.

User-facing settings from setup, including log language, log tone, and researcher stage, are stored in `00_context/user_profile.md` so the user can edit them in one place.

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
2. Ask the short setup questions one at a time.
3. Scaffold files and folders.
4. Enrich context files with concise setup identity.
5. Validate and provide a welcome handoff.

The phase files live under `skills/rds-setup/phases/`.
