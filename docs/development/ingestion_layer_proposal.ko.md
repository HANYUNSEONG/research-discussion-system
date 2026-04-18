# RDS Raw Data → Markdown 변환 레이어 제안 (초안)

이 문서는 **사용자 입력은 로우 포맷(PDF/XLSX/HWP 등) 그대로 허용**하되, RDS 내부에서 AI가 읽는 경로에는 **Markdown 정규화 레이어**를 두는 설계를 제안합니다.

## 1) 현재 RDS에서 끼워 넣기 좋은 위치

RDS 백엔드는 현재 `scaffold`, `validate`, `doctor`, `update-index`, `convert-linking` 중심입니다.

- 진입점: `src/cli.ts`
- 커맨드 폴더: `src/commands/`
- 파일 유틸: `src/lib/files.ts`

따라서 변환 레이어는 **새 CLI 커맨드**로 추가하는 것이 가장 자연스럽습니다.

- 제안 커맨드: `rds ingest-materials`
- 제안 파일: `src/commands/ingest-materials.ts`
- CLI 등록: `src/cli.ts`, `src/index.ts`

## 2) 프로젝트 디렉터리 관점(권장)

스캐폴드별 1번 폴더(`01_*`)에 다음 규약을 권장합니다.

- `raw/`: 사용자가 올린 원본
- `derived/markdown/`: AI 읽기용 Markdown
- `derived/meta/`: 페이지 매핑, 표/수식/이미지 위치, 변환 로그(JSON)

예시:

```text
01_research_materials/
  raw/
    paper_a.pdf
    survey.xlsx
    appendix.hwp
  derived/
    markdown/
      paper_a.md
      survey.md
      appendix.md
    meta/
      paper_a.json
      survey.json
      appendix.json
```

## 3) 처리 파이프라인(최소 기능)

1. 파일 타입 감지 (확장자 + MIME)
2. 포맷별 변환기 선택
3. Markdown 생성
4. 메타데이터 생성 (source path, checksum, page/table anchor)
5. 증분 처리(동일 checksum 스킵)
6. 결과 인덱싱(필요 시 `rds update-index` 연계)

핵심 원칙:

- 원본 불변 보존
- 파생본 재생성 가능(재현성)
- 실패는 파일 단위 격리(부분 성공 허용)

## 4) 변환기 전략(Provider-neutral)

RDS 코어는 특정 AI/벤더 종속 없이, **변환 어댑터 인터페이스**만 정의합니다.

- `pdf`: marker/docling/azure layout 등 외부 도구 어댑터
- `xlsx`: 시트별 Markdown table + 통계 요약
- `pptx`: 슬라이드 단위 텍스트/목록/표 중심 변환
- `hwp`: 2차 지원 후보(초기에는 명시적 미지원 또는 best-effort)

즉, 코어는 아래만 책임집니다.

- 입력 스캔
- 어댑터 호출 계약
- 산출물 저장 규약
- 상태/로그 기록

## 5) 토큰·품질 운영 지표

`99_meta/ingestion_metrics.json`에 최소 지표를 저장합니다.

- 파일별 원문 길이/Markdown 길이
- 모델별 추정 토큰 수(옵션)
- 표/수식/이미지 보존율(가능한 범위)
- ingest 성공률/실패 코드

운영 시에는 "Markdown이면 무조건 저비용"으로 가정하지 않고, **실측 기반**으로 조정합니다.

## 6) 단계적 도입 로드맵

### Phase 1 (저위험)
- 디렉터리 규약 + 매니페스트 + dry-run
- `--manifest-only`로 어떤 파일이 어떻게 변환될지 미리 확인

### Phase 2 (실사용)
- PDF/XLSX/PPTX 우선 정식 지원
- HWP는 2차 지원 후보로 분리

### Phase 3 (고도화)
- 구조 인식 chunking 힌트 생성
- discussion 생성 시 자동 첨부 컨텍스트 후보 추천

## 7) 레퍼런스

- Microsoft MarkItDown: <https://github.com/microsoft/markitdown>
- Unstructured partition/chunking: <https://docs.unstructured.io/open-source/core-functionality/partitioning>
- Unstructured chunking: <https://docs.unstructured.io/open-source/core-functionality/chunking>
- Docling converter reference: <https://docling-project.github.io/docling/reference/document_converter/>
- Azure AI Document Intelligence: <https://ai.azure.com/catalog/models/Azure-AI-Document-Intelligence>
- OpenAI File Search: <https://platform.openai.com/docs/assistants/tools/file-search>
- Apache Tika formats (HWP 포함 포맷 참고): <https://tika.apache.org/3.1.0/formats.html>
