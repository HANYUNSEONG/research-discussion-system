# Research Discussion System (RDS)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: v0.1 scaffold](https://img.shields.io/badge/status-v0.1%20scaffold-blue.svg)](CHANGELOG.md)

한국어 | [English](README.md)

AI와 나눈 연구 디스커션을 오래 남는, 탐색 가능한 Markdown 기록으로 바꿉니다.

RDS는 여러 연구 분야에서 사용할 수 있는 로컬 파일 기반 연구 디스커션 프레임워크입니다. 연구 프로젝트 폴더를 AI와 함께 자료를 보고 토론하고, 판단과 결정을 기록하고, 이후 세션에서도 맥락을 이어갈 수 있는 구조화된 작업 공간으로 바꿔줍니다.

RDS는 Obsidian vault 포맷이 아니고, 특정 AI 제공자에 종속된 도구도 아닙니다. 원천 데이터는 RDS 프로젝트 폴더와 그 안의 파일입니다.

## 빠른 시작

1. 사용하는 AI 도구에 RDS를 설치합니다.
2. 정리하려는 연구 프로젝트 폴더를 엽니다.
3. setup workflow를 실행합니다.

| 도구 | Setup |
|---|---|
| Claude | `/rds:setup` |
| Codex | `$rds-setup` |
| Gemini | `/rds:setup` |

설치 후 setup workflow를 실행하면 RDS는 연구 분야, 프로젝트 주제, linking mode, 프로젝트 유형, 현재 막힌 지점, 데이터 형식, 외부 도구, 민감 데이터 경계, glossary 필요 여부, 선호하는 discussion 스타일을 차례로 묻습니다.

그 답변을 바탕으로 context 파일, discussion log, literature note, metadata, Claude/Codex/Gemini용 instruction 파일이 들어 있는 RDS Project를 만듭니다.

## RDS 설치

RDS는 사용하는 AI 도구의 확장 설치 방식으로 설치하는 것을 기본으로 합니다. 이 repository의 터미널 명령은 maintainer, tester, source install용 보조 경로입니다.

### Claude Cowork And Claude Code

터미널을 모르는 사용자는 Claude Desktop의 Cowork를 사용하세요.

1. Claude Desktop을 열고 Cowork로 이동합니다.
2. Customize를 열고 Browse plugins로 이동합니다.
3. plugin catalog에서 RDS를 설치합니다. 아직 조직 catalog에 RDS가 올라가 있지 않다면 maintainer가 제공한 RDS plugin 파일을 upload합니다.
4. 정리하려는 연구 폴더를 열고 `/rds:setup`을 실행합니다.

이 repository는 이미 Claude plugin package입니다.

```text
.claude-plugin/plugin.json        # Claude plugin manifest
.claude-plugin/marketplace.json   # Claude marketplace metadata
skills/                           # Shared workflow skills
hooks/hooks.json                  # Claude plugin hooks
```

Claude Code 사용자는 Claude plugin marketplace에서 `/plugin marketplace add ...`, `/plugin install rds@...`로 설치하거나, 개발 목적일 때 `claude --plugin-dir <rds-repository>`로 직접 로드할 수 있습니다.

### Codex

터미널을 모르는 사용자는 Codex의 plugin catalog 또는 팀이 제공한 Codex marketplace에서 RDS를 설치한 뒤, 연구 폴더를 열고 `$rds-setup`을 실행합니다.

이 repository는 Codex plugin으로 바로 배포할 수 있게 구성되어 있습니다.

```text
.codex-plugin/plugin.json          # Codex plugin manifest
.agents/plugins/marketplace.json   # Local Codex marketplace entry
skills/                            # RDS workflow skills
src/                               # TypeScript backend source
dist/cli.js                        # 빌드된 JavaScript backend
bin/rds                            # skill이 호출하는 로컬 wrapper
```

Maintainer는 이 repository를 Codex marketplace로 publish하거나 공유할 수 있습니다. Codex는 `.agents/plugins/marketplace.json`에서 marketplace metadata를 읽고, `rds` entry는 이 repository를 plugin root로 가리킵니다. 설치 후 생성되는 RDS Project에는 `AGENTS.md`가 포함되므로 이후 Codex 세션은 프로젝트별 RDS 지시를 자동으로 읽을 수 있습니다.

### Gemini

Gemini는 현재 이 RDS workflow에 대해 Claude/Codex와 같은 plugin marketplace 모델이 아니라 reusable custom command를 사용합니다.

터미널을 모르는 사용자는 다음 중 하나를 쓰는 것이 좋습니다.

