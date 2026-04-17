# RDS Framework Repository Instructions

This repository defines the Research Discussion System framework. Keep the core protocol provider-neutral: Claude, Codex, Gemini, Obsidian, and future tools are adapters or interfaces, not the source of truth.

When changing this repository:

- Prefer Markdown templates and small standard-library scripts over new dependencies.
- Keep generated RDS project artifacts portable across normal file browsers and editors.
- Treat Obsidian support as an enhancement, not a requirement.
- Preserve the separation between `core/`, `templates/`, `src/`, and `adapters/`.
- Do not make clinical or regulated-data claims without explicit policy review.
- Update `docs/development/architecture.md` when changing the project model.
