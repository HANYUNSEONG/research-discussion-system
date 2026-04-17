# 오픈소스 포지셔닝

[English](open_source.md)

RDS는 특정 연구실이나 특정 분야를 위한 개인 노트 템플릿이 아니라, 범용 연구 인프라 프로젝트를 목표로 합니다.

## 대상 사용자

- 대학원생
- 포닥
- 연구원
- 작은 R&D 팀
- 로컬에 오래 남는 AI-assisted discussion record가 필요한 연구실

## 초기 검증 목표

초기 검증은 여러 연구 모드를 포함해야 합니다.

- protocol, raw data, figure, assay interpretation이 있는 wet lab 프로젝트
- dataset, pipeline, experiment, reproducibility가 중요한 computational 프로젝트
- research design, data, coding decision, limitation을 다루는 사회과학 프로젝트
- problem statement, proof attempt, assumption, failed path를 추적하는 이론 프로젝트
- 실험, 분석, writing 사이의 handoff가 필요한 mixed 프로젝트

## 일반화 규칙

특정 분야에만 해당하는 affordance는 example이나 scaffold-specific file에 둡니다. 더 넓은 연구 패턴으로 일반화될 수 있을 때만 core RDS 파일에 반영합니다.

## 배포 목표

- 프로그래밍 지식 없이 AI 도구 workflow로 사용할 수 있을 것
- 지원되는 환경에서는 plugin 또는 skill pack으로 설치 가능할 것
- plain Markdown과 작은 script로 inspect 가능할 것
- 연구실 단위로 fork하고 수정 가능할 것
- 특정 AI provider에 종속되지 않을 것
