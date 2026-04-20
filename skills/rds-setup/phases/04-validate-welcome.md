# Phase 4: Validate And Welcome

Purpose: verify the generated project and tell the user how to continue.

## Validation

Run:

```bash
<backend> validate --project "<target>"
<backend> doctor --project "<target>"
```

If validation fails, fix recoverable issues and rerun validation.

## Welcome Message

End with:

- project location
- selected scaffold
- linking mode
- key generated folders
- how to resume in Claude, Codex, and Gemini
- reminder to close useful discussions so they become Markdown records

## Rule

Do not claim setup is complete unless validation passed or you clearly report the remaining blocker.
