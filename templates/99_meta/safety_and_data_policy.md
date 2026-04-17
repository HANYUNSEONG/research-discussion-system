---
type: safety_policy
project: "{{project_id}}"
status: active
---

# Safety and Data Policy

Do not place patient-identifiable, regulated clinical, or contract-restricted data in an AI-accessible RDS folder unless the selected tool and institutional policy explicitly allow it.

## Default Handling

- Prefer de-identified or synthetic examples.
- Keep raw sensitive data outside the agent workspace.
- Mark AI interpretation as provisional until human-reviewed.
- Record when conclusions are based on incomplete data.
