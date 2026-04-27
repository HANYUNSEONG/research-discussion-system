# Skills And Commands

[English](skills.md)

RDS workflow는 Claude와 Codex에서는 skill-first로 제공됩니다. Gemini는 공식 재사용 workflow 표면이 custom command이므로 equivalent custom command를 사용합니다.

최종 사용자는 가능한 한 각 도구의 extension surface를 통해 workflow를 설치하는 것을 권장합니다.

- Claude Cowork: plugin catalog 또는 custom plugin upload
- Claude Code: Claude plugin marketplace
- Codex: `rds codex install` 명령 기반 설치 (권장). `.codex-plugin/`과 `.agents/plugins/marketplace.json` 같은 plugin marketplace 메타데이터는 호환성 실험용으로만 유지됩니다.
- Gemini: `.gemini/commands/` 아래의 project/user custom command

## Claude

Claude plugin 사용자는 namespaced skill을 호출합니다.

Claude 배포 파일:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
```

| Workflow | Invocation |
|---|---|
| Setup | `/rds:setup` |
| Doctor | `/rds:doctor` |
| Resume | `/rds:resume` |
| New discussion | `/rds:new-discussion` |
| Close discussion | `/rds:close-discussion` |
| Convert linking | `/rds:convert-linking` |
| Link check | `/rds:link-check` |

`skills/setup`, `skills/resume` 같은 짧은 Claude skill은 canonical `skills/rds-*` workflow로 라우팅하는 alias입니다.

## Codex

Codex 사용자는 prefixed skill을 호출합니다.

| Workflow | Invocation |
|---|---|
| Setup | `$rds-setup` |
| Doctor | `$rds-doctor` |
| Resume | `$rds-resume` |
| New discussion | `$rds-new-discussion` |
| Close discussion | `$rds-close-discussion` |
| Convert linking | `$rds-convert-linking` |
| Link check | `$rds-link-check` |

생성된 RDS Project에는 `AGENTS.md`가 포함되어 Codex가 프로젝트별 규칙을 읽고 작업할 수 있습니다.

최종 사용자는 다음 명령으로 Codex용 RDS를 설치합니다.

```bash
npm install -g research-discussion-system
rds codex install
rds codex doctor
```

이 명령은 스킬을 `~/.agents/skills/rds-*` (Codex 공식 사용자 스킬 경로)에 배치하고, `~/.rds/bin/`에 안정적인 backend wrapper를 생성합니다. Windows 10/11은 네이티브 지원됩니다 (PowerShell, cmd). WSL에서 Codex를 사용하는 경우에는 WSL 환경 안에서 별도로 같은 명령을 실행해야 합니다.

다음 marketplace 메타데이터는 호환성 실험용으로만 유지됩니다.

```text
.codex-plugin/plugin.json
.agents/plugins/marketplace.json
```

## Gemini

Gemini 사용자는 equivalent custom command를 호출합니다.

| Workflow | Invocation |
|---|---|
| Setup | `/rds:setup` |
| Doctor | `/rds:doctor` |
| Resume | `/rds:resume` |
| New discussion | `/rds:new-discussion` |
| Close discussion | `/rds:close-discussion` |
| Convert linking | `/rds:convert-linking` |
| Link check | `/rds:link-check` |

Gemini command 정의는 `.gemini/commands/rds/` 아래에 있습니다.

## Terminal

터미널 wrapper는 maintainer와 테스트를 위한 보조 경로입니다.

```bash
npm install
npm run build
./bin/rds scaffold --target ./my-project --field "biology" --topic "project topic" --scaffold wet_lab
./bin/rds validate --project ./my-project
./bin/rds doctor --project ./my-project
```
