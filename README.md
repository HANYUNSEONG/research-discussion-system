# Research Discussion System (RDS)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: v0.1 scaffold](https://img.shields.io/badge/status-v0.1%20scaffold-blue.svg)](CHANGELOG.md)

[한국어](README.ko.md) | English

Turn AI research discussions into durable, navigable Markdown.

RDS is a local-file research discussion framework for researchers across disciplines. It turns a research project folder into a structured space where AI agents can discuss prior materials, inspect local files, preserve decisions, and leave Markdown records that can be explored with Obsidian or any plain file browser.

RDS is not an Obsidian vault format and is not tied to one AI provider. The source of truth is the RDS project directory and its files.

## Quick Start

1. Install RDS for the AI tool you use.
2. Open the research project folder you want to organize.
3. Run the setup workflow.

| Tool   | Setup        |
| ------ | ------------ |
| Claude | `/rds:setup` |
| Codex  | `$rds-setup` |
| Gemini | `/rds:setup` |

After installation, the setup workflow asks about your research field, project topic, preferred linking mode, project type, current blockers, data formats, external tools, sensitive-data boundaries, glossary needs, and discussion style.

Based on those answers, it creates an RDS Project with context files, discussion logs, literature notes, metadata, and agent instructions for Claude, Codex, and Gemini.

## Install RDS

RDS should be installed through the extension surface of the AI tool you use. The terminal commands in this repository are for maintainers, testers, and source installs.

### Claude

You can install RDS from either Claude Desktop or Claude Code.

#### Option A: Claude Desktop app

1. Open the Claude Desktop app and switch to the **Cowork** workspace.
2. Go to **Customize** → **Browse plugins**.
3. If `rds` is not visible, add this repository as a marketplace source in the plugin browser:
   - `https://github.com/HANYUNSEONG/research-discussion-system`
4. Install plugin ID `rds`.
5. Start a task in your research folder and run `/rds:setup`.

#### Option B: Claude Code (CLI/Desktop Code)

1. In Claude Code, add this repository as a marketplace source:

   ```bash
   /plugin marketplace add https://github.com/HANYUNSEONG/research-discussion-system
   ```

2. Install the plugin:

   ```bash
   /plugin install rds
   ```

3. Reload plugins:

   ```bash
   /reload-plugins
   ```

4. Open your research folder and run:

   ```bash
   /rds:setup
   ```

The plugin ID is `rds`.

### Codex

Install Codex first, then install plugin ID `rds`.

#### Option A: Codex desktop app (macOS/Windows)

1. Install the Codex app from the official download page.
   - macOS: choose Apple Silicon or Intel build.
   - Windows: install via Microsoft Store link from Codex docs.
2. Open Codex and sign in (ChatGPT account recommended; API key is also supported).
3. Open your research folder as a project.
4. Open **Plugins** in Codex and add a source that points to this repository.
   - URL source: `https://github.com/HANYUNSEONG/research-discussion-system`, or
   - local source file: `.agents/plugins/marketplace.json`.
5. Refresh the plugin list. Confirm that plugin ID `rds` appears.
6. Install `rds` from the plugin list.
7. Open your research folder and run `$rds-setup`.

#### Option B: Codex CLI

1. Install Node.js (current Codex docs use Node 22 in examples; use an active LTS/newer runtime).
2. Install Codex CLI:

   ```bash
   npm i -g @openai/codex
   ```

3. Sign in:

   ```bash
   codex
   ```

   Then complete browser login with ChatGPT (default) or use API key authentication per Codex auth docs.

4. In Codex CLI, open the plugin management flow and add this repository as a source.
   - URL source: `https://github.com/HANYUNSEONG/research-discussion-system`, or
   - local source file: `.agents/plugins/marketplace.json`.
5. Refresh the plugin list. Confirm that plugin ID `rds` appears.
6. Install `rds`.
7. Move to your research project folder and run `$rds-setup`.

On Windows, Codex CLI docs recommend WSL for a Linux-like environment (`wsl --install`, then install Node and Codex inside WSL).

### Gemini

Gemini currently uses reusable custom commands for this RDS workflow rather than the same plugin marketplace model used by Claude and Codex.

