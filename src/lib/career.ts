// 경력기간 합산 — 프로젝트 참여기간을 중복 제거(구간 병합)하여 합산 (협회 신고 참고용)
import type { Project } from "@/generated/prisma/client";

// select 프로젝션으로 일부 컬럼만 조회해도 쓸 수 있게 구조적 타입 사용
export type ProjectPeriod = Pick<Project, "startDate" | "endDate" | "status">;

type Interval = { start: Date; end: Date };

const DAY_MS = 24 * 60 * 60 * 1000;

// 시작일 포함(+1일) 일수
export function intervalDays(start: Date, end: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1);
}

// 프로젝트 → 유효 구간. 종료일이 없으면 "진행중"일 때만 오늘까지로 계산
// (완료·보류인데 종료일이 없으면 기간을 알 수 없으므로 합산에서 제외)
export function projectInterval(p: ProjectPeriod, today: Date): Interval | null {
  if (!p.startDate) return null;
  if (!p.endDate && p.status !== "IN_PROGRESS") return null;
  const end = p.endDate ?? today;
  if (end < p.startDate) return null;
  return { start: p.startDate, end };
}

// 겹치는 구간을 병합
export function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const merged: Interval[] = [];
  for (const cur of sorted) {
    const last = merged[merged.length - 1];
    if (last && cur.start.getTime() <= last.end.getTime() + DAY_MS) {
      // 겹치거나 하루 차이로 이어지면 병합
      if (cur.end > last.end) last.end = cur.end;
    } else {
      merged.push({ ...cur });
    }
  }
  return merged;
}

// 중복 제거된 총 경력 일수
export function totalCareerDays(projects: ProjectPeriod[], today: Date): number {
  const intervals = projects
    .map((p) => projectInterval(p, today))
    .filter((i): i is Interval => i !== null);
  return mergeIntervals(intervals).reduce(
    (sum, i) => sum + intervalDays(i.start, i.end),
    0,
  );
}

// 일수 → "X년 Y개월" (참고치)
export function formatDuration(days: number): string {
  let years = Math.floor(days / 365);
  let months = Math.floor((days % 365) / 30);
  if (months === 12) {
    // 360~364일 잔여가 12개월로 계산되는 경계 보정
    years += 1;
    months = 0;
  }
  if (years === 0 && months === 0) return `${days}일`;
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}년`;
  return `${years}년 ${months}개월`;
}
