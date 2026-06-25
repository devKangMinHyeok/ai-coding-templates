---
date: 2024-01-01
scope: tech
status: active
source: auto/interview
---

# Supabase를 DB로 선택

## 결정
데이터베이스로 Supabase(무료 플랜)를 사용한다.

## 이유
- 무료 플랜으로 프로젝트 2개, 500MB 스토리지, 50K 월간 활성 사용자까지 가능
- PostgreSQL 기반이라 SQL 표준을 따르고, 나중에 다른 PostgreSQL 호스팅으로 마이그레이션이 쉬움
- 인증, 스토리지, 실시간 구독 등 부가 기능이 내장
- 대시보드 UI가 좋아서 비개발자도 데이터를 직접 확인 가능

## 고려한 대안
- **Firebase**: NoSQL(Firestore)이라 관계형 데이터에 부적합, 쿼리 제약이 많음
- **PlanetScale**: MySQL 기반, 무료 플랜 축소/폐지 이력
- **Neon**: PostgreSQL 서버리스, 좋지만 Supabase보다 부가 기능이 적음
- **로컬 SQLite**: 배포 시 데이터 유지 불가, 학습용으로만 가능

## 되돌릴 조건
무료 플랜 한도를 넘기거나, PostgreSQL이 아닌 DB가 필요해지면 재검토.
