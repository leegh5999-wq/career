// 출력물(경력기술서·성과평가) 공용 포맷 헬퍼와 마크다운 빌더
import type {
  Achievement,
  Profile,
  Project,
} from "@/generated/prisma/client";
import {
  achievementCategoryLabels,
  designScopeLabels,
  projectStatusLabels,
} from "./labels";
import { formatDate } from "./format";

export type ProjectWithAchievements = Project & { achievements: Achievement[] };

// "2025.03.01 ~ 진행중" 형태의 기간 문자열
export function periodText(p: Project): string {
  const start = formatDate(p.startDate);
  const end =
    p.status === "IN_PROGRESS" && !p.endDate ? "진행중" : formatDate(p.endDate);
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

export function achievementLine(a: Achievement): string {
  const metric =
    a.metricValue !== null
      ? ` [${achievementCategoryLabels[a.category]}, ${a.metricValue.toLocaleString()}${a.metricUnit ?? ""}]`
      : ` [${achievementCategoryLabels[a.category]}]`;
  return `${formatDate(a.occurredAt)} ${a.rawText}${metric}`;
}

export function buildCareerMarkdown(
  profile: Profile | null,
  projects: ProjectWithAchievements[],
): string {
  const lines: string[] = ["# 경력기술서", ""];

  if (profile) {
    const title = profile.jobTitle ? ` · ${profile.jobTitle}` : "";
    lines.push(`**${profile.name}**${title}`);
    const contacts = [profile.email, profile.phone].filter(Boolean).join(" · ");
    if (contacts) lines.push(contacts);
    if (profile.summary) lines.push("", profile.summary);
    lines.push("");
  }

  lines.push(`## 프로젝트 경력 (${projects.length}건)`, "");

  for (const p of projects) {
    lines.push(`### ${p.name}`);
    lines.push(`- 기간: ${periodText(p)} (${projectStatusLabels[p.status]})`);
    const basics = [
      p.client && `발주처: ${p.client}`,
      p.buildingUse && `용도: ${p.buildingUse}`,
      p.company && `소속: ${p.company}`,
      p.role && `역할: ${p.role}`,
    ]
      .filter(Boolean)
      .join(" / ");
    if (basics) lines.push(`- ${basics}`);
    const scale = scaleText(p);
    if (scale) lines.push(`- 규모: ${scale}`);
    if (p.designScopes.length > 0) {
      lines.push(
        `- 담당 설계범위: ${p.designScopes.map((s) => designScopeLabels[s]).join(", ")}`,
      );
    }
    if (p.scopeDetail) lines.push(`- 범위 상세: ${p.scopeDetail}`);
    const outputs = [
      p.drawingCount && `도면 ${p.drawingCount}장`,
      p.calcTypes.length > 0 && `계산서: ${p.calcTypes.join(", ")}`,
      p.tools.length > 0 && `툴: ${p.tools.join(", ")}`,
    ]
      .filter(Boolean)
      .join(" · ");
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
  from: Date,
  to: Date,
  projects: ProjectWithAchievements[],
): string {
  const lines: string[] = [
    `# 성과 정리 (${formatDate(from)} ~ ${formatDate(to)})`,
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
