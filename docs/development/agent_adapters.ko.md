# Agent Adapters

[English](agent_adapters.md)

RDS는 provider-neutral하지만, 각 AI 도구는 프로젝트 지시 파일을 서로 다른 위치와 형식으로 기대합니다. RDS는 하나의 canonical contract와 도구별 adapter를 함께 생성해 이 차이를 처리합니다.

## Canonical Contract

생성된 모든 RDS Project에는 다음 파일이 있습니다.

```text
99_meta/rds_agent_contract.md
```

이 파일은 공통 규칙을 정의합니다.

- 어떤 context를 읽어야 하는가
- evidence와 hypothesis를 어떻게 구분해야 하는가
- discussion을 어떻게 저장해야 하는가
- decisions, open questions, evidence, assumptions를 어떻게 업데이트해야 하는가
- Obsidian을 source of truth가 아니라 optional interface로 어떻게 다뤄야 하는가

도구별 instruction 파일은 이 contract를 참조하고, 각 도구의 관례에 맞게 얇게 적응합니다.

## Claude Cowork Adapter

생성 파일:

```text
CLAUDE.md
```

Claude는 다음 작업에 적합합니다.

- `/rds:setup` onboarding skill
- researcher-friendly discussion
- interpretation and hypothesis generation
- structured discussion logging
- resuming context across sessions

Claude의 project memory 관례는 `CLAUDE.md`이며, RDS는 `skills/` 아래의 shared workflow skill을 Claude plugin alias로 노출합니다.

Distribution surface:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
```

Claude plugin manifest는 Claude가 shared `skills/` directory를 읽게 합니다. Marketplace 파일은 Claude Code plugin repository에서 쓰는 marketplace 형태를 따르며, marketplace 이름과 owner를 정의하고 `source: "./"`로 `rds` plugin을 노출합니다.

Skill surface:

```text
/rds:setup
/rds:doctor
/rds:resume
/rds:new-discussion
/rds:close-discussion
/rds:convert-linking
/rds:link-check
```

## Codex Adapter

생성 파일:

```text
AGENTS.md
```

Codex는 다음 작업에 적합합니다.

- reproducible analysis script
- validation and migration
- index/link maintenance
- file consistency
- RDS framework development

Codex는 `AGENTS.md` 스타일의 repository instruction을 따릅니다. RDS는 이 파일을 사용해 Codex가 research project 안에서 작업하는 방식을 알려주되, 불확실한 AI 추론을 evidence로 바꾸지 않도록 합니다.

Distribution surface:

```text
.codex-plugin/plugin.json
.agents/plugins/marketplace.json
```

Codex plugin manifest는 RDS skill을 plugin으로 노출합니다. Local marketplace 파일은 이 repository를 marketplace source로 사용할 때 Codex의 plugin marketplace/catalog flow에서 설치 가능하게 만듭니다.

Skill surface:

```text
$rds-setup
$rds-doctor
$rds-resume
$rds-new-discussion
$rds-close-discussion
$rds-convert-linking
$rds-link-check
```

## Gemini Adapter

생성 파일:

```text
GEMINI.md
```

Gemini는 다음 작업에 적합합니다.

- broad-context synthesis
- literature-aware review
- cross-file comparison
- long-context project review
- external context checks when authorized

Gemini CLI와 Gemini Code Assist는 `GEMINI.md`를 project context file로 사용합니다. 일부 Gemini 환경은 `AGENT.md`도 허용하지만, RDS는 프로젝트가 명시적으로 alias를 필요로 하지 않는 한 `GEMINI.md`를 canonical generated file로 유지합니다.

Custom command surface:

```text
/rds:setup
/rds:doctor
/rds:resume
/rds:new-discussion
/rds:close-discussion
/rds:convert-linking
/rds:link-check
```

Gemini custom command 정의는 `.gemini/commands/rds/` 아래에 있습니다.

## Drift Rule

세 adapter 파일이 core RDS behavior에 대해 서로 다른 말을 하게 만들지 마세요. 공통 규칙이 바뀌면 다음 파일을 함께 업데이트해야 합니다.

1. `99_meta/rds_agent_contract.md`
2. `adapters/claude-cowork/CLAUDE.md`
3. `adapters/codex/AGENTS.md`
4. `adapters/gemini/GEMINI.md`

역할 강조는 달라도 되지만, evidence handling, context loading, persistence requirement는 달라지면 안 됩니다.

## Skills First

Claude와 Codex workflow는 skills-first로 정의합니다. `commands/` 디렉터리는 canonical surface로 사용하지 않습니다. Gemini는 예외적으로 공식 재사용 workflow 표면이 `.gemini/commands/*.toml` custom command이므로 이를 사용합니다.
