# RDS Ingestion 구현 전 탐색/리서치 및 플래닝 (v0)

## 확정된 전제

> 전략 비교 평가는 `docs/development/ingestion_strategy_evaluation.ko.md`를 참조하세요.

- 1차 지원 포맷: **PDF, XLSX, PPTX**
- 파일 단위 실패 허용: **Yes**
- 단, 사용자 피드백: **필수** (성공/실패/원인 요약)

## 1) 현재 코드베이스에서 구현 위치 탐색

현재 CLI 라우팅은 `src/cli.ts`의 `switch`로 명령을 분기하고 있습니다.
새 기능도 같은 패턴으로 추가하는 것이 일관적입니다.

- 신규 명령: `rds ingest-materials`
- 신규 파일: `src/commands/ingest-materials.ts`
- 노출: `src/index.ts` export 추가

관련 근거:

- 기존 명령 라우팅: `scaffold`, `validate`, `doctor`, `update-index`, `convert-linking`
- scaffold가 프로젝트 디렉터리 구조를 생성하는 현재 방식

## 2) 리서치 요약 (구현 후보)

### A. MarkItDown
- LLM 파이프라인용 파일→Markdown 변환을 목표로 함.
- PDF / PowerPoint / Excel 지원을 명시.
- 장점: 목적 적합성 높음, Markdown 출력 직관적.
- 주의: Python 런타임 의존.

### B. Docling
- PDF, DOCX/XLSX/PPTX 등 다중 포맷 지원.
- Markdown 포함 다양한 출력 포맷 지원.
- 장점: 문서 처리 범위 넓고 통합 API 제공.
- 주의: 도입 시 실행 환경/성능 검증 필요.

### C. Unstructured
- `partition_pptx`, `partition_xlsx` 등 포맷별 분해 함수 제공.
- XLSX 시트별 `Table` + `text_as_html` 메타를 제공해 표 보존에 유리.
- 장점: 구조 정보 유지/후처리 유연.
- 주의: 직접 Markdown 렌더링 파이프라인 설계 필요.

### D. Node 실행/오류 처리 기준
- `child_process.spawn()` 사용 시 `error` 이벤트와 `exit`를 함께 다루어야 함.
- `Promise.allSettled()` 기반으로 파일별 성공/실패를 수집하면 부분 실패 허용과 사용자 피드백 요구를 동시에 만족.


## 2.5 디스커션 런타임 강제 흐름(제안)

사용자 제안 흐름(디스커션 시작 → 문서 참조 시 Markdown 강제 → 디스커션 진행)은 RDS 방향과 잘 맞습니다.

권장 보완:

1. 디스커션 시작
2. AI가 파일 참조 요청
3. Resolver가 `derived/markdown` 존재 여부 확인
4. 있으면 즉시 해당 Markdown 참조
5. 없으면 ingest 실행(파일 단위)
6. 성공 파일은 Markdown 참조, 실패 파일은 즉시 사용자에게 피드백
7. 디스커션 계속 진행(부분 성공 허용)

핵심 차이점:

- "없으면 전체 중단"이 아니라 **파일 단위로 계속 진행**
- 실패 파일은 숨기지 않고 `ingestion_last_run.json` + 대화 내 요약으로 노출
- 동일 파일 재참조 시 checksum 기반 스킵(불필요 재변환 방지)

예시 UX 규칙:

- `N개 요청 파일 중 M개 변환 성공, K개 실패(원인: timeout/unsupported)`
- 성공 파일은 즉시 근거로 사용, 실패 파일은 재시도 옵션 제시


## 3) 구현 전략 (권장)

### 3.1 핵심 흐름

1. 입력 스캔: `01_*/raw` 하위 대상 탐색
2. 타입 분류: `.pdf | .xlsx | .pptx`
3. 변환 실행: 외부 변환기 adapter 호출
4. 산출물 저장:
   - `derived/markdown/<basename>.md`
   - `derived/meta/<basename>.json`
5. 결과 집계:
   - 성공/실패 카운트
   - 실패 원인(도구 없음, 파싱 오류, timeout 등)
6. 사용자 피드백 출력:
   - 콘솔 테이블 + `99_meta/ingestion_last_run.json`

### 3.2 최소 CLI 스펙 (초안)

```bash
rds ingest-materials --project ./my-project \
  --input "01_research_materials/raw" \
  --output "01_research_materials/derived" \
  --formats pdf,xlsx,pptx \
  --engine markitdown \
  --continue-on-error \
  --timeout-ms 120000
```

권장 옵션:

