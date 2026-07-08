// 성과 로그 목록 — 프로젝트 상세와 대시보드에서 공용으로 사용
import Link from "next/link";
import type { AchievementCategory } from "@/generated/prisma/enums";
import { achievementCategoryLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { deleteAchievement } from "@/app/projects/actions";
import { ConfirmButton } from "./confirm-button";

const categoryBadgeCls: Record<AchievementCategory, string> = {
  COST_SAVING: "bg-green-50 text-green-700",
  SCHEDULE: "bg-blue-50 text-blue-700",
  QUALITY: "bg-purple-50 text-purple-700",
  SAFETY: "bg-red-50 text-red-700",
  TECH_IMPROVEMENT: "bg-indigo-50 text-indigo-700",
  OTHER: "bg-zinc-100 text-zinc-600",
};

export type AchievementItem = {
  id: string;
  rawText: string;
  category: AchievementCategory;
  metricValue: number | null;
  metricUnit: string | null;
  occurredAt: Date;
  project?: { id: string; name: string };
};

export function AchievementList({
  achievements,
  canDelete = false,
}: {
  achievements: AchievementItem[];
  canDelete?: boolean;
}) {
  if (achievements.length === 0) {
    return (
      <p className="text-sm text-zinc-500">아직 기록된 성과가 없습니다.</p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {achievements.map((a) => (
        <li key={a.id} className="flex items-start gap-3 py-2.5">
          <span className="w-20 shrink-0 pt-0.5 text-xs text-zinc-400">
            {formatDate(a.occurredAt)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-800">{a.rawText}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${categoryBadgeCls[a.category]}`}
              >
                {achievementCategoryLabels[a.category]}
              </span>
              {a.metricValue !== null && (
                <span className="text-xs font-medium text-zinc-600">
                  {a.metricValue.toLocaleString()}
                  {a.metricUnit ? ` ${a.metricUnit}` : ""}
                </span>
              )}
              {a.project && (
                <Link
                  href={`/projects/${a.project.id}`}
                  className="text-xs text-zinc-400 hover:text-zinc-700"
                >
                  {a.project.name}
                </Link>
              )}
            </div>
          </div>
          {canDelete && (
            <ConfirmButton
              action={deleteAchievement.bind(null, a.id)}
              message="이 성과 기록을 삭제할까요?"
              className="shrink-0 text-xs text-zinc-300 hover:text-red-500"
            >
              삭제
            </ConfirmButton>
          )}
        </li>
      ))}
    </ul>
  );
}
