# 컨텍스트 노트

작업 중 내린 결정과 근거를 계속 append 한다. 다음 세션(사람이든 에이전트든)이 이걸 읽고 이어받는다.

## 2026-07-08 — 컨셉 확정
- **컨셉**: 성과 로그. 평소 가볍게 기록 → AI가 경력기술서·이력서·성과자료로 변환. 후보였던 타임라인/포트폴리오·구직 CRM·스킬관리보다 입력부담이 낮고 출력가치가 높아 지속 사용 가능성이 크다고 판단.
- **사용 범위**: 개인용으로 시작, 서비스화 가능한 구조. 경력 데이터는 수년간 쌓이므로 로컬 유실 위험을 피하려 클라우드 DB를 권장.
- **직군**: 전기·통신 설계 엔지니어. 기록 단위를 "프로젝트(현장)"로 잡고, 담당 설계범위(수변전·간선·조명·접지피뢰·소방전기·구내통신·방송공동수신·정보통신 등)를 구조화.
- **경력 용도(확정)**: 이직·연봉협상 / 사내 성과평가 / 협회 경력신고·공식 증빙. 발주처·사업규모·참여기간·역할 등 규정 지향 필드 포함. 기술사·자격준비는 선택되지 않아 Phase 5로 후순위.

## 2026-07-08 — 스택·진행 방식 결정
- **기술 스택 확정**: 클라우드. Next.js(App Router) + Supabase(Postgres) + Prisma + Vercel.
- **AI 후순위 확정**: Claude API 키 미준비. Phase 0~2(기록) + Phase 4(비-AI 출력)를 먼저 만들고, Phase 3(AI 정리)는 키가 준비되면 착수.
- **진행 방식(중요)**: 지금은 컨셉·기획만 확정하는 단계. 실제 개발(코딩·스캐폴딩·설치)은 사용자가 명시적으로 "시작" 지시할 때만 착수한다. 그 전까지는 문서 정리까지만.

## 미확정 · 확인 필요
- **협회 경력신고 양식**: 건설기술인 / 정보통신기술자 / 전기공사기술자 중 실제 어디에 신고하는지에 따라 규정 필드 상세가 달라질 수 있음. 개발 착수 전 사용자 실제 워크플로 확인 필요.

## 2026-07-08 — Phase 0 완료
- **스캐폴딩**: create-next-app 16.2.10 (TS·Tailwind 4·App Router·src 디렉터리·npm). 루트에 기존 파일이 있어 임시 하위 폴더에 생성 후 루트로 이동. create-next-app이 만든 AGENTS.md/CLAUDE.md는 그대로 둠.
- **Prisma 7 대응(중요)**: npm이 Prisma 7.8을 설치했고, v7부터 datasource url/directUrl을 스키마에 못 쓴다. 연결 URL은 prisma.config.ts(CLI·마이그레이션용, DIRECT_URL) + src/lib/prisma.ts의 @prisma/adapter-pg(런타임, DATABASE_URL)로 분리. 생성 클라이언트는 src/generated/prisma (gitignore, postinstall로 재생성). import는 "@/generated/prisma/client".
- **데이터 모델**: Project(규정 지향 필드 + designScopes enum 배열) / Achievement(rawText 원문 보존, refinedText는 Phase 3용) / Certification. 규모 필드는 연면적·수전용량·세대수 + scaleNote로 단순화.
- **폰트**: Geist 제거(한글 미지원) → 한글 친화 시스템 폰트 스택.
- **다음 작업 전 필요**: 사용자가 Supabase 프로젝트 생성 후 .env에 DATABASE_URL(6543 풀러)·DIRECT_URL(5432) 입력 → npx prisma migrate dev로 첫 마이그레이션. 이후 Phase 1(프로젝트 CRUD) 착수.
