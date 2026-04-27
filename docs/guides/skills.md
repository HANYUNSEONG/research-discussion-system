# Skills And Commands

RDS workflows are skills-first for Claude and Codex. Gemini uses equivalent custom commands because that is Gemini CLI's reusable workflow surface.

For end users, install these workflows through the tool's extension surface whenever possible:

- Claude Cowork: plugin catalog or custom plugin upload.
- Claude Code: Claude plugin marketplace.
- Codex: command-based install via `rds codex install` (recommended). Legacy plugin marketplace metadata under `.codex-plugin/` and `.agents/plugins/marketplace.json` is kept for compatibility experiments only.
- Gemini: project or user custom commands under `.gemini/commands/`.

## Claude

Claude plugin users invoke namespaced skills:

Claude distribution files:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
```

| Workflow | Invocation |
|---|---|
| Setup | `/rds:setup` |
| Doctor | `/rds:doctor` |
| Resume | `/rds:resume` |
| New discussion | `/rds:new-discussion` |
| Close discussion | `/rds:close-discussion` |
| Convert linking | `/rds:convert-linking` |
| Link check | `/rds:link-check` |

The short Claude skill names under `skills/setup`, `skills/resume`, and related folders are aliases that route to the canonical `skills/rds-*` workflows.

## Codex

Codex users invoke the canonical prefixed skills:

| Workflow | Invocation |
|---|---|
| Setup | `$rds-setup` |
| Doctor | `$rds-doctor` |
| Resume | `$rds-resume` |
| New discussion | `$rds-new-discussion` |
| Close discussion | `$rds-close-discussion` |
| Convert linking | `$rds-convert-linking` |
| Link check | `$rds-link-check` |

Generated RDS Projects include `AGENTS.md`, so Codex can load project-specific rules before working.

End users install RDS for Codex with:

```bash
npm install -g research-discussion-system
rds codex install
rds codex doctor
```

This places skills under `~/.agents/skills/rds-*` (Codex's canonical user-skills path) and writes a stable backend wrapper under `~/.rds/bin/`. Windows 10/11 is supported natively (PowerShell, cmd); WSL users should run the install inside the WSL environment separately.

Legacy Codex plugin marketplace metadata is retained for compatibility experiments only:

```text
.codex-plugin/plugin.json
.agents/plugins/marketplace.json
```

## Gemini

Gemini users invoke equivalent custom commands:

| Workflow | Invocation |
|---|---|
| Setup | `/rds:setup` |
| Doctor | `/rds:doctor` |
| Resume | `/rds:resume` |
| New discussion | `/rds:new-discussion` |
| Close discussion | `/rds:close-discussion` |
| Convert linking | `/rds:convert-linking` |
| Link check | `/rds:link-check` |

The Gemini command definitions live under `.gemini/commands/rds/`.

## Terminal

The terminal wrapper is available for maintainers and testing:

```bash
npm install
npm run build
./bin/rds scaffold --target ./my-project --field "biology" --topic "project topic" --scaffold wet_lab
./bin/rds validate --project ./my-project
./bin/rds doctor --project ./my-project
```
