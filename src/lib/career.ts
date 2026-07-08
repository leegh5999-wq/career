// 경력기간 합산 — 프로젝트 참여기간을 중복 제거(구간 병합)하여 합산 (협회 신고 참고용)
import type { Project } from "@/generated/prisma/client";

type Interval = { start: Date; end: Date };

const DAY_MS = 24 * 60 * 60 * 1000;

// 시작일 포함(+1일) 일수
export function intervalDays(start: Date, end: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1);
}

// 프로젝트 → 유효 구간 (시작일 없으면 제외, 종료일 없으면 오늘까지)
export function projectInterval(p: Project, today: Date): Interval | null {
  if (!p.startDate) return null;
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
export function totalCareerDays(projects: Project[], today: Date): number {
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
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years === 0 && months === 0) return `${days}일`;
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}년`;
  return `${years}년 ${months}개월`;
}
