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

## 2026-07-08 — Phase 1 완료 (프로젝트 CRUD)
- **DB 연결 완료**: 사용자가 Supabase(서울 리전) 생성, .env 입력. 첫 마이그레이션(init) 적용, 풀러(6543)·직접(5432) 연결 모두 확인.
- **구조**: 서버 액션(src/app/projects/actions.ts) + 네이티브 폼. 클라이언트 컴포넌트는 삭제 확인 버튼 하나뿐. 등록·수정은 project-form.tsx 공용.
- **enum 라벨**: 한글 라벨은 src/lib/labels.ts에 중앙화. enum import는 "@/generated/prisma/enums".
- **목록·상세는 force-dynamic**: 데이터 앱이므로 프리렌더 대신 요청 시 렌더.
- **E2E 검증됨**: 프리뷰에서 등록→목록→상세→수정 실제 수행, DB 반영 확인. 주의 — 페이지 로드 직후 자동화 클릭은 하이드레이션 전이라 유실될 수 있음(첫 테스트에서 체크박스 유실 재현, 앱 버그 아님).
- **테스트 데이터**: "행복도시 A-1블록 공동주택 신축공사" 1건이 DB에 남아 있음(예시용). 삭제는 UI에서 가능.
- **다음**: Phase 2 성과 로그 (프로젝트 상세에 한 줄 기록 UI + 대시보드 최근 성과).

## 2026-07-08 — 배포 (GitHub + Vercel)
- **GitHub**: https://github.com/leegh5999-wq/career (main). Vercel GitHub 앱 미설치로 자동 배포 연결은 실패 — 배포는 CLI(npx vercel --prod)로 수행 중. 자동 배포 원하면 Vercel 대시보드에서 Git 연결 필요.
- **Vercel**: 프로젝트 career (leegh5999-wqs-projects). 프로덕션 URL https://career-two-tau.vercel.app
- **트러블슈팅(중요)**: PowerShell 파이프로 `vercel env add`에 값을 넣으면 맨 앞에 BOM(U+FEFF)이 붙는다. 이로 인해 배포 환경에서 pg 파서가 호스트를 "base"로 오파싱 → P1001. 해결책은 src/lib/prisma.ts의 sanitizeUrl()로 값 정화 + URL 직접 분해 후 명시적 필드로 PrismaPg에 전달. Vercel에 저장된 환경변수 4개는 여전히 BOM이 붙어 있으나 코드에서 정화하므로 동작함. 나중에 대시보드에서 재입력하면 깨끗해짐.
- **환경변수**: DATABASE_URL·DIRECT_URL을 Production·Preview에 등록(Sensitive). .env는 .vercelignore로 배포 번들에서 제외.
- **검증**: 배포 후 /projects 200 + DB 데이터 렌더 확인. 임시 진단 라우트(/api/diag)는 원인 확인 후 삭제 완료.

## 2026-07-08 — Phase 2 완료 (성과 로그)
- **구조**: createAchievement/deleteAchievement는 projects/actions.ts에 추가. 폼·목록은 src/components의 AchievementForm/AchievementList 공용 (projectId 고정 vs 프로젝트 select). 삭제 확인은 범용 ConfirmButton.
- **UX 결정**: 기록 동선 최소화가 컨셉 핵심이라 대시보드에 "오늘의 성과 기록" 빠른 입력을 배치. 서버 액션은 redirect 없이 revalidate만 → React 19가 폼 자동 리셋. 분류 기본값은 OTHER(잘못된 분류 데이터 방지).
- **E2E 검증**: 프리뷰에서 기록→대시보드·상세 표시→삭제 확인. 프로덕션 배포 후 대시보드 렌더 확인.
- **주의(자동화 테스트)**: 프리뷰 자동화의 버튼 click이 폼 제출을 못 일으키는 경우가 있음 — form.requestSubmit()이 신뢰됨.
- **사용자 실사용 시작**: 프로덕션 DB에 사용자가 만든 "테스트" 프로젝트 3건 존재.
- **다음 후보**: Phase 4(출력물) 먼저 or Phase 5(자격·기술등급) or Phase 3(AI, 키 필요). 사용자와 협의.

## 2026-07-08 — Phase 4 완료 (출력물)
- **범위 결정**: 이력서는 Phase 5 이후로 연기 — 자격·학력 데이터 없이는 반쪽짜리. 경력기술서 + 성과평가 자료에 집중.
- **PDF 전략**: 라이브러리 없이 인쇄 최적화 페이지(@media print, Tailwind print: variant) + 브라우저 "PDF로 저장". 마크다운 다운로드 라우트 병행(career.md / review.md, RFC 5987 한글 파일명).
- **구조**: Profile 모델(단일 행 id="main") + /settings 업서트. 마크다운 빌더·포맷 헬퍼는 src/lib/export.ts 공용 — 문서 형식 바꿀 땐 여기.
- **주의(개발 환경)**: prisma migrate dev가 generate를 자동 실행하지 않음(Prisma 7). 스키마 변경 후 dev 서버가 구버전 클라이언트를 전역 싱글턴으로 캐시하므로 npx prisma generate + dev 서버 재시작 필요.
- **프로필 데이터**: 이름을 "이경호"로 추정 입력(이메일 기반 추측) — 사용자가 /settings에서 확인·수정 필요.
