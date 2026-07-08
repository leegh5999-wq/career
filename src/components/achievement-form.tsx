// 성과 한 줄 기록 폼 — 프로젝트 상세(고정 projectId)와 대시보드(프로젝트 선택)에서 공용
import { AchievementCategory } from "@/generated/prisma/enums";
import { achievementCategoryLabels } from "@/lib/labels";
import { todayKstInput } from "@/lib/format";
import { inputCls } from "@/lib/ui";
import { createAchievement } from "@/app/projects/actions";
import { SubmitButton } from "./submit-button";

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
          <select
            name="projectId"
            required
            aria-label="프로젝트 선택"
            className={inputCls}
          >
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
          aria-label="성과 내용"
          placeholder="오늘 한 일·성과를 한 줄로 (예: 간선 루트 재검토로 자재비 1,800만원 절감)"
          className={`${inputCls} min-w-60 flex-1`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          name="category"
          defaultValue={AchievementCategory.OTHER}
          aria-label="성과 분류"
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
          aria-label="정량 수치"
          className={`${inputCls} w-24`}
        />
        <input
          name="metricUnit"
          placeholder="단위 (%, 만원)"
          aria-label="수치 단위"
          className={`${inputCls} w-28`}
        />
        <input
          type="date"
          name="occurredAt"
          defaultValue={todayKstInput()}
          aria-label="성과 발생일"
          className={inputCls}
        />
        <SubmitButton>기록</SubmitButton>
      </div>
    </form>
  );
}
