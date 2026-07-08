// 출력물(경력기술서·성과평가) 공용 데이터 조회·포맷 헬퍼·마크다운 빌더
// 인쇄 페이지와 마크다운 라우트가 반드시 같은 데이터·같은 문구를 쓰도록 여기에 모은다.
import type {
  Achievement,
  Certification,
  Profile,
  Project,
} from "@/generated/prisma/client";
import { prisma } from "./prisma";
import {
  achievementCategoryLabels,
  certificationKindLabels,
  designScopeLabels,
  projectStatusLabels,
} from "./labels";
import { formatDate, todayKstInput } from "./format";

export type ProjectWithAchievements = Project & { achievements: Achievement[] };

// --- 데이터 조회 (페이지·마크다운 라우트 공용) ---

export async function getCareerData() {
  const [profile, projects, certifications] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    prisma.project.findMany({
      orderBy: [
        { startDate: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
      include: {
        achievements: {
          orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
        },
      },
    }),
    prisma.certification.findMany({
      orderBy: [
        { acquiredAt: { sort: "desc", nulls: "last" } },
        { createdAt: "desc" },
      ],
    }),
  ]);
  return { profile, projects, certifications };
}

// from/to 쿼리 파라미터 검증·기본값 처리 — KST 달력일 기준 경계
export function parseReviewRange(from?: string | null, to?: string | null) {
  const kstToday = todayKstInput();
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const fromStr =
    from && dateRe.test(from) ? from : `${kstToday.slice(0, 4)}-01-01`;
  const toStr = to && dateRe.test(to) ? to : kstToday;
  return {
    fromStr,
    toStr,
    fromDate: new Date(`${fromStr}T00:00:00+09:00`),
    toDate: new Date(`${toStr}T23:59:59.999+09:00`),
  };
}

export async function getReviewProjects(fromDate: Date, toDate: Date) {
  return prisma.project.findMany({
    where: {
      achievements: { some: { occurredAt: { gte: fromDate, lte: toDate } } },
    },
    orderBy: [
      { startDate: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    include: {
      achievements: {
        where: { occurredAt: { gte: fromDate, lte: toDate } },
        orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

// --- 포맷 헬퍼 (JSX와 마크다운이 공유) ---

// "2025.03.01 ~ 진행중" 형태의 기간 문자열
export function periodText(
  p: Pick<Project, "startDate" | "endDate" | "status">,
): string {
  const start = formatDate(p.startDate);
  const end = p.endDate
    ? formatDate(p.endDate)
    : p.status === "IN_PROGRESS"
      ? "진행중"
      : "종료일 미입력";
  return `${start} ~ ${end}`;
}

// 연면적·수전용량·세대수·기타를 한 줄로
export function scaleText(p: Project): string {
  const parts: string[] = [];
  if (p.grossFloorArea) parts.push(`연면적 ${p.grossFloorArea.toLocaleString()}㎡`);
  if (p.powerCapacity) parts.push(`수전용량 ${p.powerCapacity.toLocaleString()}kVA`);
  if (p.householdCount) parts.push(`${p.householdCount.toLocaleString()}세대`);
  if (p.scaleNote) parts.push(p.scaleNote);
  return parts.join(" · ");
}

// 발주처·용도·소속·역할 한 줄
export function basicsText(p: Project): string {
  return [
    p.client && `발주처 ${p.client}`,
    p.buildingUse && `용도 ${p.buildingUse}`,
    p.company && `소속 ${p.company}`,
    p.role && `역할 ${p.role}`,
  ]
    .filter(Boolean)
    .join(" / ");
}

// 도면·계산서·툴 한 줄 (0장도 유효한 값으로 표시)
export function outputsText(p: Project): string {
  return [
    p.drawingCount != null && `도면 ${p.drawingCount}장`,
    p.calcTypes.length > 0 && `계산서: ${p.calcTypes.join(", ")}`,
    p.tools.length > 0 && `툴: ${p.tools.join(", ")}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function achievementLine(a: Achievement): string {
  const metric =
    a.metricValue !== null
      ? ` [${achievementCategoryLabels[a.category]}, ${a.metricValue.toLocaleString()}${a.metricUnit ?? ""}]`
      : ` [${achievementCategoryLabels[a.category]}]`;
  return `${formatDate(a.occurredAt)} ${a.rawText}${metric}`;
}

export function certificationLine(c: Certification): string {
  const detail = [
    c.issuer,
    c.acquiredAt && `취득 ${formatDate(c.acquiredAt)}`,
    c.expiresAt && `만료 ${formatDate(c.expiresAt)}`,
  ]
    .filter(Boolean)
    .join(", ");
  return `${c.name}${detail ? ` (${detail})` : ""} [${certificationKindLabels[c.kind]}]`;
}

// --- 마크다운 빌더 ---

export function buildCareerMarkdown(
  profile: Profile | null,
  projects: ProjectWithAchievements[],
  certifications: Certification[],
): string {
  const lines: string[] = ["# 경력기술서", ""];

  if (profile) {
    const title = profile.jobTitle ? ` · ${profile.jobTitle}` : "";
    // 줄 끝 공백 2개 = 마크다운 강제 줄바꿈 (이름·연락처가 한 문단으로 뭉치지 않게)
    lines.push(`**${profile.name}**${title}  `);
    const contacts = [profile.email, profile.phone].filter(Boolean).join(" · ");
    if (contacts) lines.push(`${contacts}  `);
    if (profile.summary) lines.push("", profile.summary);
    lines.push("");
  }

  if (certifications.length > 0) {
    lines.push(`## 보유 자격·교육 (${certifications.length}건)`, "");
    for (const c of certifications) lines.push(`- ${certificationLine(c)}`);
    lines.push("");
  }

  lines.push(`## 프로젝트 경력 (${projects.length}건)`, "");

  for (const p of projects) {
    lines.push(`### ${p.name}`);
    lines.push(`- 기간: ${periodText(p)} (${projectStatusLabels[p.status]})`);
    const basics = basicsText(p);
    if (basics) lines.push(`- ${basics}`);
    const scale = scaleText(p);
    if (scale) lines.push(`- 규모: ${scale}`);
    if (p.designScopes.length > 0) {
      lines.push(
        `- 담당 설계범위: ${p.designScopes.map((s) => designScopeLabels[s]).join(", ")}`,
      );
    }
    if (p.scopeDetail) lines.push(`- 범위 상세: ${p.scopeDetail}`);
    const outputs = outputsText(p);
    if (outputs) lines.push(`- 산출물: ${outputs}`);
    if (p.achievements.length > 0) {
      lines.push("", "주요 성과:");
      for (const a of p.achievements) lines.push(`- ${achievementLine(a)}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function buildReviewMarkdown(
  fromStr: string,
  toStr: string,
  projects: ProjectWithAchievements[],
): string {
  const lines: string[] = [
    `# 성과 정리 (${fromStr.replaceAll("-", ".")} ~ ${toStr.replaceAll("-", ".")})`,
    "",
  ];
  const total = projects.reduce((n, p) => n + p.achievements.length, 0);
  lines.push(`총 ${total}건 / ${projects.length}개 프로젝트`, "");

  for (const p of projects) {
    lines.push(`## ${p.name}`);
    for (const a of p.achievements) lines.push(`- ${achievementLine(a)}`);
    lines.push("");
  }

  return lines.join("\n");
}
