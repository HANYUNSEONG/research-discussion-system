---
type: rds_runtime_config
project: "{{project_id}}"
setup_version: 0.1.0
---

# Scaffold Decisions

```yaml
project_id: "{{project_id}}"
field: "{{field}}"
topic: "{{topic}}"
scaffold: "{{scaffold}}"
linking_mode: "{{linking_mode}}"
setup_version: 0.1.0
created_at: "{{date}}"
source_of_truth: local_rds_project_directory
obsidian_role: optional_interface
```

## Notes

- The RDS project directory is the source of truth.
- Obsidian is an optional interface for navigation and visualization.
- Claude, Codex, Gemini, and future tools are agent adapters.
