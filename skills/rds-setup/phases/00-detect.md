# Phase 0: Detect

Purpose: understand where setup is happening before creating files.

## Steps

1. Identify the target folder.
   - Default to the current working folder.
   - Ask only if the user supplied multiple possible targets or the target is unclear.
2. Check whether it already looks like an RDS Project:
   - `99_meta/scaffold_decisions.md`
   - `99_meta/rds_agent_contract.md`
   - `04_discussions/_index.md`
3. If it is already an RDS Project, offer one of:
   - resume the project
   - run doctor
   - refresh setup with explicit force intent
4. Check whether the target folder is non-empty.
5. Do not inspect raw research materials during setup detection; only inspect structural markers and directory emptiness.
6. Locate the backend using `core/setup_protocol.md#backend-discovery`.

## Output

Proceed only when you know:

- target folder
- whether this is new setup, migration, refresh, or doctor
- whether `--force` is needed
