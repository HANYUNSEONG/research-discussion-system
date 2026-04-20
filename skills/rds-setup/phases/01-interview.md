# Phase 1: Interview

Purpose: collect only the minimum information needed to scaffold a useful research project.

Ask one question at a time.

## Required Questions

Use the current working folder as the target folder unless the user already named another folder or the target is ambiguous.
Detect the user's language from the setup conversation and record it as the default log language. Ask only if the language is ambiguous or the user requests a different log language.

1. What is the research field?
2. What is the one-line project topic?
3. Which scaffold should be used?
   - `wet_lab`
   - `computational`
   - `social_science`
   - `clinical`
   - `theoretical`
   - `mixed`
4. Which linking mode should be used?
   - `plain`
   - `obsidian`
5. Should RDS create a glossary?
6. Which tone should RDS use for discussion logs and summaries?
   - `concise`: brief, direct, minimal explanation
   - `friendly`: approachable, explanatory, researcher-friendly
   - `rigorous`: careful, skeptical, evidence-first
7. What is the researcher's current stage?
   - `master`
   - `phd`
   - `integrated_ms_phd`
   - `postdoc`
   - `faculty_or_pi`
   - `research_staff_or_industry`
   - `other_or_skip`

## Do Not Ask During Setup

Do not ask for project context during setup. Let RDS learn these during normal discussions:

- What is the current hypothesis or intended claim?
- What is the current blocker?
- What questions should this project answer in the next 1-2 months?
- What data formats or file types are common?
- What external tools matter?

Do not ask scaffold-specific context questions during setup.
Do not ask clinical, patient, regulated-data, or de-identification screening questions during setup.
If a project id is needed, let the backend derive it from the topic unless the user explicitly provided one.

## Output

Summarize the setup answers briefly before scaffolding. Do not dump the full interview transcript into context files.
