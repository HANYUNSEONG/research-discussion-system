# Setup Flow

[English](setup_flow.md)

RDS setup은 짧은 인터뷰입니다. 사용자가 몇 가지 질문에 답하면 RDS가 그 답을 바탕으로 프로젝트 구조와 durable context file을 만듭니다.

## Setup에서 묻는 것

1. 대상 폴더
2. project id
3. 연구 분야
4. 한 줄 프로젝트 주제
5. 프로젝트 scaffold
   - `wet_lab`
   - `computational`
   - `social_science`
   - `clinical`
   - `theoretical`
   - `mixed`
6. linking mode
   - `plain`
   - `obsidian`
7. glossary 필요 여부
8. 현재 가설 또는 intended claim
9. 현재 막힌 지점
10. 1-2개월 안에 답하고 싶은 질문
11. 데이터 형식과 기존 폴더
12. 외부 도구
13. 민감 데이터 경계
14. 선호하는 discussion 스타일

## Setup이 만드는 것

```text
00_context/
04_discussions/
05_literature/
99_meta/
CLAUDE.md
AGENTS.md
GEMINI.md
```

선택한 scaffold에 따라 `01_*`, `02_*`, `03_*` 폴더도 생성됩니다.

## Scaffold 예시

| Scaffold | 생성되는 작업 폴더 |
|---|---|
| `wet_lab` | `01_protocols/`, `02_raw_data/`, `03_analysis/` |
| `computational` | `01_pipelines/`, `02_datasets/`, `03_experiments/` |
| `social_science` | `01_research_design/`, `02_data/`, `03_analysis/` |
| `clinical` | `01_protocol_irb/`, `02_deidentified_case_notes/`, `03_analysis/` |
| `theoretical` | `01_problem_statements/`, `02_attempts/`, `03_proofs/` |
| `mixed` | `01_research_materials/`, `02_data/`, `03_analysis/` |

## Setup Phase

Setup skill은 유지보수와 중단 후 재개가 쉽도록 phase로 나뉩니다.

1. 대상 폴더와 기존 RDS 상태 감지
2. 사용자에게 하나씩 질문
3. 파일과 폴더 scaffold
4. 답변을 context file에 간결하게 반영
5. 검증 후 다음 사용법 안내

Phase 파일은 `skills/rds-setup/phases/` 아래에 있습니다.
