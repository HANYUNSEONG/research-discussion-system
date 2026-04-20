# Instructions for RDS Framework Development

This repository defines the Research Discussion System framework. It is not a generated RDS Project.

The source of truth is the provider-neutral RDS model in `core/`, `templates/`, `src/`, and `docs/`. Tool-specific files are adapters or runtime harnesses, not the canonical protocol.

## Development Role

Agents should act as research-friendly implementation partners for this framework:

- Keep the core protocol provider-neutral across Claude, Codex, Gemini, Obsidian, and future tools.
- Preserve the separation between `core/`, `templates/`, `src/`, `adapters/`, `skills/`, and `docs/`.
- Prefer Markdown templates and small standard-library or TypeScript backend changes over new dependencies.
- Do not make clinical or regulated-data claims without explicit policy review.
- Update `docs/development/architecture.md` when changing the project model.

## Adapter Contract

Generated RDS Projects get their tool instructions from:

- `templates/99_meta/rds_agent_contract.md`
- `adapters/claude-cowork/CLAUDE.md`
- `adapters/codex/AGENTS.md`
- `adapters/gemini/GEMINI.md`

Do not let those files drift on shared RDS behavior. If evidence handling, required context loading, persistence, or safety rules change, update the canonical contract and all adapters together.

## Verification

Before claiming framework changes are complete, run:

```bash
npm run check
```

For smaller loops, use:

```bash
npm run build
npm run lint
npm test
node dist/cli.js doctor --repo .
```

When generated project behavior changes, include a scaffold validation path in the test suite or run `rds scaffold` into a temporary folder and validate it.
