# 시작하기

[English](getting_started.md)

RDS에는 두 가지 첫 실행 경로가 있습니다.

## 연구자 workflow

연구 프로젝트를 정리하고 AI와 논의하고 싶다면 이 경로를 사용하세요.

1. 사용하는 AI 도구에 RDS를 설치합니다.
2. 연구 자료가 들어 있는 폴더를 엽니다.
3. setup workflow를 실행합니다.
   - Claude: `/rds:setup`
   - Codex: `$rds-setup`
   - Gemini: `/rds:setup`
4. setup 질문에 하나씩 답합니다.
5. 다음 세션부터는 resume workflow로 이전 맥락을 불러옵니다.
6. 의미 있는 결론이나 다음 액션이 나온 discussion은 close-discussion workflow로 저장합니다.

이 경로는 코드를 직접 작성하거나 수동 빌드를 실행하지 않아도 됩니다. 패키지된 RDS 설치에는 빌드된 JavaScript backend가 포함됩니다.

생성된 프로젝트에는 `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`가 포함되므로 같은 RDS Project를 Claude, Codex, Gemini에서 열 수 있습니다.

setup surface 자체가 구현체는 아닙니다. setup surface는 `core/setup_protocol.md`를 따르고 공유 backend를 호출합니다.

Claude와 Codex workflow는 skill로 정의됩니다. Gemini는 Gemini CLI의 공식 재사용 workflow 표면이 custom command이므로 equivalent custom command를 사용합니다.

## 터미널 workflow

명령줄 도구에 익숙하거나 RDS 자체를 유지보수한다면 이 경로를 사용하세요.

```bash
npm install
npm run build
./bin/rds scaffold --target /path/to/project --field "field" --topic "topic" --scaffold wet_lab
```

그다음 프로젝트를 검증합니다.

```bash
./bin/rds validate --project /path/to/project
./bin/rds doctor --project /path/to/project
```

## Scaffold 선택

- `wet_lab`: protocols, raw data, analysis
- `computational`: pipelines, datasets, experiments
- `social_science`: research design, data, analysis
- `clinical`: protocol/IRB, de-identified case notes, analysis
- `theoretical`: problem statements, attempts, proofs
- `mixed`: 여러 연구 모드가 섞인 프로젝트

## Obsidian

Obsidian은 선택 사항입니다. wiki link, backlink, graph view, Dataview-friendly metadata가 필요하면 Obsidian-enhanced mode를 선택하세요. 최대한 어디서나 열리는 Markdown을 선호하면 Plain Markdown mode를 선택하면 됩니다.

## Agent Instruction

RDS는 하나의 공통 contract와 세 도구별 instruction 파일을 사용합니다.

- `99_meta/rds_agent_contract.md`: 공통 RDS 규칙
- `CLAUDE.md`: Claude project memory
- `AGENTS.md`: Codex 및 AGENTS.md-compatible agent용 지시
- `GEMINI.md`: Gemini project context

자세한 설계는 [Agent adapters](../development/agent_adapters.ko.md)를 참고하세요.
