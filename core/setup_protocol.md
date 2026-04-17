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

1. Detect the target folder.
2. Check whether it already looks like an RDS Project:
   - `99_meta/scaffold_decisions.md`
   - `99_meta/rds_agent_contract.md`
   - `04_discussions/_index.md`
3. If it is already an RDS Project, offer:
   - resume current project
   - run doctor
   - force setup refresh
4. Check whether the folder is non-empty. If non-empty, frame setup as migration/additive scaffolding.
5. Ask about sensitive or regulated data before reading or copying research materials.

## Phase 1: Interview

Ask one question at a time.

Required answers:

- target folder
- project id
- research field
- one-line topic
- scaffold: `wet_lab`, `computational`, `social_science`, `clinical`, `theoretical`, or `mixed`
- linking mode: `plain` or `obsidian`
- glossary preference

Then ask the scaffold-specific questions in `scaffolds/<scaffold>.md`.

Recommended project context to collect after scaffolding:

- current main hypothesis or intended claim
- current blocker
- key existing materials
- data formats
- external tools
- discussion style preference

## Phase 2: Scaffold

Call the backend:

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

Use `--force` only for non-empty folders or explicit refresh/migration intent. Never overwrite raw research data.

## Phase 3: Enrich Context

After the backend creates the base structure, update the generated context files with the user's interview answers:

- `00_context/project_overview.md`
- `00_context/open_questions.md`
- `00_context/decisions_log.md`
- `00_context/evidence_register.md`
- `00_context/assumptions.md`
- `00_context/glossary.md` when enabled

Keep these updates concise and durable. Do not dump the full interview transcript.

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
- safety reminder if sensitive data was discussed

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
