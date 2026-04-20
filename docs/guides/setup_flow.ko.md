# Setup Flow

[English](setup_flow.md)

RDS setup은 짧은 인터뷰입니다. 사용자가 몇 가지 질문에 답하면 RDS가 그 답을 바탕으로 프로젝트 구조와 durable context file을 만듭니다.

## Setup에서 묻는 것

Setup은 기본적으로 현재 작업 폴더를 대상 폴더로 사용합니다. project id는 사용자가 직접 지정하지 않으면 프로젝트 주제에서 자동 생성됩니다.

또한 setup 대화에서 사용자의 언어를 감지해 이후 discussion log의 기본 작성 언어로 사용합니다.

1. 연구 분야
2. 한 줄 프로젝트 주제
3. 프로젝트 scaffold
   - `wet_lab`
   - `computational`
   - `social_science`
   - `clinical`
   - `theoretical`
   - `mixed`
4. linking mode
   - `plain`
   - `obsidian`
5. glossary 필요 여부
6. log와 summary의 말투
   - `concise`
   - `friendly`
   - `rigorous`
7. 현재 연구자 과정
   - `master`
   - `phd`
   - `integrated_ms_phd`
   - `postdoc`
   - `faculty_or_pi`
   - `research_staff_or_industry`
   - `other_or_skip`

Setup은 가설, 막힌 지점, 데이터 형식, 외부 도구, 세부 협업 선호, 임상/민감 데이터 screening을 묻지 않습니다. 이런 맥락은 이후 일반 discussion 중 자연스럽게 파악하고, discussion을 닫을 때 durable context로 기록합니다.

Setup에서 정한 사용자 설정, 즉 log 언어, 말투, 현재 연구자 과정은 `00_context/user_profile.md` 한 곳에 기록해 사용자가 쉽게 수정할 수 있게 합니다.

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
2. 짧은 setup 질문을 하나씩 묻기
3. 파일과 폴더 scaffold
4. setup identity를 context file에 간결하게 반영
5. 검증 후 다음 사용법 안내

Phase 파일은 `skills/rds-setup/phases/` 아래에 있습니다.
