# RDS Setup Protocol

This is the canonical setup flow shared by Claude, Codex, Gemini, and the terminal wrapper.

Setup surfaces are orchestration layers, not independent implementations. They should interview the user, convert answers into backend arguments, call the shared backend, validate the result, and report next steps.

## Principle

```text
Researcher-facing setup surface -> shared setup protocol -> RDS backend
```

Do not hand-create the RDS folder structure from memory when the backend is available. Use the backend so Claude, Codex, Gemini, and terminal users create the same project.

The backend is a Node.js command-line tool. Packaged installs should include the built JavaScript files under `dist/`; source checkouts must run `npm run build` before using `./bin/rds`.

## Backend Discovery

Use the first available backend:

1. `./bin/rds` if the current folder is the RDS framework repository.
2. `rds` if it is on `PATH`.
3. `$RDS_HOME/bin/rds` if `RDS_HOME` is set.
4. A tool-specific plugin root if the current environment exposes one.

If no backend is available, stop and explain that RDS is installed as prompts only and needs the backend package to scaffold files reliably.

## Phase 0: Detect

Before asking setup questions:

1. Detect the target folder. Default to the current working folder unless the user named another folder or the target is ambiguous.
2. Check whether it already looks like an RDS Project:
   - `99_meta/scaffold_decisions.md`
   - `99_meta/rds_agent_contract.md`
   - `04_discussions/_index.md`
3. If it is already an RDS Project, offer:
   - resume current project
   - run doctor
   - force setup refresh
4. Check whether the folder is non-empty. If non-empty, frame setup as migration/additive scaffolding.
5. Do not inspect raw research materials during setup. Setup should only inspect structural markers and directory emptiness.

## Phase 1: Interview

Ask one question at a time.

Required answers:

- research field
- one-line topic
- scaffold: `wet_lab`, `computational`, `social_science`, `clinical`, `theoretical`, or `mixed`
- linking mode: `plain` or `obsidian`
- glossary preference
- log tone: `concise`, `friendly`, or `rigorous`
- researcher stage: `master`, `phd`, `integrated_ms_phd`, `postdoc`, `faculty_or_pi`, `research_staff_or_industry`, or `other_or_skip`

Detect the default log language from the user's setup conversation. Ask for log language only if the detected language is ambiguous or the user wants a different language for written records.

Do not ask for a project id unless the user explicitly wants to set one. The backend derives a project id from the topic when `--project-id` is omitted.

Do not ask setup-time project context questions. RDS should learn these during normal discussions and close-discussion summaries:

- current main hypothesis or intended claim
- current blocker
- key existing materials
- data formats
- external tools

Do not ask scaffold-specific context questions during setup.
Do not ask clinical, patient, regulated-data, or de-identification screening questions during setup.

## Phase 2: Scaffold

Call the backend:

```bash
<backend> scaffold \
  --target "<target>" \
  --field "<field>" \
  --topic "<topic>" \
  --scaffold "<scaffold>" \
  --linking-mode "<plain|obsidian>" \
  [--project-id "<project_id>"] \
  [--with-glossary] \
  [--force]
```

Use `--force` only for non-empty folders or explicit refresh/migration intent. Never overwrite raw research data.

## Phase 3: Enrich Context

After the backend creates the base structure, update the generated context files with the user's interview answers:

- `00_context/project_overview.md`
- `00_context/user_profile.md`
- `00_context/open_questions.md`
- `00_context/decisions_log.md`
- `00_context/evidence_register.md`
- `00_context/assumptions.md`
- `00_context/glossary.md` when enabled

Keep these updates concise and durable. Record project identity in `00_context/project_overview.md` and user settings in `00_context/user_profile.md`. User settings include detected log language, selected tone, and researcher stage. Do not duplicate user settings across multiple files. Do not dump the full interview transcript or invent hypotheses, blockers, evidence, data formats, or tools.

## Phase 4: Validate

Run:

```bash
<backend> validate --project "<target>"
<backend> doctor --project "<target>"
```

If validation fails, fix recoverable structure issues and rerun validation. If the backend is missing or a filesystem permission blocks setup, report the blocker clearly.

## Phase 5: Welcome

End with a compact handoff:

- project location
- scaffold selected
- linking mode
- key generated files
- how to resume in each tool

Suggested wording:

```text
RDS Project initialized. Start future sessions with /rds:resume, $rds-resume, or the equivalent natural-language request. Close useful discussions with the RDS close-discussion workflow so decisions and open questions are written to files.
```

## Drift Guard

All setup surfaces must preserve these invariants:

- generated projects include `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md`
- `99_meta/rds_agent_contract.md` remains the canonical shared behavior contract
- Obsidian is optional and not the source of truth
- AI hypotheses are never recorded as evidence
- discussion outputs are persisted as Markdown artifacts