- `--dry-run`: 실제 변환 없이 대상/엔진/예상 산출 경로만 출력
- `--manifest-only`: 파일 목록 및 타입 판별 결과만 JSON으로 기록
- `--max-concurrency <n>`: 병렬 실행 상한

### 3.3 실패 피드백 포맷

```json
{
  "run_at": "2026-04-18T00:00:00Z",
  "engine": "markitdown",
  "summary": {
    "total": 12,
    "succeeded": 9,
    "failed": 3
  },
  "files": [
    {
      "source": "01_research_materials/raw/a.pdf",
      "status": "succeeded",
      "output_markdown": "01_research_materials/derived/markdown/a.md"
    },
    {
      "source": "01_research_materials/raw/b.pptx",
      "status": "failed",
      "error_code": "ENGINE_TIMEOUT",
      "error_message": "converter timed out after 120000ms"
    }
  ]
}
```

## 4) 단계별 실행 계획

### Step 0 — 설계 확정
- CLI 옵션/출력 스키마 확정
- 파생 경로 규약 확정

### Step 1 — 골격 구현
- `ingest-materials` command 추가
- 파일 탐색/필터링/결과 JSON 저장
- 아직 변환기는 mock adapter

### Step 2 — 엔진 1개 연동
- MarkItDown 우선 연동
- PDF/XLSX/PPTX 실제 변환 + 실패코드 매핑

### Step 3 — 운영 품질
- timeout/retry/concurrency 튜닝
- `doctor`에 ingestion 환경 진단 항목 추가 (선택)

## 5) 오픈 이슈

- Python 엔진을 기본 전제로 둘지(없으면 graceful fallback)
- PPTX 이미지/노트/도형 텍스트 보존 정책
- XLSX에서 매우 큰 시트 처리(행 제한, 샘플링 여부)

## 6) 참고 레퍼런스

- MarkItDown README: <https://github.com/microsoft/markitdown>
- Docling supported formats: <https://docling-project.github.io/docling/usage/supported_formats/>
- Unstructured partition docs: <https://unstructured.readthedocs.io/en/latest/core/partition.html>
- Node child_process docs: <https://nodejs.org/api/child_process.html>
- MDN Promise.allSettled: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled>


## 7) 구현 블루프린트 (코드 레벨 초안)

### 7.1 모듈 분해

- `src/commands/ingest-materials.ts`
  - CLI args 파싱
  - 대상 파일 수집/필터링
  - 실행 요약 출력
- `src/lib/ingestion/types.ts`
  - `IngestionJob`, `IngestionResult`, `IngestionErrorCode` 타입
- `src/lib/ingestion/runner.ts`
  - 파일별 작업 실행(`Promise.allSettled`)
  - timeout/concurrency 제어
- `src/lib/ingestion/adapters/markitdown.ts`
  - MarkItDown 실행 어댑터(`spawn`)
- `src/lib/ingestion/persist.ts`
  - `derived/markdown`, `derived/meta`, `99_meta/ingestion_last_run.json` 저장

### 7.2 에러 코드 표준(초안)

- `ENGINE_NOT_FOUND`
- `ENGINE_TIMEOUT`
- `UNSUPPORTED_FORMAT`
- `CONVERSION_FAILED`
- `OUTPUT_WRITE_FAILED`
- `UNKNOWN`

### 7.3 최소 테스트 계획

1. 단위 테스트
   - 확장자 필터링(`pdf/xlsx/pptx`)
   - 에러 코드 매핑
   - checksum 변경 감지
2. 통합 테스트(모의 엔진)
   - 3개 파일 중 1개 실패 시 부분 성공 검증
   - `ingestion_last_run.json` 스키마 검증
3. 회귀 테스트
   - 기존 `rds` 명령군(scaffold/validate/doctor/update-index/convert-linking) 영향 없음 확인

### 7.4 단계별 완료 기준(DoD)

- Step 0 완료: CLI 스펙/JSON 스키마/에러코드 표 확정
- Step 1 완료: dry-run + manifest-only + 파일 탐색 동작
- Step 2 완료: MarkItDown 연동 및 파일별 성공/실패 리포트
- Step 3 완료: timeout/concurrency/재시도 및 문서화

### 7.5 리서치 업데이트(2026-04-18)

- MarkItDown: Office/PDF 변환 CLI 중심으로 빠른 통합에 유리
- Docling CLI(v2): Markdown/JSON 변환 워크플로 확장성 큼
- Node `child_process`: timeout/abort/exit 이벤트를 명시적으로 다루는 패턴 필요

따라서 1차 구현은 **MarkItDown 단일 엔진 + adapter 인터페이스 분리**가 가장 리스크가 낮습니다.

