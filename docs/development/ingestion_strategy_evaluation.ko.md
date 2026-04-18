# RDS 문서 변환 전략 평가: RDS 내 변환 vs 모델(코덱스/클로드) 자체 처리

## 결론(요약)

단일 선택보다는 **하이브리드 전략**이 가장 현실적입니다.

- RDS 기본: 로컬/백엔드에서 **정규화된 Markdown 파생본** 생성(재현성, 검색 일관성)
- 모델 네이티브: PDF 시각 이해가 필요한 질문에서 **선택적으로** 사용

즉, 평상시는 RDS ingestion 경로를 기본으로 하고, 시각 요소(차트/도식/표 레이아웃)가 핵심인 경우에만 모델 네이티브 처리로 우회합니다.

## 1) MarkItDown을 RDS에서 쓸 수 있는가?

가능합니다. MarkItDown은 Python CLI/라이브러리 형태로, 파일을 Markdown으로 변환하는 도구입니다.

- CLI 사용 예: `markitdown path-to-file.pdf > document.md`
- 포맷별 optional dependency: `pdf`, `pptx`, `xlsx` 등

RDS(Node backend)에서는 다음 방식으로 연동 가능합니다.

1. `ingest-materials` 커맨드에서 파일 탐색
2. `child_process.spawn()`으로 MarkItDown 호출
3. stdout/stderr 및 exit code를 파일별로 수집
4. `derived/markdown/*.md` + `derived/meta/*.json` 저장

이 방식은 RDS의 provider-neutral 원칙과도 충돌하지 않습니다(특정 모델 기능 의존 없음).

## 2) 모델 자체 처리(코덱스/클로드)는 더 성능이 좋은가?

"항상" 좋다고 보기 어렵습니다. 항목별로 장단이 다릅니다.

### 2.1 정확도/이해 품질

- **클로드 네이티브 PDF**는 시각 이해(차트/이미지/레이아웃)에서 강점이 있습니다.
- 다만 문서 모드 설정(예: citations)이나 API 모드에 따라 동작/비용이 달라질 수 있습니다.
- 비-PDF(.xlsx/.csv/.docx 등)는 별도 text 변환을 권장하는 가이드가 존재합니다.

=> 시각적 PDF QA는 모델 네이티브가 유리할 수 있으나, xlsx/pptx 포함한 일관 ingestion은 별도 정규화 레이어가 더 안정적입니다.

### 2.2 비용/토큰

- 모델 네이티브 PDF 처리에는 토큰 비용이 크게 들 수 있습니다(예: 시각 모드).
- 반복 질의가 많은 연구 워크플로에서는 한 번 변환 + 재사용(캐시/인덱싱)이 총비용을 낮추는 경우가 많습니다.

### 2.3 재현성/감사 가능성

- RDS 내 변환은 동일 입력/엔진 버전으로 재실행 가능하고, 산출물 diff/버전관리 가능.
- 모델 네이티브는 공급자 업데이트/모델 버전 변화로 결과 재현성이 상대적으로 낮을 수 있습니다.

### 2.4 멀티-에이전트 일관성

- RDS에서 Markdown을 공통 산출물로 두면 Codex/Claude/Gemini가 같은 입력을 봅니다.
- 모델별 네이티브 파일 처리에 의존하면 도구 간 결과 편차가 커질 수 있습니다.

## 3) RDS에 권장하는 정책

### 기본 정책

- 1차 포맷(PDF/XLSX/PPTX)은 RDS ingestion에서 변환 수행
- 파일 단위 실패 허용 + 사용자 피드백 필수
- 실패 파일은 원본 경로/에러코드/재시도 가이드를 함께 출력

### 예외 정책 (모델 네이티브 사용)

다음 조건에서만 모델 네이티브 경로를 허용:

- PDF의 시각 요소 분석이 핵심(차트/도식/스캔)
- 변환 결과로 정보 손실이 확인됨
- 단발성 고난도 질의로, 재현성보다 즉시 품질이 우선

## 4) 구현 전 체크리스트

- 런타임: Python + MarkItDown 설치/버전 확인
- 성능: 대용량 PPTX/XLSX timeout 및 메모리 한계 측정
- 품질: 표/도형/주석/슬라이드 노트 손실률 샘플 평가
- 피드백: `ingestion_last_run.json` 스키마 및 에러코드 표준화

## 5) 참고 레퍼런스

- MarkItDown (Microsoft): <https://github.com/microsoft/markitdown>
- OpenAI File Search supported files: <https://developers.openai.com/api/docs/guides/tools-file-search>
- OpenAI ChatGPT file type support: <https://help.openai.com/en/articles/8983675-what-types-of-files-are-supported>
- Anthropic Files API: <https://platform.claude.com/docs/en/build-with-claude/files>
- Anthropic PDF support: <https://platform.claude.com/docs/en/build-with-claude/pdf-support>
- Node child_process: <https://nodejs.org/api/child_process.html>
