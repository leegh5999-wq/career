// 성과 한 줄 기록 폼 — 프로젝트 상세(고정 projectId)와 대시보드(프로젝트 선택)에서 공용
import { AchievementCategory } from "@/generated/prisma/enums";
import { achievementCategoryLabels } from "@/lib/labels";
import { toDateInput } from "@/lib/format";
import { createAchievement } from "@/app/projects/actions";

const inputCls =
  "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none";

export function AchievementForm({
  projectId,
  projects,
}: {
  projectId?: string;
  projects?: { id: string; name: string }[];
}) {
  return (
    <form action={createAchievement} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {projectId ? (
          <input type="hidden" name="projectId" value={projectId} />
        ) : (
          <select name="projectId" required className={inputCls}>
            <option value="">프로젝트 선택</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        <input
          name="rawText"
          required
          placeholder="오늘 한 일·성과를 한 줄로 (예: 간선 루트 재검토로 자재비 1,800만원 절감)"
          className={`${inputCls} min-w-60 flex-1`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          name="category"
          defaultValue={AchievementCategory.OTHER}
          className={inputCls}
        >
          {Object.values(AchievementCategory).map((c) => (
            <option key={c} value={c}>
              {achievementCategoryLabels[c]}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="any"
          name="metricValue"
          placeholder="수치"
          className={`${inputCls} w-24`}
        />
        <input
          name="metricUnit"
          placeholder="단위 (%, 만원)"
          className={`${inputCls} w-28`}
        />
        <input
          type="date"
          name="occurredAt"
          defaultValue={toDateInput(new Date())}
          className={inputCls}
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          기록
        </button>
      </div>
    </form>
  );
}
