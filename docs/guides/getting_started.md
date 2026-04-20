# Getting Started

RDS has two first-run paths.

## Path A: Researcher Workflow

Use this path if you want to organize a research project and discuss it with an AI assistant.

1. Install the RDS setup surface for your AI tool.
2. Open the folder that contains your research materials.
3. Run the setup surface:
   - Claude: `/rds:setup`
   - Codex: `$rds-setup`
   - Gemini: `/rds:setup`
4. Answer the setup questions one at a time.
5. Use the resume workflow at the start of later sessions.
6. Use the close-discussion workflow when a discussion produced durable conclusions or next actions.

This path should not require writing code or running a manual build. Packaged RDS installs include the built JavaScript backend.

Generated projects include `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md`, so the same RDS Project can be opened with Claude, Codex, or Gemini.

The setup surface is not the implementation. It follows `core/setup_protocol.md` and calls the shared backend.

Claude and Codex workflows are defined as skills. Gemini uses equivalent custom commands because that is Gemini CLI's official reusable workflow surface.

## Path B: Terminal Workflow

Use this path if you are comfortable with command-line tools or are maintaining RDS itself.

```bash
npm install
npm run build
./bin/rds scaffold --target /path/to/project --field "field" --topic "topic" --scaffold wet_lab
```

Then validate the project:

```bash
./bin/rds validate --project /path/to/project
./bin/rds doctor --project /path/to/project
```

## Choosing a Scaffold

- `wet_lab`: protocols, raw data, analysis.
- `computational`: pipelines, datasets, experiments.
- `social_science`: research design, data, analysis.
- `clinical`: clinical research materials, summaries, analysis.
- `theoretical`: problem statements, attempts, proofs.
- `mixed`: projects spanning multiple modes.

## Obsidian

Obsidian is optional. Choose Obsidian-enhanced mode if you want wiki links, backlinks, graph navigation, and Dataview-friendly metadata. Choose Plain Markdown mode if maximum portability matters more.

## Agent Instructions

RDS uses one canonical contract plus three tool-specific adapters:

- `99_meta/rds_agent_contract.md`: shared RDS rules
- `CLAUDE.md`: Claude project memory
- `AGENTS.md`: Codex and AGENTS.md-compatible agents
- `GEMINI.md`: Gemini project context

See [Agent adapters](../development/agent_adapters.md) for the full design.
