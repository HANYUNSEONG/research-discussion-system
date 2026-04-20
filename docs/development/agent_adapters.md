# Agent Adapters

RDS is provider-neutral, but each AI tool expects project instructions in a slightly different place. RDS handles this by generating one canonical contract plus tool-specific adapters.

## Canonical Contract

Every generated RDS Project includes:

```text
99_meta/rds_agent_contract.md
```

This file defines the shared rules:

- what context to load
- how to distinguish evidence from hypotheses
- how to persist discussions
- how to update decisions, open questions, evidence, and assumptions
- how to treat Obsidian as an optional interface rather than the source of truth

Tool-specific instruction files should point back to this contract and adapt it to the tool's conventions.

## Claude Cowork Adapter

Generated file:

```text
CLAUDE.md
```

Use Claude for:

- `/rds:setup` onboarding skill
- researcher-friendly discussion
- interpretation and hypothesis generation
- structured discussion logging
- resuming context across sessions

Claude's project memory convention is `CLAUDE.md`, and RDS exposes shared workflow skills under `skills/` through Claude plugin aliases.

Distribution surface:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
```

The Claude plugin manifest points Claude at the shared `skills/` directory. The marketplace file follows the Claude marketplace shape used by Claude Code plugin repositories: it names the marketplace, describes the owner, and exposes the `rds` plugin with `source: "./"`.

Skill surface:

```text
/rds:setup
/rds:doctor
/rds:resume
/rds:new-discussion
/rds:close-discussion
/rds:convert-linking
/rds:link-check
```

## Codex Adapter

Generated file:

```text
AGENTS.md
```

Use Codex for:

- reproducible analysis scripts
- validation and migration
- index/link maintenance
- file consistency
- RDS framework development

Codex follows `AGENTS.md`-style repository instructions. RDS uses this file to tell Codex how to work inside research projects without turning uncertain AI reasoning into evidence.

Primary distribution surface:

```text
rds codex install
```

Codex support is installer-first. `rds codex install` installs local Codex skill entries plus a stable local backend wrapper so `$rds-*` skills can execute consistently across Codex app/CLI environments. Legacy `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` metadata remain for compatibility experiments, but are not the default install path.

Skill surface:

```text
$rds-setup
$rds-doctor
$rds-resume
$rds-new-discussion
$rds-close-discussion
$rds-convert-linking
$rds-link-check
```

## Gemini Adapter

Generated file:

```text
GEMINI.md
```

Use Gemini for:

- broad-context synthesis
- literature-aware review
- cross-file comparison
- long-context project review
- external context checks when authorized

Gemini CLI and Gemini Code Assist use `GEMINI.md` as a project context file. Some Gemini environments also accept `AGENT.md`; RDS keeps `GEMINI.md` as the canonical generated file unless a project explicitly needs the alias.

Custom command surface:

```text
/rds:setup
/rds:doctor
/rds:resume
/rds:new-discussion
/rds:close-discussion
/rds:convert-linking
/rds:link-check
```

RDS provides Gemini custom command definitions under `.gemini/commands/rds/`.

## Drift Rule

Do not manually make the three adapter files disagree about core RDS behavior. If a shared rule changes, update:

1. `99_meta/rds_agent_contract.md`
2. `adapters/claude-cowork/CLAUDE.md`
3. `adapters/codex/AGENTS.md`
4. `adapters/gemini/GEMINI.md`

The adapter files may differ in role emphasis, but not in evidence handling, context loading, or persistence requirements.

## Skills First

Claude and Codex workflows are defined as skills first. The `commands/` directory is intentionally not used as the canonical surface. Gemini is the exception because Gemini CLI currently uses `.gemini/commands/*.toml` custom commands as its official reusable workflow surface.
