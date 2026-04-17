# Discussion Log Schema

A discussion log captures a bounded research discussion and preserves both evidence and uncertainty.

## Required Sections

- Context Restoration
- Discussion Question
- Materials Reviewed
- Key Observations
- Interpretation
- Hypotheses
- User Position
- Decisions
- Next Actions
- Open Questions
- Files Created or Modified

## Required Distinctions

Each log must distinguish:

- direct observations from source material
- user interpretation
- AI-generated hypotheses
- agreed decisions
- unresolved uncertainty

## Provenance Fields

Use these fields in frontmatter or body sections when available:

```yaml
data_sources:
  - path: ""
    description: ""
    checksum: "optional"
analysis_outputs:
  - path: ""
    generated_by: ""
    date: ""
human_validation:
  status: unchecked
```
