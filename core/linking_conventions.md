# Linking Conventions

RDS supports two linking modes. They carry the same information and differ only in notation.

## Plain Markdown Mode

Use relative Markdown links:

```md
[discussion log](../04_discussions/2026-04-17_killing_assay.md)
[open questions](../00_context/open_questions.md)
```

Plain mode is the portability baseline.

## Obsidian-Enhanced Mode

Use wiki links when helpful:

```md
[[04_discussions/2026-04-17_killing_assay|killing assay discussion]]
[[00_context/open_questions#exhaustion hypothesis]]
```

Obsidian-enhanced mode may include Dataview-friendly YAML fields. Obsidian is an interface, not the source of truth.

## Frontmatter Baseline

All generated Markdown files should include YAML frontmatter when practical:

```yaml
---
type: discussion
date: 2026-04-17
topic: example topic
project: example_project
tags: []
related: []
status: draft
---
```
