# Phase 0: Detect

Purpose: understand where setup is happening before creating files.

## Steps

1. Identify the target folder.
2. Check whether it already looks like an RDS Project:
   - `99_meta/scaffold_decisions.md`
   - `99_meta/rds_agent_contract.md`
   - `04_discussions/_index.md`
3. If it is already an RDS Project, offer one of:
   - resume the project
   - run doctor
   - refresh setup with explicit force intent
4. Check whether the target folder is non-empty.
5. Ask whether sensitive, regulated, patient-identifiable, or contract-restricted data may be present before reading project materials.
6. Locate the backend using `core/setup_protocol.md#backend-discovery`.

## Output

Proceed only when you know:

- target folder
- whether this is new setup, migration, refresh, or doctor
- whether `--force` is needed
- whether sensitive data boundaries need extra caution
