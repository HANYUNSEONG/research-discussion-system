# Safety

RDS is a local-file research discussion framework. It does not make any AI provider safe for regulated, patient-identifiable, or compliance-bound data by itself.

## Do Not Use Without Institutional Approval

- patient-identifiable data
- regulated clinical data
- protected health information
- contract-restricted collaborator data
- unpublished sensitive data that should not leave approved systems

## Default Practice

- De-identify sensitive data before discussing it with an AI tool.
- Keep raw regulated data outside agent-accessible folders unless explicitly approved.
- Mark AI-generated explanations as hypotheses, not evidence.
- Require human review before treating AI interpretation as a research conclusion.
- Record data restrictions in `99_meta/safety_and_data_policy.md`.

## Discussion Logging

When closing a discussion, record:

- which files were actually reviewed
- which claims are supported by evidence
- which ideas are hypotheses
- which decisions were explicitly made by the researcher
- which uncertainties remain

This distinction is especially important when multiple AI tools participate in the same project.
