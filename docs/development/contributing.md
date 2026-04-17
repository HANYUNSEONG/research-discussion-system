# Contributing

Keep RDS simple, portable, and research-safe.

## Rules

- Do not add dependencies without a clear reason.
- Prefer deterministic scripts for index updates and validation.
- Preserve provider-neutral core docs.
- Keep Obsidian support optional.
- Add examples when changing templates.

## Backend

- Use Node.js 20 or newer.
- Keep runtime dependencies at zero unless a feature clearly justifies one.
- Run `npm run build` after TypeScript changes.
- Run `npm test` before release-oriented changes.
