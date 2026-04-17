# Safety

[English](safety.md)

RDS는 로컬 파일 기반 연구 디스커션 프레임워크입니다. RDS 자체가 특정 AI provider를 규제 데이터, 환자 식별 가능 데이터, compliance-bound data에 안전하게 만들어주지는 않습니다.

## 기관 승인 없이 사용하지 말아야 할 데이터

- 환자 식별 가능 데이터
- 규제 대상 임상 데이터
- protected health information
- 계약상 제한된 공동연구 데이터
- 승인된 시스템 밖으로 나가면 안 되는 미공개 민감 데이터

## 기본 원칙

- 민감 데이터는 AI와 논의하기 전에 de-identify합니다.
- 승인되지 않은 raw regulated data는 agent-accessible folder 밖에 둡니다.
- AI가 제안한 설명은 evidence가 아니라 hypothesis로 표시합니다.
- AI 해석을 연구 결론으로 취급하기 전에 사람이 검토합니다.
- 데이터 제한 사항은 `99_meta/safety_and_data_policy.md`에 기록합니다.

## Discussion Logging

Discussion을 닫을 때는 다음을 구분해 기록합니다.

- 실제로 검토한 파일
- evidence로 뒷받침되는 claim
- hypothesis
- 연구자가 명시적으로 내린 decision
- 남은 uncertainty

여러 AI 도구가 같은 프로젝트에 참여할수록 이 구분이 중요합니다.