1. `.gemini/commands/rds/`가 이미 들어 있는 RDS-enabled project template을 사용합니다.
2. Maintainer에게 Gemini CLI profile에 RDS command pack을 전역 설치해 달라고 요청합니다.
3. 파일 브라우저를 사용할 수 있다면 `.gemini/commands/` 안의 `rds` 폴더를 연구 프로젝트의 `.gemini/commands/` 폴더로 복사합니다.

`.gemini/commands/rds/setup.toml` 같은 파일은 Gemini에서 `/rds:setup`이 됩니다.

### Maintainer And Source Install

RDS를 유지보수하거나 release를 준비하거나 local checkout을 테스트할 때만 source install 경로를 사용하세요.

```bash
git clone https://github.com/HANYUNSEONG/research-discussion-system.git
cd research-discussion-system
npm install
npm run build
export RDS_HOME="$PWD"
export PATH="$RDS_HOME/bin:$PATH"
rds doctor --repo "$RDS_HOME"
```

패키지된 backend는 런타임에 Node.js 20 이상을 사용합니다. TypeScript는 `dist/`의 JavaScript 파일을 빌드할 때만 필요합니다.

Release checklist:

1. `.claude-plugin/plugin.json`과 `.claude-plugin/marketplace.json`을 사용해 Claude plugin package를 publish하거나 배포합니다.
2. `.agents/plugins/marketplace.json`과 `.codex-plugin/plugin.json`을 사용해 Codex marketplace/plugin을 publish하거나 배포합니다.
3. `.gemini/commands/rds/`의 Gemini command pack을 배포하거나 RDS-enabled project template에 포함합니다.

설치 참고 문서: [Codex plugin build docs](https://developers.openai.com/codex/plugins/build), [Codex quickstart](https://developers.openai.com/codex/quickstart), [Claude Cowork plugins](https://support.claude.com/en/articles/13837440-use-plugins-in-claude-cowork), [Claude Code plugins](https://code.claude.com/docs/en/plugins), [Claude Code skills](https://code.claude.com/docs/en/skills), [Gemini CLI get started](https://google-gemini.github.io/gemini-cli/docs/get-started/), [Gemini custom commands](https://google-gemini.github.io/gemini-cli/docs/cli/custom-commands.html).

## 일상적인 사용

| 목적 | Claude | Codex | Gemini |
|---|---|---|---|
| 맥락 불러오기 | `/rds:resume` | `$rds-resume` | `/rds:resume` |
| 새 discussion 시작 | `/rds:new-discussion` | `$rds-new-discussion` | `/rds:new-discussion` |
| discussion 저장 | `/rds:close-discussion` | `$rds-close-discussion` | `/rds:close-discussion` |
| 프로젝트 상태 점검 | `/rds:doctor` | `$rds-doctor` | `/rds:doctor` |

Graph view, backlink, wiki link, Dataview-friendly metadata가 필요하면 같은 폴더를 Obsidian에서 열어 사용할 수 있습니다.

## 프로젝트 구조

```text
RDS Project
├── 00_context/        # 프로젝트 정체성, 결정, assumption, open question
├── 01_*              # setup이 생성하는 분야별 작업 폴더
├── 02_*
├── 03_*
├── 04_discussions/   # 구조화된 discussion log와 discussion index
├── 05_literature/    # 논문, literature note, reading summary
└── 99_meta/          # RDS runtime config, agent contract, safety policy
```

생성된 프로젝트에는 다음 파일도 포함됩니다.

```text
CLAUDE.md    # Claude project memory
AGENTS.md    # Codex / AGENTS.md-compatible instructions
GEMINI.md    # Gemini project context
```

## 더 보기

- [시작하기](docs/guides/getting_started.ko.md)
- [Setup flow](docs/guides/setup_flow.ko.md)
- [Skills and commands](docs/guides/skills.ko.md)
- [Obsidian integration](docs/guides/obsidian_integration.ko.md)
- [Safety](docs/guides/safety.ko.md)
- [FAQ](docs/guides/faq.ko.md)

## 안전 경계

RDS는 연구 discussion과 로컬 정리를 위한 프레임워크입니다. 임상 데이터, 환자 식별 가능 데이터, compliance 대상 데이터는 선택한 AI 도구와 기관 정책이 명시적으로 허용하지 않는 한 사용하지 마세요. 민감 데이터는 AI discussion 전에 익명화하거나 de-identify해야 합니다.

## 현재 상태

이 repository는 초기 v0.1 scaffold입니다. 핵심 파일 규약은 의도적으로 단순하게 유지합니다: Markdown, YAML frontmatter, TypeScript에서 빌드되는 작은 Node.js backend.

## 라이선스

MIT. [LICENSE](LICENSE)를 참고하세요.
