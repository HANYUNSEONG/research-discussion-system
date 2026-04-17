# RDS Setup Prompt

Run onboarding as a routed, one-question-at-a-time interview. Do not present the whole questionnaire at once.

## Layer 0: Viewing and Linking Preference

Ask how the user wants to browse RDS files:

- Plain Markdown
- Obsidian-enhanced Markdown
- Not sure yet

Record this as `linking_mode`.

## Layer 1: Project Identity

Collect:

- research field
- one-line topic
- work mode: wet lab, computational, social science, clinical, theoretical, or mixed
- project stage
- current central hypothesis or intended claim

For the selected scaffold, ask the scaffold-specific questions.

## Layer 2: Current State

Collect:

- main experiments, analyses, or arguments completed so far
- strongest current observations
- discarded hypotheses and why they were discarded
- current blocker
- questions to answer in the next 1-2 months

Initialize `decisions_log.md`, `open_questions.md`, `evidence_register.md`, and `assumptions.md`.

## Layer 3: Operating Environment

Collect:

- data formats
- existing folder structure
- sensitive data presence
- external tools
- glossary need

## Layer 4: Discussion Style

Collect:

- preferred tone
- hypothesis breadth/depth
- automatic execution vs approval-first
- speculation tolerance

Generate or update project-level agent instructions from these answers.
