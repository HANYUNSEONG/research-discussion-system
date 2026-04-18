# Ingestion 작업 핸드오프 노트

이 문서는 다음 세션에서 바로 이어서 구현할 수 있도록, 현재까지의 리서치/플래닝 산출물과 우선순위를 요약합니다.

## 1) 현재 확정 사항

- 1차 지원 포맷: **PDF, XLSX, PPTX**
- 파일 단위 실패 허용
- 실패 시 사용자 피드백 필수
- 기본 전략: Markdown-first 참조(없으면 변환 후 참조)

## 2) 참조해야 할 문서

1. `docs/development/architecture.md`
   - Ingestion Normalization Layer 제안 섹션
2. `docs/development/ingestion_layer_proposal.ko.md`
   - 전체 파이프라인 및 저장 규약
3. `docs/development/ingestion_strategy_evaluation.ko.md`
   - MarkItDown vs 모델 네이티브 처리 비교
4. `docs/development/ingestion_implementation_plan.ko.md`
   - 코드 레벨 구현 블루프린트/테스트/DoD

## 3) 다음 세션의 추천 시작 순서

1. Step 0 고정
   - CLI 옵션/에러코드/`ingestion_last_run.json` 스키마 확정
2. Step 1 구현
   - `rds ingest-materials` 명령 골격 + dry-run/manifest-only
3. Step 2 구현
   - MarkItDown adapter 연동
4. Step 3 안정화
   - timeout/concurrency/retry + 실패 UX 개선

## 4) 구현 파일 초안

- `src/commands/ingest-materials.ts`
- `src/lib/ingestion/types.ts`
- `src/lib/ingestion/runner.ts`
- `src/lib/ingestion/adapters/markitdown.ts`
- `src/lib/ingestion/persist.ts`

## 5) 완료 기준(요약)

- 파일 단위 성공/실패 집계 가능
- 실패 원인 코드화 및 사용자 출력 가능
- 파생 Markdown/메타 저장 경로 일관
- 기존 명령군 회귀 테스트 통과
