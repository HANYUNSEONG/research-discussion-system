# RDS Setup Prompt

Run onboarding as a routed, one-question-at-a-time interview. Keep setup short enough for a new researcher to finish without learning RDS concepts first.

## Target Folder

Use the current working folder as the target folder unless the user already named another folder or the target is ambiguous.

If the folder is already an RDS Project, offer resume, doctor, or explicit refresh.
If the folder is non-empty, frame setup as additive scaffolding and use backend `--force` only when the user intentionally sets up that folder.

## Short Setup Questions

Ask only these questions:

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

## Defaults

Do not ask for a project id. Let the backend derive it from the topic unless the user explicitly provided one.
Detect the user's language from the setup conversation and use it as the default language for future discussion logs. Ask for language only if detection is ambiguous or the user requests a different log language.

Do not ask for setup-time project context, including:

- project stage
- current hypothesis or intended claim
- completed experiments, analyses, or arguments
- strongest observations
- discarded hypotheses
- current blocker
- questions to answer in the next 1-2 months
- data formats
- existing folder structure
- external tools
- approval-first preference
- speculation tolerance

Do not ask clinical, patient, regulated-data, or de-identification screening questions during setup.

## Output

Generate or update project-level agent instructions from the setup answers and leave deeper context to later discussions.