For non-technical users, prefer one of these distribution paths:

1. Use an RDS-enabled project template that already contains `.gemini/commands/rds/`.
2. Ask a maintainer to install the RDS command pack globally for your Gemini CLI profile.
3. If you can use a file browser, copy the `rds` folder from `.gemini/commands/` into the `.gemini/commands/` folder of your research project.

A file such as `.gemini/commands/rds/setup.toml` becomes `/rds:setup` in Gemini.

### Maintainers And Source Installs

Use the source install path only when you are maintaining RDS, preparing a release, or testing a local checkout:

```bash
git clone https://github.com/HANYUNSEONG/research-discussion-system.git
cd research-discussion-system
npm install
npm run build
export RDS_HOME="$PWD"
export PATH="$RDS_HOME/bin:$PATH"
rds doctor --repo "$RDS_HOME"
```

The packaged backend requires Node.js 20 or newer at runtime. TypeScript is only used to build the JavaScript files shipped in `dist/`.

Release checklist:

1. Publish or distribute the Claude plugin package using `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`.
2. Publish or distribute the Codex marketplace/plugin using `.agents/plugins/marketplace.json` and `.codex-plugin/plugin.json`.
3. Distribute the Gemini command pack under `.gemini/commands/rds/` or include it in RDS-enabled project templates.

Installation references: [Codex app docs](https://developers.openai.com/codex/app), [Codex CLI docs](https://developers.openai.com/codex/cli), [Codex auth docs](https://developers.openai.com/codex/auth), [Codex Windows guide](https://developers.openai.com/codex/windows), [Codex plugin build docs](https://developers.openai.com/codex/plugins/build), [Codex quickstart](https://developers.openai.com/codex/quickstart), [Claude Cowork plugins](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork), [Claude Code plugins](https://code.claude.com/docs/en/plugins), [Claude Code skills](https://code.claude.com/docs/en/skills), [Gemini CLI get started](https://google-gemini.github.io/gemini-cli/docs/get-started/), and [Gemini custom commands](https://google-gemini.github.io/gemini-cli/docs/cli/custom-commands.html).

## Daily Use

| Goal                 | Claude                  | Codex                   | Gemini                  |
| -------------------- | ----------------------- | ----------------------- | ----------------------- |
| Resume context       | `/rds:resume`           | `$rds-resume`           | `/rds:resume`           |
| Start a discussion   | `/rds:new-discussion`   | `$rds-new-discussion`   | `/rds:new-discussion`   |
| Save a discussion    | `/rds:close-discussion` | `$rds-close-discussion` | `/rds:close-discussion` |
| Check project health | `/rds:doctor`           | `$rds-doctor`           | `/rds:doctor`           |

Open the same folder in Obsidian if you want graph navigation, backlinks, wiki links, or Dataview-friendly metadata.

## Project Structure

```text
RDS Project
├── 00_context/        # project identity, decisions, assumptions, open questions
├── 01_*              # field-specific working folders generated by setup
├── 02_*
├── 03_*
├── 04_discussions/   # structured discussion logs and discussion index
├── 05_literature/    # papers, literature notes, reading summaries
└── 99_meta/          # RDS runtime config, agent contract, safety policy
```

Generated projects also include:

```text
CLAUDE.md    # Claude project memory
AGENTS.md    # Codex / AGENTS.md-compatible instructions
GEMINI.md    # Gemini project context
```

## Learn More

- [Getting started](docs/guides/getting_started.md)
- [Setup flow](docs/guides/setup_flow.md)
- [Skills and commands](docs/guides/skills.md)
- [Obsidian integration](docs/guides/obsidian_integration.md)
- [Safety](docs/guides/safety.md)
- [FAQ](docs/guides/faq.md)

## Safety Boundary

RDS is for research discussion and local organization. Do not use it for regulated clinical, patient-identifiable, or compliance-bound data unless your institutional policy explicitly permits the selected AI tool and storage path. De-identify sensitive data before agent discussion.

## Status

This repository is an early v0.1 scaffold. The core file protocol is intentionally simple: Markdown, YAML frontmatter, and a small Node.js backend built from TypeScript.

## License

MIT. See [LICENSE](LICENSE).
