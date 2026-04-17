# RDS Architecture

RDS has three layers.

## 1. File System Layer

The RDS Project directory is the source of truth. It contains context, research materials, discussion logs, literature notes, and runtime metadata.

## 2. Agent Layer

Agents read and write the RDS Project according to the agent contract. Claude, Codex, Gemini, and future tools are adapters.

## 3. Interface Layer

Interfaces help humans navigate the project. Obsidian is the first enhanced interface, but normal file browsers, editors, and future dashboards should also work.

## 4. Backend Layer

The shared backend is a Node.js command-line tool. Source lives in `src/` as TypeScript and release/runtime artifacts live in `dist/` as JavaScript. Workflow surfaces such as Claude skills, Codex skills, Gemini commands, and the terminal wrapper should call the same backend rather than reimplementing scaffold, validation, link conversion, or index generation logic.

## Design Decision

Avoid the term `vault` in core docs unless specifically discussing Obsidian. RDS should remain broader than Obsidian while staying Obsidian-compatible.
